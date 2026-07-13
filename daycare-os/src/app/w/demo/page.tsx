"use client";
/* Sandbox workspace preview — demonstrates the Phase-1 shell, tokens,
   components and states. Clearly labeled sandbox; real data arrives with
   auth + Supabase in Phases 2–3. */
import { WorkspaceShell, PageHeader, EmptyState } from "@ui/shell";
import { Bot, Inbox, CalendarCheck, Star, Sparkles, Plus, MessageCircle, PhoneIncoming } from "lucide-react";

const metrics = [
  { label: "Parents assisted today", value: "—", icon: <MessageCircle size={16} /> },
  { label: "New enquiries", value: "—", icon: <Inbox size={16} /> },
  { label: "Tours booked", value: "—", icon: <CalendarCheck size={16} /> },
  { label: "Reviews collected", value: "—", icon: <Star size={16} /> },
];

export default function DemoWorkspace() {
  return (
    <WorkspaceShell bizSlug="demo" bizName="Sandbox Daycare">
      <PageHeader
        title="Good morning, Sandbox Daycare"
        description="This is the Phase-1 workspace shell in sandbox mode — navigation, theme, and component system. Live data connects in Phase 3."
        badge={<span className="badge badge-warning"><span className="dot" /> Sandbox</span>}
        actions={
          <>
            <button type="button" className="btn btn-secondary" title="Available in Phase 3" disabled>Quick actions</button>
            <button type="button" className="btn btn-primary" title="Available in Phase 3" disabled><Plus size={16} /> Add enquiry</button>
          </>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        {metrics.map((m) => (
          <div className="card card-hover" key={m.label} style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary)", marginBottom: 10 }}>
              {m.icon}<span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{m.label}</span>
            </div>
            <div className="tabular" style={{ fontSize: "1.625rem", fontWeight: 800 }}>{m.value}</div>
            <div className="text-secondary" style={{ fontSize: "0.71875rem", marginTop: 4 }}>Connects to live data in Phase 3</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
        <EmptyState
          icon={<Bot size={22} />}
          title="Your AI workforce will appear here"
          description="Once your daycare is onboarded and its AI employees are trained, this panel shows what each employee is doing right now — conversations handled, tours booked, follow-ups prepared."
          action={<button type="button" className="btn btn-secondary" disabled title="Phase 4">Meet the AI employees</button>}
        />
        <div className="card">
          <div className="overline" style={{ marginBottom: 12 }}>Component states (design-system check)</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            <span className="badge badge-success"><span className="dot live" /> Live</span>
            <span className="badge badge-warning">Needs attention</span>
            <span className="badge badge-info">New</span>
            <span className="badge badge-danger">Escalated</span>
            <span className="badge badge-neutral">Archived</span>
            <span className="badge badge-primary">AI handling</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button type="button" className="btn btn-primary btn-sm">Primary</button>
            <button type="button" className="btn btn-secondary btn-sm">Secondary</button>
            <button type="button" className="btn btn-ghost btn-sm">Ghost</button>
            <button type="button" className="btn btn-danger btn-sm">Danger</button>
            <button type="button" className="btn btn-primary btn-sm" disabled>Disabled</button>
          </div>
          <div className="field" style={{ marginTop: 14 }}>
            <label htmlFor="demo-input">Input field</label>
            <input id="demo-input" className="input" placeholder="Type here — focus ring, both themes" />
            <span className="help">Help text uses the secondary color. Toggle the theme in the topbar ↗</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <EmptyState
          icon={<PhoneIncoming size={22} />}
          title="No priority actions right now"
          description="When parents are waiting for a human reply, a tour needs confirmation, or a review needs attention, actionable items appear here — each with its own Review, Reply, or Confirm button."
        />
      </div>

      <p className="text-secondary" style={{ marginTop: 24, fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 6 }}>
        <Sparkles size={13} /> Phase 1 shell · engine ported with 19 passing test suites (54 assertions) · authentication lands in Phase 2.
      </p>
    </WorkspaceShell>
  );
}
