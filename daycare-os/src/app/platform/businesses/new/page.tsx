"use client";
/* New Daycare Setup — Platform Admin onboarding (brief §22).
   Real database writes at every step: Save Draft persists immediately,
   Create Business provisions plan + AI employees + owner invitation. */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { PlatformShell } from "../../platform-shell";
import { PageHeader } from "@ui/shell";
import { Check, Copy, Lock } from "lucide-react";
import { EMPLOYEE_TYPES, WORKSPACE_MODULES, slugify } from "@catalog/employees";

const STEPS = ["Business", "Plan & Modules", "AI Employees", "Owner", "Review & Create"];
const PLANS = ["starter", "professional", "enterprise"] as const;

type S = {
  name: string; legalName: string; location: string; timezone: string;
  phone: string; email: string; website: string;
  plan: string; modules: string[]; employees: string[]; limits: { users: number };
  ownerName: string; ownerEmail: string;
};

export default function NewDaycareSetup() {
  const router = useRouter();
  const sb = supabaseBrowser();
  const [step, setStep] = useState(0);
  const [bizId, setBizId] = useState<string | null>(null);
  const [s, setS] = useState<S>({
    name: "", legalName: "", location: "", timezone: "America/Toronto",
    phone: "", email: "", website: "",
    plan: "professional",
    modules: WORKSPACE_MODULES.map((m) => m.key),
    employees: EMPLOYEE_TYPES.filter((e) => e.availableInPhase === null).map((e) => e.key),
    limits: { users: 10 },
    ownerName: "", ownerEmail: "",
  });
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const set = (patch: Partial<S>) => setS((p) => ({ ...p, ...patch }));

  useEffect(() => { setError(null); }, [step]);

  function validateStep(): string | null {
    if (step === 0) {
      if (s.name.trim().length < 2) return "Business display name is required.";
      if (!s.location.trim()) return "Location is required.";
      if (s.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s.email)) return "Business email is not valid.";
    }
    if (step === 2 && s.employees.length === 0) return "Select at least one AI employee.";
    if (step === 3) {
      if (s.ownerName.trim().length < 2) return "Owner name is required.";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s.ownerEmail)) return "Owner email is not valid.";
    }
    return null;
  }

  async function saveDraft(silent = false): Promise<string | null> {
    if (s.name.trim().length < 2) { setError("Add the business name before saving."); return null; }
    setBusy("draft"); setError(null);
    const payload = {
      name: s.name.trim(), legal_name: s.legalName.trim() || s.name.trim(),
      display_name: s.name.trim(), location: s.location.trim(), timezone: s.timezone,
      phone: s.phone.trim(), email: s.email.trim(), website: s.website.trim(),
      industry_edition: "daycare", enabled_modules: s.modules, limits: s.limits,
      industry: "Daycare", business_type: "Daycare",
    };
    let id = bizId;
    if (!id) {
      const { data, error: err } = await sb.from("businesses")
        .insert({ ...payload, slug: slugify(s.name) + "-" + Math.random().toString(36).slice(2, 6), onboarding_status: "draft", status: "active" })
        .select("id").single();
      if (err) { setError(err.message); setBusy(null); return null; }
      id = data.id; setBizId(id);
      await sb.from("audit_logs").insert({ business_id: id, actor_user_id: (await sb.auth.getUser()).data.user?.id, action: "business_draft_created", entity_type: "business", entity_id: id });
    } else {
      const { error: err } = await sb.from("businesses").update(payload).eq("id", id);
      if (err) { setError(err.message); setBusy(null); return null; }
    }
    setBusy(null);
    if (!silent) setError(null);
    return id;
  }

  async function next() {
    const v = validateStep();
    if (v) { setError(v); return; }
    if (step === 0) { const id = await saveDraft(true); if (!id) return; }
    setStep((x) => Math.min(x + 1, STEPS.length - 1));
  }

  async function createBusiness() {
    const v = validateStep(); if (v) { setError(v); return; }
    setBusy("create"); setError(null);
    const id = await saveDraft(true);
    if (!id) { setBusy(null); return; }
    const uid = (await sb.auth.getUser()).data.user?.id;

    /* plan → subscription */
    const { data: plan } = await sb.from("plans").select("id").eq("key", s.plan).single();
    if (plan) {
      await sb.from("subscriptions").insert({ business_id: id, plan_id: plan.id, status: "active" });
    }
    /* AI employees (only fully-working ones are selectable) */
    const rows = s.employees.map((key) => {
      const def = EMPLOYEE_TYPES.find((e) => e.key === key)!;
      return {
        business_id: id, type: def.engineType || key, name: def.name,
        engine: "rule-based", is_active: true,
        config: { employeeKey: key, description: def.description },
      };
    });
    if (rows.length) {
      const { error: empErr } = await sb.from("ai_employees").insert(rows);
      if (empErr) { setError("AI employees: " + empErr.message); setBusy(null); return; }
    }
    /* owner invitation */
    const { data: inv, error: invErr } = await sb.from("invitations")
      .insert({ business_id: id, email: s.ownerEmail.trim().toLowerCase(), role: "owner", sent_by: uid })
      .select("token").single();
    if (invErr) { setError("Invitation: " + invErr.message); setBusy(null); return; }

    await sb.from("businesses").update({ onboarding_status: "owner_invited" }).eq("id", id);
    await sb.from("audit_logs").insert([
      { business_id: id, actor_user_id: uid, action: "business_created", entity_type: "business", entity_id: id },
      { business_id: id, actor_user_id: uid, action: "owner_invited", entity_type: "invitation", entity_id: s.ownerEmail },
    ]);
    setInviteLink(`${window.location.origin}/invite/${inv.token}`);
    setBusy(null);
    setStep(STEPS.length - 1);
  }

  const inp = (key: keyof S, label: string, placeholder = "", required = false, type = "text") => (
    <div className="field" style={{ marginBottom: 14 }}>
      <label>{label} {required && <span style={{ color: "var(--danger)" }}>*</span>}</label>
      <input className="input" type={type} value={s[key] as string} placeholder={placeholder}
        onChange={(e) => set({ [key]: e.target.value } as Partial<S>)} />
    </div>
  );

  return (
    <PlatformShell>
      <PageHeader title="New Daycare Setup"
        description="Create the business, choose its plan and AI employees, then invite the owner."
        badge={bizId ? <span className="badge badge-info">Draft saved</span> : <span className="badge badge-neutral">Not saved</span>} />

      {/* stepper */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
        {STEPS.map((st, i) => (
          <span key={st} className={`badge ${i === step ? "badge-primary" : i < step ? "badge-success" : "badge-neutral"}`}>
            {i < step ? <Check size={12} /> : null} {i + 1}. {st}
          </span>
        ))}
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        {step === 0 && (<>
          <h3 style={{ marginBottom: 16 }}>Business information</h3>
          {inp("name", "Display name", "e.g. Sunshine Nursery", true)}
          {inp("legalName", "Legal / registered name", "Defaults to display name")}
          {inp("location", "City / location", "City, Province", true)}
          {inp("timezone", "Timezone", "America/Toronto")}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {inp("phone", "Phone", "+1 …")}
            {inp("email", "Business email", "hello@…", false, "email")}
          </div>
          {inp("website", "Website", "https://…")}
        </>)}

        {step === 1 && (<>
          <h3 style={{ marginBottom: 6 }}>Subscription plan</h3>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {PLANS.map((p) => (
              <button key={p} type="button" onClick={() => set({ plan: p })}
                className={`btn ${s.plan === p ? "btn-primary" : "btn-secondary"}`} style={{ textTransform: "capitalize" }}>
                {s.plan === p && <Check size={15} />} {p}
              </button>
            ))}
          </div>
          <h3 style={{ marginBottom: 6 }}>Enabled modules</h3>
          <p className="text-secondary" style={{ fontSize: "0.78125rem", marginBottom: 12 }}>
            Modules unlock as their phases ship — enabling one now means it appears the moment it's ready.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 6 }}>
            {WORKSPACE_MODULES.map((m) => {
              const on = s.modules.includes(m.key);
              return (
                <label key={m.key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8125rem", padding: "7px 10px", borderRadius: 8, background: on ? "var(--primary-soft)" : "var(--surface-subtle)", cursor: "pointer" }}>
                  <input type="checkbox" checked={on}
                    onChange={(e) => set({ modules: e.target.checked ? [...s.modules, m.key] : s.modules.filter((x) => x !== m.key) })} />
                  {m.name}
                  {m.availableInPhase && <span className="text-secondary" style={{ fontSize: "0.65625rem", marginLeft: "auto" }}>Phase {m.availableInPhase}</span>}
                </label>
              );
            })}
          </div>
        </>)}

        {step === 2 && (<>
          <h3 style={{ marginBottom: 6 }}>Assign AI employees</h3>
          <p className="text-secondary" style={{ fontSize: "0.78125rem", marginBottom: 14 }}>
            Only fully working AI employees can be assigned. Locked ones ship in later phases — we never sell an unfinished employee.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {EMPLOYEE_TYPES.map((e) => {
              const locked = e.availableInPhase !== null;
              const on = s.employees.includes(e.key);
              return (
                <label key={e.key} style={{
                  display: "flex", alignItems: "flex-start", gap: 10, padding: "11px 13px", borderRadius: 10,
                  border: `1px solid ${on ? "var(--primary)" : "var(--border)"}`,
                  background: on ? "var(--primary-soft)" : "var(--surface)",
                  opacity: locked ? 0.55 : 1, cursor: locked ? "not-allowed" : "pointer",
                }}>
                  <input type="checkbox" checked={on} disabled={locked} style={{ marginTop: 3 }}
                    onChange={(ev) => set({ employees: ev.target.checked ? [...s.employees, e.key] : s.employees.filter((x) => x !== e.key) })} />
                  <span>
                    <span style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                      {e.name} {locked && <span className="badge badge-neutral"><Lock size={11} /> Phase {e.availableInPhase}</span>}
                    </span>
                    <span className="text-secondary" style={{ fontSize: "0.75rem" }}>{e.description}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </>)}

        {step === 3 && (<>
          <h3 style={{ marginBottom: 16 }}>Business owner account</h3>
          {inp("ownerName", "Owner full name", "e.g. Sarah Chen", true)}
          {inp("ownerEmail", "Owner email", "owner@daycare.com", true, "email")}
          <p className="text-secondary" style={{ fontSize: "0.78125rem" }}>
            Creating the business generates a secure invitation link (valid 7 days). Automatic invitation emails arrive with the
            email integration in Phase 10 — until then you copy the link and send it yourself. Honest labels, no fake sends.</p>
        </>)}

        {step === 4 && (<>
          <h3 style={{ marginBottom: 16 }}>{inviteLink ? "Business created ✓" : "Review"}</h3>
          {!inviteLink ? (
            <div style={{ fontSize: "0.84375rem", lineHeight: 2.1 }}>
              <b>{s.name}</b> · {s.location} · {s.timezone}<br />
              Plan: <span className="badge badge-primary" style={{ textTransform: "capitalize" }}>{s.plan}</span> ·
              Modules: {s.modules.length} · AI employees: {s.employees.length}<br />
              Owner: {s.ownerName} &lt;{s.ownerEmail}&gt;
            </div>
          ) : (
            <>
              <p style={{ fontSize: "0.84375rem", marginBottom: 12 }}>
                <b>{s.name}</b> is provisioned with {s.employees.length} AI employees. Send the owner this activation link:</p>
              <div style={{ display: "flex", gap: 8, alignItems: "center", background: "var(--surface-subtle)", borderRadius: 10, padding: "10px 12px", fontSize: "0.78125rem", wordBreak: "break-all" }}>
                <span style={{ flex: 1 }}>{inviteLink}</span>
                <button type="button" className="btn btn-secondary btn-sm" onClick={async () => {
                  await navigator.clipboard.writeText(inviteLink); setCopied(true); setTimeout(() => setCopied(false), 2000);
                }}>{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}</button>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
                <button type="button" className="btn btn-primary" onClick={() => router.push(`/platform/businesses/${bizId}`)}>Open business</button>
                <button type="button" className="btn btn-secondary" onClick={() => router.push("/platform/businesses")}>All businesses</button>
              </div>
            </>
          )}
        </>)}

        {error && <div role="alert" style={{ marginTop: 14, padding: "10px 14px", background: "var(--danger-soft)", color: "var(--danger)", borderRadius: 8, fontSize: "0.8125rem" }}>{error}</div>}

        {!inviteLink && (
          <div style={{ display: "flex", gap: 8, marginTop: 22, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
            {step > 0 && <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}>← Back</button>}
            <button type="button" className="btn btn-secondary" onClick={() => saveDraft()} disabled={busy !== null}>
              {busy === "draft" ? "Saving…" : "Save draft"}
            </button>
            <div style={{ marginLeft: "auto" }}>
              {step < STEPS.length - 1
                ? <button type="button" className="btn btn-primary" onClick={next}>Continue →</button>
                : <button type="button" className="btn btn-primary" onClick={createBusiness} disabled={busy !== null}>
                    {busy === "create" ? "Creating…" : "Create business & invite owner"}
                  </button>}
            </div>
          </div>
        )}
      </div>
    </PlatformShell>
  );
}
