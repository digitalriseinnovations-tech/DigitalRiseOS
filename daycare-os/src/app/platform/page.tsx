import { getSessionInfo, supabaseServer } from "@/lib/supabase";
import { PlatformShell } from "./platform-shell";
import { PageHeader, EmptyState } from "@ui/shell";
import { Building2, Users, Bot, PlusCircle } from "lucide-react";
import Link from "next/link";
import { statusBadge } from "./status-badge";

export const dynamic = "force-dynamic";

export default async function PlatformOverview() {
  const session = await getSessionInfo();
  const sb = await supabaseServer();
  const [{ data: businesses }, { count: memberCount }, { count: employeeCount }] = await Promise.all([
    sb.from("businesses").select("id,name,slug,onboarding_status,location,created_at").order("created_at", { ascending: false }),
    sb.from("members").select("id", { count: "exact", head: true }),
    sb.from("ai_employees").select("id", { count: "exact", head: true }),
  ]);
  const list = businesses ?? [];
  const live = list.filter((b) => b.onboarding_status === "live").length;
  const inSetup = list.filter((b) => !["live", "suspended", "archived"].includes(b.onboarding_status ?? "draft")).length;

  return (
    <PlatformShell adminName={session?.fullName || session?.email}>
      <PageHeader
        title="Platform overview"
        description="Daycare businesses, onboarding pipeline, and platform activity."
        actions={<Link href="/platform/businesses/new" className="btn btn-primary"><PlusCircle size={16} /> New Daycare Setup</Link>}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Daycare businesses", value: list.length, icon: <Building2 size={16} /> },
          { label: "Live", value: live, icon: <Bot size={16} /> },
          { label: "In onboarding", value: inSetup, icon: <PlusCircle size={16} /> },
          { label: "Workspace users", value: memberCount ?? 0, icon: <Users size={16} /> },
          { label: "AI employees assigned", value: employeeCount ?? 0, icon: <Bot size={16} /> },
        ].map((m) => (
          <div className="card" key={m.label} style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary)", marginBottom: 10 }}>
              {m.icon}<span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{m.label}</span>
            </div>
            <div className="tabular" style={{ fontSize: "1.625rem", fontWeight: 800 }}>{m.value}</div>
          </div>
        ))}
      </div>

      <h3 style={{ marginBottom: 12 }}>Onboarding pipeline</h3>
      {list.length === 0 ? (
        <EmptyState icon={<Building2 size={22} />} title="No daycare businesses yet"
          description="Create your first daycare business — you'll set its plan, modules and AI employees, then invite the owner."
          action={<Link href="/platform/businesses/new" className="btn btn-primary">Start onboarding</Link>} />
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {list.slice(0, 8).map((b) => (
            <Link key={b.id} href={`/platform/businesses/${b.id}`}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 18px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontWeight: 600 }}>{b.name}</span>
              <span className="text-secondary" style={{ fontSize: "0.75rem" }}>{b.location}</span>
              <span style={{ marginLeft: "auto" }}>{statusBadge(b.onboarding_status ?? "draft")}</span>
            </Link>
          ))}
        </div>
      )}
    </PlatformShell>
  );
}
