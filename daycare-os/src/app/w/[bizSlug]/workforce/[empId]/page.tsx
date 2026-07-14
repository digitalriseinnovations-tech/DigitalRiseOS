import { redirect } from "next/navigation";
import { getSessionInfo, supabaseServer } from "@/lib/supabase";
import { WorkspaceShell, PageHeader } from "@ui/shell";
import { EMPLOYEE_TYPES } from "@catalog/employees";
import catalog from "@catalog/raw.js";
import { EmployeeWorkspace } from "./employee-workspace";

export const dynamic = "force-dynamic";

export default async function EmployeePage({ params }: { params: Promise<{ bizSlug: string; empId: string }> }) {
  const { bizSlug, empId } = await params;
  const session = await getSessionInfo();
  if (!session) redirect(`/login?next=/w/${bizSlug}/workforce/${empId}`);
  const membership = session.memberships.find((m) => m.slug === bizSlug);
  if (!membership && !session.isPlatformAdmin) redirect("/unauthorized");

  const sb = await supabaseServer();
  const { data: biz } = await sb.from("businesses").select("id,name,slug,onboarding_status,metadata").eq("slug", bizSlug).single();
  if (!biz) redirect("/unauthorized");
  if (biz.onboarding_status === "suspended") redirect("/suspended");

  const { data: emp } = await sb.from("ai_employees")
    .select("id,type,name,is_active,config").eq("id", empId).eq("business_id", biz.id).single();
  if (!emp) redirect(`/w/${bizSlug}/workforce`);

  const [{ data: convs }, { data: tasks }, { count: leadCount }] = await Promise.all([
    sb.from("conversations").select("id,started_at,messages,lead_captured").eq("business_id", biz.id).eq("ai_employee_id", emp.id).order("started_at", { ascending: false }).limit(30),
    sb.from("tasks").select("id,kind,status,due_at,message").eq("business_id", biz.id).eq("employee_id", emp.id).order("created_at", { ascending: false }).limit(30),
    sb.from("leads").select("id", { count: "exact", head: true }).eq("business_id", biz.id).eq("ai_employee_id", emp.id),
  ]);

  const def = EMPLOYEE_TYPES.find((t) => t.key === (emp.config as any)?.employeeKey) ||
              EMPLOYEE_TYPES.find((t) => t.engineType === emp.type);
  const job = (catalog as any).jobFor(emp.type);

  return (
    <WorkspaceShell bizSlug={biz.slug} bizName={biz.name}>
      <PageHeader
        title={emp.name}
        description={def?.description || job.purpose}
        badge={<span className={`badge ${emp.is_active ? "badge-success" : "badge-neutral"}`}>
          {emp.is_active ? <><span className="dot live" /> working</> : "paused"}
        </span>}
      />
      <EmployeeWorkspace
        bizSlug={biz.slug} bizId={biz.id}
        emp={{
          id: emp.id, type: emp.type, name: emp.name, is_active: emp.is_active,
          description: def?.description || "", roleTitle: job.role, purpose: job.purpose,
        }}
        role={membership?.role ?? "platform admin"}
        knowledge={((biz.metadata as any)?.knowledge as Record<string, string>) || {}}
        conversations={convs ?? []}
        tasks={tasks ?? []}
        counts={{
          leads: leadCount ?? 0,
          convs: (convs ?? []).length,
          tasks: (tasks ?? []).length,
          done: (emp.config as any)?.tasksCompleted || 0,
        }}
      />
    </WorkspaceShell>
  );
}
