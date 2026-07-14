"use client";
/* Command Center interactive sections. All writes go through RLS
   (role-checked in Postgres) and log to ai_activity_log + audit. */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { EmptyState } from "@ui/shell";
import {
  Bot, Pause, Play, PhoneCall, CalendarCheck, AlertTriangle, Inbox,
  Plus, X, CheckCircle2, UserPlus, Megaphone, BookOpen, Palette, Printer,
} from "lucide-react";

type Employee = { id: string; name: string; type: string; is_active: boolean };
type Priority = { id: string; kind: "lead" | "booking"; title: string; sub: string; action: string; urgent: boolean };

const OPS_ROLES = ["owner", "director", "manager", "reception"];
const LEAD_ROLES = ["owner", "director"];

export function CommandCenter({
  bizId, role, isPlatformAdmin, employees, priorities,
}: {
  bizId: string; role: string; isPlatformAdmin: boolean;
  employees: Employee[]; priorities: Priority[];
}) {
  const router = useRouter();
  const sb = supabaseBrowser();
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<{ kind: "success" | "danger"; text: string } | null>(null);
  const [modal, setModal] = useState<"enquiry" | "tour" | null>(null);
  const canOps = isPlatformAdmin || OPS_ROLES.includes(role);
  const canPause = isPlatformAdmin || LEAD_ROLES.includes(role);

  function flash(kind: "success" | "danger", text: string) {
    setToast({ kind, text });
    setTimeout(() => setToast(null), 3500);
  }
  async function logActivity(kind: string, summary: string, entity_type?: string, entity_id?: string) {
    const uid = (await sb.auth.getUser()).data.user?.id;
    await sb.from("ai_activity_log").insert({ business_id: bizId, actor_user_id: uid, kind, summary, entity_type, entity_id });
  }

  async function togglePause(e: Employee) {
    if (!canPause) return;
    if (e.is_active && !window.confirm(`Pause ${e.name}? It stops handling new conversations until resumed.`)) return;
    setBusy(e.id);
    const { error } = await sb.from("ai_employees").update({ is_active: !e.is_active }).eq("id", e.id);
    if (error) flash("danger", error.message);
    else {
      await logActivity(e.is_active ? "employee_paused" : "employee_resumed",
        `${e.name} ${e.is_active ? "paused" : "resumed"}`, "ai_employee", e.id);
      flash("success", `${e.name} ${e.is_active ? "paused" : "resumed"}.`);
      router.refresh();
    }
    setBusy(null);
  }

  async function resolvePriority(p: Priority) {
    if (!canOps) return;
    setBusy(p.id);
    const { error } = p.kind === "lead"
      ? await sb.from("leads").update({ status: "Won" }).eq("id", p.id)
      : await sb.from("bookings").update({ status: "confirmed" }).eq("id", p.id);
    if (error) flash("danger", error.message);
    else {
      await logActivity(p.kind === "lead" ? "enquiry_resolved" : "tour_confirmed",
        `${p.kind === "lead" ? "Resolved" : "Confirmed"}: ${p.title}`, p.kind, p.id);
      flash("success", p.kind === "lead" ? "Marked resolved." : "Tour confirmed.");
      router.refresh();
    }
    setBusy(null);
  }

  /* ── Quick action forms ─────────────────────────────── */
  const [form, setForm] = useState({ name: "", phone: "", email: "", note: "", date: "" });
  async function submitQuick(e: React.FormEvent) {
    e.preventDefault();
    if (form.name.trim().length < 2) return flash("danger", "Parent name is required.");
    if (!form.phone.trim() && !form.email.trim()) return flash("danger", "Add a phone or email so the team can follow up.");
    setBusy("quick");
    const { data: lead, error } = await sb.from("leads").insert({
      business_id: bizId, name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(),
      enquiry_type: modal === "tour" ? "Tour Request" : "General Enquiry",
      channel: "manual", source: "staff-entry", status: "New", notes: form.note.trim(),
    }).select("id").single();
    if (error) { flash("danger", error.message); setBusy(null); return; }
    if (modal === "tour") {
      const { error: bErr } = await sb.from("bookings").insert({
        business_id: bizId, lead_id: lead.id, service: "Tour Request",
        booking_date: form.date ? new Date(form.date).toISOString() : null,
        status: "pending", notes: form.note.trim(),
      });
      if (bErr) { flash("danger", bErr.message); setBusy(null); return; }
    }
    await logActivity(modal === "tour" ? "tour_booked" : "enquiry_created",
      `${modal === "tour" ? "Tour request added" : "Parent enquiry added"} for ${form.name.trim()} (staff entry)`, "lead", lead.id);
    flash("success", modal === "tour" ? "Tour request created." : "Parent enquiry added.");
    setModal(null); setForm({ name: "", phone: "", email: "", note: "", date: "" });
    setBusy(null); router.refresh();
  }

  const QUICK: { label: string; icon: React.ReactNode; onClick?: () => void; phase?: number }[] = [
    { label: "Add parent enquiry", icon: <Plus size={15} />, onClick: () => setModal("enquiry") },
    { label: "Book a tour", icon: <CalendarCheck size={15} />, onClick: () => setModal("tour") },
    { label: "Send announcement", icon: <Megaphone size={15} />, phase: 7 },
    { label: "Upload knowledge", icon: <BookOpen size={15} />, phase: 9 },
    { label: "Create activity", icon: <Palette size={15} />, phase: 8 },
    { label: "Generate printable", icon: <Printer size={15} />, phase: 8 },
    { label: "Invite team member", icon: <UserPlus size={15} />, phase: 11 },
  ];

  return (
    <>
      {toast && (
        <div role="status" style={{ position: "fixed", bottom: 20, right: 20, zIndex: 90, padding: "11px 16px", borderRadius: 10, fontSize: "0.8125rem", fontWeight: 600, boxShadow: "var(--shadow-lg)", background: toast.kind === "success" ? "var(--success)" : "var(--danger)", color: "#fff" }}>
          {toast.text}
        </div>
      )}

      {/* Quick actions */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {QUICK.map((q) => (
          <button key={q.label} type="button"
            className={`btn btn-sm ${q.onClick ? "btn-secondary" : "btn-ghost"}`}
            disabled={!q.onClick || !canOps}
            title={q.phase ? `Arrives in Phase ${q.phase}` : !canOps ? "Your role can't do this" : q.label}
            onClick={q.onClick}>
            {q.icon} {q.label}{q.phase ? <span className="text-secondary" style={{ fontSize: "0.65625rem" }}> · P{q.phase}</span> : null}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 16 }} className="cc-cols">
        {/* Priority actions */}
        <div className="card">
          <div className="overline" style={{ marginBottom: 12 }}>Priority parent requests</div>
          {priorities.length === 0 ? (
            <p className="text-secondary" style={{ fontSize: "0.8125rem", padding: "8px 0" }}>
              <CheckCircle2 size={14} style={{ verticalAlign: -2 }} /> Nothing needs your attention right now.
            </p>
          ) : priorities.map((p) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ display: "inline-flex", padding: 7, borderRadius: 8, background: p.urgent ? "var(--danger-soft)" : "var(--warning-soft)", color: p.urgent ? "var(--danger)" : "var(--warning)" }}>
                {p.urgent ? <AlertTriangle size={15} /> : p.kind === "booking" ? <CalendarCheck size={15} /> : <Inbox size={15} />}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontWeight: 600, fontSize: "0.84375rem", display: "block" }}>{p.title}</span>
                <span className="text-secondary" style={{ fontSize: "0.71875rem" }}>{p.sub}</span>
              </span>
              <button type="button" className="btn btn-secondary btn-sm" disabled={busy === p.id || !canOps}
                title={canOps ? p.action : "Your role can't do this"} onClick={() => resolvePriority(p)}>
                {busy === p.id ? "…" : p.action}
              </button>
            </div>
          ))}
        </div>

        {/* AI workforce */}
        <div className="card">
          <div className="overline" style={{ marginBottom: 12 }}>AI workforce</div>
          {employees.length === 0 ? (
            <EmptyState icon={<Bot size={20} />} title="No AI employees assigned"
              description="Your Digital Rise administrator assigns AI employees to this workspace." />
          ) : employees.map((e) => (
            <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ display: "inline-flex", padding: 8, borderRadius: 9, background: "var(--primary-soft)", color: "var(--primary)" }}><Bot size={16} /></span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontWeight: 600, fontSize: "0.84375rem", display: "block" }}>{e.name}</span>
                <span className={`badge ${e.is_active ? "badge-success" : "badge-neutral"}`}>
                  {e.is_active ? <><span className="dot live" /> working</> : "paused"}
                </span>
              </span>
              {canPause && (
                <button type="button" className="btn btn-ghost btn-sm" disabled={busy === e.id}
                  title={e.is_active ? "Pause this AI employee" : "Resume this AI employee"} onClick={() => togglePause(e)}>
                  {e.is_active ? <Pause size={14} /> : <Play size={14} />} {e.is_active ? "Pause" : "Resume"}
                </button>
              )}
            </div>
          ))}
          <p className="text-secondary" style={{ fontSize: "0.6875rem", marginTop: 10 }}>
            <PhoneCall size={11} style={{ verticalAlign: -1 }} /> Individual employee workspaces arrive in Phase 4.
          </p>
        </div>
      </div>
      <style>{`@media(max-width:900px){.cc-cols{grid-template-columns:1fr!important}}`}</style>

      {/* Quick-action modal */}
      {modal && (
        <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, zIndex: 80, display: "grid", placeItems: "center", background: "rgba(14,20,32,.45)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setModal(null); }}>
          <div className="card page-in" style={{ width: "100%", maxWidth: 440, boxShadow: "var(--shadow-lg)" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
              <h3>{modal === "tour" ? "Book a tour" : "Add parent enquiry"}</h3>
              <button type="button" className="btn btn-ghost btn-icon" style={{ marginLeft: "auto" }} aria-label="Close" onClick={() => setModal(null)}><X size={16} /></button>
            </div>
            <form onSubmit={submitQuick}>
              <div className="field" style={{ marginBottom: 12 }}>
                <label>Parent name <span style={{ color: "var(--danger)" }}>*</span></label>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sarah Chen" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div className="field" style={{ marginBottom: 12 }}>
                  <label>Phone</label>
                  <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 …" />
                </div>
                <div className="field" style={{ marginBottom: 12 }}>
                  <label>Email</label>
                  <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="parent@…" />
                </div>
              </div>
              {modal === "tour" && (
                <div className="field" style={{ marginBottom: 12 }}>
                  <label>Preferred date & time</label>
                  <input className="input" type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  <span className="help">Leave empty if the team will propose times.</span>
                </div>
              )}
              <div className="field" style={{ marginBottom: 16 }}>
                <label>Note</label>
                <textarea className="input" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Child age, program interest, anything useful…" />
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={busy === "quick"}>
                  {busy === "quick" ? "Saving…" : modal === "tour" ? "Create tour request" : "Add enquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
