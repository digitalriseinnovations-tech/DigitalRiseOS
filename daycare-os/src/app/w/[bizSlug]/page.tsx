/* Authenticated workspace entry — real business, real membership, real role.
   The full Command Center ships in Phase 3; this page proves tenancy + auth. */
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionInfo, supabaseServer } from "@/lib/supabase";
import { WorkspaceShell, PageHeader, EmptyState } from "@ui/shell";
import { Bot, LogOut, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WorkspaceHome({ params }: { params: Promise<{ bizSlug: string }> }) {
  const { bizSlug } = await params;
  const session = await getSessionInfo();
  if (!session) redirect(`/login?next=/w/${bizSlug}`);

  const membership = session.memberships.find((m) => m.slug === bizSlug);
  const isAdminView = !membership && session.isPlatformAdmin;
  if (!membership && !isAdminView) redirect("/unauthorized");

  const sb = await supabaseServer();
  const { data: biz } = await sb.from("businesses")
    .select("id,name,slug,onboarding_status,location,enabled_modules")
    .eq("slug", bizSlug).single();
  if (!biz) redirect("/unauthorized");
  if (biz.onboarding_status === "suspended") redirect("/suspended");
  if (biz.onboarding_status === "archived") redirect("/unauthorized");

  const { data: employees } = await sb.from("ai_employees")
    .select("id,name,type,is_active").eq("business_id", biz.id);

  const role = membership?.role ?? "platform admin";
  const hr = new Date().getHours();
  const greet = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";

  return (
    <WorkspaceShell bizSlug={biz.slug} bizName={biz.name}>
      {isAdminView && (
        <div role="status" style={{ marginBottom: 16, padding: "9px 14px", borderRadius: 8, background: "var(--warning-soft)", color: "var(--warning)", fontSize: "0.8125rem", display: "flex", gap: 8, alignItems: "center" }}>
          <ShieldCheck size={15} /> Viewing as Digital Rise platform admin (support view — actions are audited).
        </div>
      )}
      <PageHeader
        title={`${greet}, ${biz.name}`}
        description={`Signed in as ${session.fullName || session.email} · role: ${role}. Your live Command Center — today's impact, AI activity and priority actions — arrives in Phase 3.`}
        badge={<span className={`badge ${biz.onboarding_status === "live" ? "badge-success" : "badge-warning"}`}>
          {biz.onboarding_status === "live" ? <><span className="dot live" /> Live</> : (biz.onboarding_status ?? "in setup").replace(/_/g, " ")}
        </span>}
        actions={<Link href="/logout" className="btn btn-ghost"><LogOut size={15} /> Sign out</Link>}
      />

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="overline" style={{ marginBottom: 12 }}>Your AI employees ({(employees ?? []).length})</div>
        {(employees ?? []).length === 0 ? (
          <p className="text-secondary" style={{ fontSize: "0.8125rem" }}>
            No AI employees assigned yet — your Digital Rise administrator sets these up.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
            {(employees ?? []).map((e) => (
              <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", borderRadius: 10, background: "var(--surface-subtle)" }}>
                <span style={{ display: "inline-flex", padding: 8, borderRadius: 9, background: "var(--primary-soft)", color: "var(--primary)" }}><Bot size={16} /></span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ fontWeight: 600, fontSize: "0.84375rem", display: "block" }}>{e.name}</span>
                  <span className={`badge ${e.is_active ? "badge-success" : "badge-neutral"}`} style={{ marginTop: 2 }}>{e.is_active ? "active" : "paused"}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <EmptyState icon={<Bot size={22} />} title="Command Center coming in Phase 3"
        description="Today's Impact metrics, live AI activity, priority parent requests and quick actions will appear here — powered by real workspace data, never placeholder numbers." />
    </WorkspaceShell>
  );
}
