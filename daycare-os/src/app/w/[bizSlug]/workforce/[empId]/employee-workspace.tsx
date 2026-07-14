"use client";
/* Individual AI employee workspace: Overview, Live Tester (writes real
   records via /api/engine/converse), Conversations, Tasks, Settings. */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Bot, Pause, Play, Send, CheckCircle2, XCircle } from "lucide-react";

const KNOWLEDGE_FIELDS: [string, string, string][] = [
  ["hours", "Hours of operation", "e.g. Mon–Fri 7:30 AM – 6:00 PM"],
  ["fees", "Fees", "e.g. Toddlers $65/day, preschool $58/day"],
  ["subsidyNotes", "Subsidy / CWELCC", "e.g. CWELCC participant, subsidies accepted"],
  ["meals", "Meals & snacks", "e.g. Hot lunch + two snacks, nut-free facility"],
  ["allergyNotes", "Allergy support", "e.g. Individual allergy plans, nut-free"],
  ["ageGroups", "Age groups", "e.g. Infants 6–18mo, Toddlers, Preschool"],
  ["tourTimes", "Tour times", "e.g. Tue & Thu 10 AM, Sat mornings"],
  ["waitlistRules", "Waitlist", "e.g. Free to join, siblings priority"],
  ["sickPolicy", "Sick policy", "e.g. Symptom-free 24h before returning"],
  ["holidayClosures", "Holiday closures", "e.g. Closed stat holidays, Dec 24–Jan 2"],
  ["escalation", "Escalation contact", "e.g. Director Sarah — 905-555-0199"],
];

type Msg = { role: "in" | "out"; text: string };

export function EmployeeWorkspace({
  bizSlug, bizId, emp, role, knowledge, conversations, tasks, counts,
}: {
  bizSlug: string; bizId: string;
  emp: { id: string; name: string; type: string; is_active: boolean; description: string; roleTitle: string; purpose: string };
  role: string; knowledge: Record<string, string>;
  conversations: any[]; tasks: any[]; counts: { leads: number; convs: number; tasks: number; done: number };
}) {
  const router = useRouter();
  const sb = supabaseBrowser();
  const TABS = ["Overview", "Live Tester", "Conversations", "Tasks", "Settings"];
  const [tab, setTab] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<{ kind: "success" | "danger"; text: string } | null>(null);
  const canManage = ["owner", "director"].includes(role) || role === "platform admin";
  const flash = (kind: "success" | "danger", text: string) => { setToast({ kind, text }); setTimeout(() => setToast(null), 3500); };

  /* Tester state */
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "in", text: `Hi! I'm ${emp.name}. Ask me anything a parent would ask — answers come from this daycare's approved knowledge.` }]);
  const [input, setInput] = useState("");
  const [ctx, setCtx] = useState<Record<string, unknown>>({});
  const [analysis, setAnalysis] = useState<any>(null);
  const [thinking, setThinking] = useState(false);

  async function send() {
    const text = input.trim();
    if (!text || thinking) return;
    setInput("");
    const newMsgs: Msg[] = [...msgs, { role: "out", text }];
    setMsgs(newMsgs); setThinking(true);
    try {
      const res = await fetch("/api/engine/converse", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bizSlug, employeeId: emp.id, message: text, ctx, transcript: newMsgs }),
      });
      const data = await res.json();
      if (!res.ok) { flash("danger", data.error === "employee_paused" ? "This employee is paused — resume it in Settings." : data.error || "Something went wrong."); setThinking(false); return; }
      setCtx(data.ctx || {});
      setMsgs((m) => [...m, { role: "in", text: data.result.reply }]);
      setAnalysis({ ...data.result, saved: data.saved });
      if (data.result.checks.leadCaptured && data.saved?.leadId) {
        flash("success", "Enquiry saved — it's now in your Command Center and Enquiries.");
        router.refresh();
      }
    } catch { flash("danger", "Network error — try again."); }
    setThinking(false);
  }
  function resetChat() {
    setMsgs([{ role: "in", text: `Fresh conversation. Ask me anything a parent would ask!` }]);
    setCtx({}); setAnalysis(null);
  }

  async function togglePause() {
    if (!canManage) return;
    if (emp.is_active && !window.confirm(`Pause ${emp.name}? It stops handling conversations until resumed.`)) return;
    setBusy("pause");
    const { error } = await sb.from("ai_employees").update({ is_active: !emp.is_active }).eq("id", emp.id);
    if (error) flash("danger", error.message);
    else {
      const uid = (await sb.auth.getUser()).data.user?.id;
      await sb.from("ai_activity_log").insert({ business_id: bizId, employee_id: emp.id, actor_user_id: uid, kind: emp.is_active ? "employee_paused" : "employee_resumed", summary: `${emp.name} ${emp.is_active ? "paused" : "resumed"}` });
      flash("success", `${emp.name} ${emp.is_active ? "paused" : "resumed"}.`);
      router.refresh();
    }
    setBusy(null);
  }

  /* Settings: knowledge editor */
  const [kb, setKb] = useState<Record<string, string>>(knowledge);
  async function saveKnowledge() {
    if (!canManage) return;
    setBusy("kb");
    const { data: bizRow, error: readErr } = await sb.from("businesses").select("metadata").eq("id", bizId).single();
    if (readErr) { flash("danger", readErr.message); setBusy(null); return; }
    const metadata = { ...(bizRow?.metadata || {}), knowledge: Object.fromEntries(Object.entries(kb).filter(([, v]) => v && v.trim())) };
    const { error } = await sb.from("businesses").update({ metadata }).eq("id", bizId);
    if (error) flash("danger", error.message);
    else {
      const uid = (await sb.auth.getUser()).data.user?.id;
      await sb.from("ai_activity_log").insert({ business_id: bizId, employee_id: emp.id, actor_user_id: uid, kind: "knowledge_updated", summary: "Approved knowledge updated — AI answers use the new information immediately" });
      flash("success", "Knowledge saved — the AI answers from it immediately.");
      router.refresh();
    }
    setBusy(null);
  }

  const yn = (v: boolean) => v
    ? <span style={{ color: "var(--success)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 3 }}><CheckCircle2 size={13} /> yes</span>
    : <span className="text-secondary" style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><XCircle size={13} /> no</span>;

  return (
    <>
      {toast && <div role="status" style={{ position: "fixed", bottom: 20, right: 20, zIndex: 90, padding: "11px 16px", borderRadius: 10, fontSize: "0.8125rem", fontWeight: 600, boxShadow: "var(--shadow-lg)", background: toast.kind === "success" ? "var(--success)" : "var(--danger)", color: "#fff" }}>{toast.text}</div>}

      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border)", marginBottom: 20, overflowX: "auto" }}>
        {TABS.map((t, i) => (
          <button key={t} type="button" onClick={() => setTab(i)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "10px 14px", fontSize: "0.84375rem", fontWeight: tab === i ? 700 : 500, color: tab === i ? "var(--primary)" : "var(--text-secondary)", borderBottom: tab === i ? "2px solid var(--primary)" : "2px solid transparent", marginBottom: -1, whiteSpace: "nowrap", fontFamily: "inherit" }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div className="card" style={{ maxWidth: 720 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
            <span style={{ display: "inline-flex", padding: 11, borderRadius: 12, background: "var(--primary-soft)", color: "var(--primary)" }}><Bot size={22} /></span>
            <div>
              <h3>{emp.roleTitle}</h3>
              <p className="text-secondary" style={{ marginTop: 4, fontSize: "0.84375rem" }}>{emp.purpose}</p>
            </div>
          </div>
          {[["Status", emp.is_active ? "Working" : "Paused"],
            ["Enquiries captured", String(counts.leads)],
            ["Conversations handled", String(counts.convs)],
            ["Follow-ups prepared", String(counts.tasks)],
            ["Tasks completed", String(counts.done)],
            ["Channel", "Website / in-app tester (widget deploys with integrations)"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", padding: "9px 0", borderBottom: "1px solid var(--border)", fontSize: "0.84375rem" }}>
              <span className="text-secondary" style={{ width: 200, flexShrink: 0 }}>{k}</span><b>{v}</b>
            </div>
          ))}
        </div>
      )}

      {tab === 1 && (
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 340px", gap: 16 }} className="ew-cols">
          <div className="card" style={{ display: "flex", flexDirection: "column", height: 480, padding: 0, overflow: "hidden" }}>
            <div style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 10, background: "var(--surface-subtle)" }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ maxWidth: "80%", padding: "9px 13px", borderRadius: 12, fontSize: "0.84375rem", lineHeight: 1.55, whiteSpace: "pre-wrap", alignSelf: m.role === "out" ? "flex-end" : "flex-start", background: m.role === "out" ? "var(--primary)" : "var(--surface)", color: m.role === "out" ? "#fff" : "var(--text)", border: m.role === "in" ? "1px solid var(--border)" : "none" }}>
                  {m.text}
                </div>
              ))}
              {thinking && <div className="text-secondary" style={{ fontSize: "0.78125rem" }}>{emp.name} is typing…</div>}
            </div>
            <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid var(--border)" }}>
              <input className="input" style={{ flex: 1 }} placeholder="Ask as a parent… e.g. What meals do you provide?"
                value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") send(); }} />
              <button type="button" className="btn btn-primary" onClick={send} disabled={thinking}><Send size={15} /></button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={resetChat} title="Start a fresh conversation">Reset</button>
            </div>
          </div>
          <div className="card" style={{ height: 480, overflowY: "auto" }}>
            <div className="overline" style={{ marginBottom: 10 }}>Outcome analysis</div>
            {!analysis ? (
              <p className="text-secondary" style={{ fontSize: "0.8125rem" }}>Send a message to see detected intent, knowledge used, confidence and what was saved. Captured enquiries create real records in this workspace.</p>
            ) : (
              <div style={{ fontSize: "0.78125rem", display: "flex", flexDirection: "column", gap: 7 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span className="text-secondary">Intent</span><b style={{ color: "var(--primary)" }}>{analysis.intentLabel}</b></div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><span className="text-secondary">Knowledge used</span><b style={{ textAlign: "right" }}>{analysis.knowledgeSource || "—"}</b></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span className="text-secondary">Confidence</span>
                  <b style={{ textTransform: "uppercase", color: analysis.confidence === "high" ? "var(--success)" : analysis.confidence === "medium" ? "var(--warning)" : "var(--danger)" }}>{analysis.confidence}</b></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span className="text-secondary">Next action</span><b>{analysis.nextAction}</b></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span className="text-secondary">Fallback used</span>{yn(analysis.fallbackUsed)}</div>
                <div style={{ borderTop: "1px solid var(--border)", margin: "4px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}><span className="text-secondary">Enquiry captured</span>{yn(analysis.checks.leadCaptured)}</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span className="text-secondary">Tour/booking offered</span>{yn(analysis.checks.bookingOffered)}</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span className="text-secondary">Follow-up prepared</span>{yn(!!analysis.saved?.taskId)}</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span className="text-secondary">Escalation</span>{yn(analysis.checks.escalationNeeded)}</div>
                {analysis.saved?.leadId && <div className="badge badge-success" style={{ marginTop: 6 }}>Saved to Enquiries ✓</div>}
              </div>
            )}
          </div>
          <style>{`@media(max-width:900px){.ew-cols{grid-template-columns:1fr!important}}`}</style>
        </div>
      )}

      {tab === 2 && (
        <div className="card">
          <div className="overline" style={{ marginBottom: 12 }}>Conversations handled ({conversations.length})</div>
          {conversations.length === 0 ? (
            <p className="text-secondary" style={{ fontSize: "0.8125rem" }}>Conversations appear here once this employee starts talking to parents (try the Live Tester).</p>
          ) : conversations.map((c) => (
            <details key={c.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <summary style={{ cursor: "pointer", fontSize: "0.84375rem", fontWeight: 600 }}>
                {new Date(c.started_at || c.created_at).toLocaleString("en-CA", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                {" · "}{(c.messages || []).length} messages
                {c.lead_captured && <span className="badge badge-success" style={{ marginLeft: 8 }}>enquiry captured</span>}
              </summary>
              <div style={{ padding: "10px 0 4px", display: "flex", flexDirection: "column", gap: 6 }}>
                {(c.messages || []).map((m: any, i: number) => (
                  <div key={i} style={{ fontSize: "0.78125rem", padding: "7px 11px", borderRadius: 9, maxWidth: "85%", alignSelf: m.role === "out" ? "flex-end" : "flex-start", background: m.role === "out" ? "var(--primary-soft)" : "var(--surface-subtle)" }}>
                    {m.text}
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      )}

      {tab === 3 && (
        <div className="card">
          <div className="overline" style={{ marginBottom: 12 }}>Follow-up tasks ({tasks.length})</div>
          {tasks.length === 0 ? (
            <p className="text-secondary" style={{ fontSize: "0.8125rem" }}>Follow-ups this employee prepares (after captured enquiries) appear here.</p>
          ) : tasks.map((t) => (
            <div key={t.id} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--border)", fontSize: "0.8125rem", alignItems: "flex-start" }}>
              <span className={`badge ${t.status === "scheduled" ? "badge-warning" : t.status === "done" ? "badge-success" : "badge-neutral"}`}>{t.status}</span>
              <span style={{ flex: 1 }}>{t.message || t.kind}</span>
              <span className="text-secondary" style={{ fontSize: "0.6875rem", whiteSpace: "nowrap" }}>
                {t.due_at ? `due ${new Date(t.due_at).toLocaleString("en-CA", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}` : ""}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === 4 && (
        <div style={{ maxWidth: 720 }}>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="overline" style={{ marginBottom: 12 }}>Employee status</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className={`badge ${emp.is_active ? "badge-success" : "badge-neutral"}`}>{emp.is_active ? "working" : "paused"}</span>
              {canManage ? (
                <button type="button" className="btn btn-secondary btn-sm" disabled={busy === "pause"} onClick={togglePause}>
                  {emp.is_active ? <Pause size={14} /> : <Play size={14} />} {busy === "pause" ? "…" : emp.is_active ? "Pause employee" : "Resume employee"}
                </button>
              ) : <span className="text-secondary" style={{ fontSize: "0.75rem" }}>Only owners and directors can pause/resume.</span>}
            </div>
          </div>
          <div className="card">
            <div className="overline" style={{ marginBottom: 6 }}>Approved knowledge</div>
            <p className="text-secondary" style={{ fontSize: "0.75rem", marginBottom: 14 }}>
              The AI answers <b>only</b> from this knowledge — anything missing gets an honest &quot;let me have the team confirm&quot; instead of a guess.
              Shared by all AI employees of this daycare. The full Knowledge Hub (website import, documents, FAQs) arrives in Phase 9.</p>
            {KNOWLEDGE_FIELDS.map(([key, label, ph]) => (
              <div className="field" key={key} style={{ marginBottom: 12 }}>
                <label>{label}</label>
                <input className="input" value={kb[key] || ""} placeholder={ph} disabled={!canManage}
                  onChange={(e) => setKb({ ...kb, [key]: e.target.value })} />
              </div>
            ))}
            {canManage && (
              <button type="button" className="btn btn-primary" disabled={busy === "kb"} onClick={saveKnowledge}>
                {busy === "kb" ? "Saving…" : "Save knowledge"}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
