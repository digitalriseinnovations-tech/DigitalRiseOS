/* AI Workforce — every assigned employee with real work counts. */
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionInfo, supabaseServer } from "@/lib/supabase";
import { WorkspaceShell, PageHeader, EmptyState } from "@ui/shell";
import { Bot } from "lucide-react";
import { EMPLOYEE_TYPES } from "@catalog/employees";

export const dynamic = "force-dynamic";

export default async function WorkforcePage({ params }: { params: Promise<{ bizSlug: string }> }) {
  const { bizSlug } = await params;
  const session = await getSessionInfo();
  if (!session) redirect(`/login?next=/w/${bizSlug}/workforce`);
  const membership = session.memberships.find((m) => m.slug === bizSlug);
  if (!membership && !session.isPlatformAdmin) redirect("/unauthorized");

  const sb = await supabaseServer();
  const { data: biz } = await sb.from("businesses").select("id,name,slug,onboarding_status").eq("slug", bizSlug).single();
  if (!biz) redirect("/unauthorized");
  if (biz.onboarding_status === "suspended") redirect("/suspended");

  const [{ data: emps }, { data: leads }, { data: convs }, { data: tasks }, { data: acts }] = await Promise.all([
    sb.from("ai_employees").select("id,type,name,is_active,config").eq("business_id", biz.id),
    sb.from("leads").select("ai_employee_id").eq("business_id", biz.id),
    sb.from("conversations").select("ai_employee_id").eq("business_id", biz.id),
    sb.from("tasks").select("employee_id").eq("business_id", biz.id),
    sb.from("ai_activity_log").select("employee_id,created_at").eq("business_id", biz.id).order("created_at", { ascending: false }).limit(200),
  ]);
  const n = (arr: any[] | null, key: string, id: string) => (arr ?? []).filter((r) => r[key] === id).length;
  const lastAct = (id: string) => (acts ?? []).find((a) => a.employee_id === id)?.created_at;

  return (
    <WorkspaceShell bizSlug={biz.slug} bizName={biz.name}>
      <PageHeader title="AI Workforce"
        description="Your AI employees — what each one handles, and how much work it has done. Open a workspace to test, review conversations and adjust behaviour." />
      {(emps ?? []).length === 0 ? (
        <EmptyState icon={<Bot size={22} />} title="No AI employees assigned yet"
          description="Your Digital Rise administrator assigns AI employees to this workspace during onboarding." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
          {(emps ?? []).map((e) => {
            const def = EMPLOYEE_TYPES.find((t) => t.key === (e.config as any)?.employeeKey) ||
                        EMPLOYEE_TYPES.find((t) => t.engineType === e.type);
            const la = lastAct(e.id);
            return (
              <div className="card card-hover" key={e.id} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
                  <span style={{ display: "inline-flex", padding: 10, borderRadius: 11, background: "var(--primary-soft)", color: "var(--primary)" }}><Bot size={19} /></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.9375rem" }}>{e.name}</div>
                    <div className="text-secondary" style={{ fontSize: "0.71875rem" }}>{def?.description || e.type}</div>
                  </div>
                  <span className={`badge ${e.is_active ? "badge-success" : "badge-neutral"}`}>
                    {e.is_active ? <><span className="dot live" /> working</> : "paused"}
                  </span>
                </div>
                <div style={{ display: "flex", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "10px 0" }}>
                  {[
                    ["Enquiries", n(leads, "ai_employee_id", e.id)],
                    ["Conversations", n(convs, "ai_employee_id", e.id)],
                    ["Follow-ups", n(tasks, "employee_id", e.id)],
                  ].map(([lab, val]) => (
                    <div key={lab as string} style={{ flex: 1, textAlign: "center" }}>
                      <div className="tabular" style={{ fontWeight: 800, fontSize: "1.125rem" }}>{val}</div>
                      <div className="text-secondary" style={{ fontSize: "0.625rem", fontWeight: 700 }}>{lab}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="text-secondary" style={{ fontSize: "0.6875rem", flex: 1 }}>
                    {la ? `Last activity ${new Date(la).toLocaleString("en-CA", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}` : "No activity yet"}
                  </span>
                  <Link href={`/w/${biz.slug}/workforce/${e.id}`} className="btn btn-primary btn-sm">View workspace</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </WorkspaceShell>
  );
}
