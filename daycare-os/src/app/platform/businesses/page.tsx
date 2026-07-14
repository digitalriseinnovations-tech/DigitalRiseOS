import { getSessionInfo, supabaseServer } from "@/lib/supabase";
import { PlatformShell } from "../platform-shell";
import { PageHeader, EmptyState } from "@ui/shell";
import { Building2, PlusCircle } from "lucide-react";
import Link from "next/link";
import { statusBadge } from "../status-badge";

export const dynamic = "force-dynamic";

export default async function BusinessesList() {
  const session = await getSessionInfo();
  const sb = await supabaseServer();
  const { data: businesses } = await sb
    .from("businesses")
    .select("id,name,slug,location,onboarding_status,created_at,enabled_modules")
    .order("created_at", { ascending: false });
  const { data: employees } = await sb.from("ai_employees").select("business_id");
  const { data: members } = await sb.from("members").select("business_id");
  const count = (arr: { business_id: string }[] | null, id: string) =>
    (arr ?? []).filter((r) => r.business_id === id).length;

  const list = businesses ?? [];
  return (
    <PlatformShell adminName={session?.fullName || session?.email}>
      <PageHeader title="Daycare businesses" description={`${list.length} business${list.length === 1 ? "" : "es"} on the platform.`}
        actions={<Link href="/platform/businesses/new" className="btn btn-primary"><PlusCircle size={16} /> New Daycare Setup</Link>} />
      {list.length === 0 ? (
        <EmptyState icon={<Building2 size={22} />} title="No businesses yet"
          description="Run New Daycare Setup to create the first daycare, assign its AI employees, and invite the owner."
          action={<Link href="/platform/businesses/new" className="btn btn-primary">Start onboarding</Link>} />
      ) : (
        <div className="card" style={{ padding: 0, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84375rem" }}>
            <thead>
              <tr>
                {["Business", "Location", "Status", "AI employees", "Users", "Created", ""].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "11px 16px", background: "var(--surface-subtle)", fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", borderBottom: "1px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((b) => (
                <tr key={b.id}>
                  <td style={{ padding: "13px 16px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>{b.name}</td>
                  <td style={{ padding: "13px 16px", borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>{b.location || "—"}</td>
                  <td style={{ padding: "13px 16px", borderBottom: "1px solid var(--border)" }}>{statusBadge(b.onboarding_status ?? "draft")}</td>
                  <td style={{ padding: "13px 16px", borderBottom: "1px solid var(--border)" }} className="tabular">{count(employees, b.id)}</td>
                  <td style={{ padding: "13px 16px", borderBottom: "1px solid var(--border)" }} className="tabular">{count(members, b.id)}</td>
                  <td style={{ padding: "13px 16px", borderBottom: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: "0.75rem" }}>
                    {b.created_at ? new Date(b.created_at).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </td>
                  <td style={{ padding: "13px 16px", borderBottom: "1px solid var(--border)" }}>
                    <Link href={`/platform/businesses/${b.id}`} className="btn btn-secondary btn-sm">Manage</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PlatformShell>
  );
}
