/* The AI employee conversation endpoint.
   Auth-checked (member of the business), runs the tested engine against the
   business's approved knowledge, then persists structured outcomes
   (enquiry, tour request, follow-up task, activity) through RLS. */
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { createEngine } from "@engine/engine.js";
import catalog from "@catalog/raw.js";
import { createJournalStorage } from "@engine/journal-storage";

export async function POST(req: Request) {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  let body: { bizSlug?: string; employeeId?: string; message?: string; ctx?: Record<string, unknown>; transcript?: unknown[] };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }); }
  const { bizSlug, employeeId, message, ctx = {}, transcript = [] } = body;
  if (!bizSlug || !employeeId || !message || String(message).length > 2000) {
    return NextResponse.json({ error: "bizSlug, employeeId and message (≤2000 chars) are required" }, { status: 400 });
  }

  /* Tenancy: the RLS-scoped read only succeeds for members / platform admins */
  const { data: biz } = await sb.from("businesses")
    .select("id,name,slug,business_type,phone,whatsapp,review_link,metadata,onboarding_status")
    .eq("slug", bizSlug).single();
  if (!biz) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (biz.onboarding_status === "suspended") return NextResponse.json({ error: "suspended" }, { status: 403 });

  const { data: emp } = await sb.from("ai_employees")
    .select("id,type,name,is_active,config").eq("id", employeeId).eq("business_id", biz.id).single();
  if (!emp) return NextResponse.json({ error: "employee_not_found" }, { status: 404 });
  if (!emp.is_active) return NextResponse.json({ error: "employee_paused" }, { status: 409 });

  const meta = (biz.metadata as Record<string, any>) || {};
  const engineBiz = {
    id: biz.id, name: biz.name, slug: biz.slug,
    industryGroup: "childcare", businessType: biz.business_type || "Daycare",
    phone: biz.phone || "", whatsapp: biz.whatsapp || "", reviewLink: biz.review_link || "",
    knowledge: meta.knowledge || {}, intel: meta.intel || null, manualRules: meta.manualRules || [],
  };
  const engineAgent = {
    id: emp.id, agentType: emp.type, agentName: emp.name,
    channels: ["website"],
    actionsEnabled: (emp.config as any)?.actions || {},
    responseStyle: (emp.config as any)?.style || {},
    trainingStatus: "ready",
    tasksCompleted: (emp.config as any)?.tasksCompleted || 0,
  };

  const { storage, journal } = createJournalStorage();
  const engine = createEngine(storage, catalog);
  const result = engine.converse(engineBiz, engineAgent, String(message), ctx);

  /* Flush engine outcomes to the database (RLS-scoped) */
  const idMap = new Map<string, string>();
  const saved: Record<string, string> = {};
  for (const j of journal) {
    if (j.op === "create" && j.col === "leads" && j.rec) {
      const r: any = j.rec;
      const { data } = await sb.from("leads").insert({
        business_id: biz.id, ai_employee_id: emp.id,
        name: r.name, phone: r.phone, email: r.email,
        enquiry_type: r.enquiryType, channel: r.channel || "website", source: "ai-employee",
        status: r.status === "escalated" ? "Escalated" : "New",
        qual_score: r.qualScore ?? null, priority: r.priority || "normal",
        notes: r.notes || "", next_action: r.nextAction || "",
        qual_answers: { score: r.score, urgency: r.urgency, requestedService: r.requestedService,
          bookingRequested: r.bookingRequested, quoteRequested: r.quoteRequested,
          nextFollowUpDue: r.nextFollowUpDue, fields: r.fields || {} },
      }).select("id").single();
      if (data) { idMap.set(j.id, data.id); saved.leadId = data.id; }
    }
    if (j.op === "create" && j.col === "bookings" && j.rec) {
      const r: any = j.rec;
      const { data } = await sb.from("bookings").insert({
        business_id: biz.id, lead_id: r.leadId ? idMap.get(r.leadId) ?? null : null,
        service: r.service, status: "pending", booking_date: r.bookingDate, notes: r.notes || "",
      }).select("id").single();
      if (data) saved.bookingId = data.id;
    }
    if (j.op === "create" && j.col === "tasks" && j.rec) {
      const r: any = j.rec;
      const { data } = await sb.from("tasks").insert({
        business_id: biz.id, employee_id: emp.id,
        lead_id: r.leadId ? idMap.get(r.leadId) ?? null : null,
        kind: r.type, trigger: r.trigger || null, status: "scheduled",
        due_at: r.dueAt || null, message: r.message || "",
      }).select("id").single();
      if (data) saved.taskId = data.id;
    }
  }

  /* Conversation transcript on capture; activity feed entry */
  if (result.checks.leadCaptured && saved.leadId && Array.isArray(transcript) && transcript.length > 0 && !(ctx as any)._convSaved) {
    (ctx as any)._convSaved = true;
    await sb.from("conversations").insert({
      business_id: biz.id, ai_employee_id: emp.id, lead_id: saved.leadId,
      channel: "website", messages: transcript.slice(0, 200), lead_captured: true,
    });
  }
  if (result.checks.leadCaptured && saved.leadId) {
    await sb.from("ai_activity_log").insert({
      business_id: biz.id, employee_id: emp.id, actor_user_id: user.id,
      kind: result.checks.escalationNeeded ? "escalated" : "enquiry_captured",
      summary: `${emp.name} captured ${result.intentLabel.toLowerCase()} — ${(ctx as any)?.lead?.name || "parent"}${result.checks.escalationNeeded ? " (escalated to staff)" : ""}`,
      entity_type: "lead", entity_id: saved.leadId,
    });
    await sb.from("ai_employees").update({
      config: { ...(emp.config as any || {}), tasksCompleted: ((emp.config as any)?.tasksCompleted || 0) + 1 },
    }).eq("id", emp.id);
  }

  return NextResponse.json({ result, ctx, saved });
}
