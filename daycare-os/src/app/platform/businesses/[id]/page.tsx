"use client";
/* Business management: status lifecycle, invitation resend/copy, workspace link.
   Every action: validation, loading, success/error, audit event, confirm on destructive. */
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { PlatformShell } from "../../platform-shell";
import { PageHeader } from "@ui/shell";
import { statusBadge } from "../../status-badge";
import { Copy, Check, ExternalLink, RefreshCcw } from "lucide-react";

export default function ManageBusiness() {
  const { id } = useParams<{ id: string }>();
  const sb = supabaseBrowser();
  const [biz, setBiz] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ kind: "success" | "danger"; text: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [b, e, m, i] = await Promise.all([
      sb.from("businesses").select("*").eq("id", id).single(),
      sb.from("ai_employees").select("id,type,name,is_active").eq("business_id", id),
      sb.from("members").select("id,role,status,user_id").eq("business_id", id),
      sb.from("invitations").select("id,email,role,status,token,expires_at").eq("business_id", id).order("sent_at", { ascending: false }),
    ]);
    setBiz(b.data); setEmployees(e.data ?? []); setMembers(m.data ?? []); setInvites(i.data ?? []);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load(); }, [load]);

  async function setStatus(status: string, confirmText?: string) {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(status); setMsg(null);
    const { error } = await sb.from("businesses").update({ onboarding_status: status }).eq("id", id);
    if (error) { setMsg({ kind: "danger", text: error.message }); setBusy(null); return; }
    const uid = (await sb.auth.getUser()).data.user?.id;
    await sb.from("audit_logs").insert({ business_id: id, actor_user_id: uid, action: `business_${status}`, entity_type: "business", entity_id: id });
    setMsg({ kind: "success", text: `Business is now ${status.replace(/_/g, " ")}.` });
    setBusy(null); load();
  }

  async function resendInvite(oldId: string, email: string, role: string) {
    setBusy("resend"); setMsg(null);
    const uid = (await sb.auth.getUser()).data.user?.id;
    await sb.from("invitations").update({ status: "revoked" }).eq("id", oldId);
    const { data, error } = await sb.from("invitations")
      .insert({ business_id: id, email, role, sent_by: uid }).select("token").single();
    if (error) { setMsg({ kind: "danger", text: error.message }); setBusy(null); return; }
    await sb.from("audit_logs").insert({ business_id: id, actor_user_id: uid, action: "invitation_resent", entity_type: "invitation", entity_id: email });
    setMsg({ kind: "success", text: `New invitation created for ${email} — copy the fresh link below.` });
    setBusy(null); load();
    void data;
  }

  async function copyLink(token: string) {
    await navigator.clipboard.writeText(`${window.location.origin}/invite/${token}`);
    setCopied(token); setTimeout(() => setCopied(null), 2000);
  }

  if (!biz) return <PlatformShell><p className="text-secondary">Loading business…</p></PlatformShell>;
  const st = biz.onboarding_status ?? "draft";

  return (
    <PlatformShell>
      <PageHeader title={biz.name} description={`${biz.location || ""} · ${biz.timezone || ""} · plan-managed workspace`}
        badge={statusBadge(st)}
        actions={<>
          <Link href={`/w/${biz.slug}`} className="btn btn-secondary" target="_blank"><ExternalLink size={15} /> Open workspace</Link>
          {st !== "live" && st !== "archived" && (
            <button type="button" className="btn btn-primary" disabled={busy !== null} onClick={() => setStatus("live")}>
              {busy === "live" ? "Activating…" : "Activate (Live)"}
            </button>)}
          {st === "live" && (
            <button type="button" className="btn btn-danger" disabled={busy !== null}
              onClick={() => setStatus("suspended", `Suspend ${biz.name}? All workspace users lose access until reactivated.`)}>
              {busy === "suspended" ? "Suspending…" : "Suspend"}
            </button>)}
          {st === "suspended" && (
            <button type="button" className="btn btn-primary" disabled={busy !== null} onClick={() => setStatus("live")}>Reactivate</button>)}
          {st !== "archived" && (
            <button type="button" className="btn btn-ghost" disabled={busy !== null}
              onClick={() => setStatus("archived", `Archive ${biz.name}? The workspace becomes inaccessible (data is retained).`)}>Archive</button>)}
        </>} />

      {msg && <div role="status" style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 8, fontSize: "0.8125rem", background: msg.kind === "success" ? "var(--success-soft)" : "var(--danger-soft)", color: msg.kind === "success" ? "var(--success)" : "var(--danger)" }}>{msg.text}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        <div className="card">
          <div className="overline" style={{ marginBottom: 12 }}>AI employees ({employees.length})</div>
          {employees.length === 0 && <p className="text-secondary" style={{ fontSize: "0.8125rem" }}>None assigned yet.</p>}
          {employees.map((e) => (
            <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: "0.84375rem" }}>
              <span style={{ fontWeight: 600 }}>{e.name}</span>
              <span className="text-secondary" style={{ fontSize: "0.71875rem" }}>{e.type}</span>
              <span className={`badge ${e.is_active ? "badge-success" : "badge-neutral"}`} style={{ marginLeft: "auto" }}>{e.is_active ? "active" : "paused"}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="overline" style={{ marginBottom: 12 }}>Owner & invitations</div>
          {members.length > 0 && (
            <div style={{ marginBottom: 10, fontSize: "0.8125rem" }}>
              {members.map((m) => (
                <div key={m.id} style={{ display: "flex", gap: 8, padding: "6px 0" }}>
                  <span className="badge badge-primary">{m.role}</span>
                  <span className={`badge ${m.status === "active" ? "badge-success" : "badge-neutral"}`}>{m.status}</span>
                  <span className="text-secondary" style={{ fontSize: "0.71875rem" }}>activated</span>
                </div>
              ))}
            </div>
          )}
          {invites.map((inv) => (
            <div key={inv.id} style={{ padding: "9px 0", borderBottom: "1px solid var(--border)", fontSize: "0.8125rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <b>{inv.email}</b><span className="badge badge-neutral">{inv.role}</span>
                <span className={`badge ${inv.status === "pending" ? "badge-warning" : inv.status === "accepted" ? "badge-success" : "badge-neutral"}`}>{inv.status}</span>
              </div>
              {inv.status === "pending" && (
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => copyLink(inv.token)}>
                    {copied === inv.token ? <Check size={13} /> : <Copy size={13} />} {copied === inv.token ? "Copied" : "Copy invite link"}
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm" disabled={busy === "resend"} onClick={() => resendInvite(inv.id, inv.email, inv.role)}>
                    <RefreshCcw size={13} /> {busy === "resend" ? "Resending…" : "Resend (new link)"}
                  </button>
                </div>
              )}
            </div>
          ))}
          {invites.length === 0 && members.length === 0 && <p className="text-secondary" style={{ fontSize: "0.8125rem" }}>No owner invited yet.</p>}
          <p className="text-secondary" style={{ fontSize: "0.71875rem", marginTop: 10 }}>
            Automatic invitation email: Phase 10 integration. Until then, copy the link and send it manually.</p>
        </div>

        <div className="card">
          <div className="overline" style={{ marginBottom: 12 }}>Business details</div>
          <div style={{ fontSize: "0.8125rem", lineHeight: 2.1 }}>
            <b>Slug:</b> {biz.slug}<br />
            <b>Email:</b> {biz.email || "—"} · <b>Phone:</b> {biz.phone || "—"}<br />
            <b>Website:</b> {biz.website || "—"}<br />
            <b>Modules enabled:</b> {(biz.enabled_modules || []).length}<br />
            <b>Sandbox:</b> {biz.is_sandbox ? "yes" : "no"}
          </div>
        </div>
      </div>
    </PlatformShell>
  );
}

