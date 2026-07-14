/* Daycare Command Center — real operational home (Phase 3).
   Every number is a real query; when there's no activity yet we show a
   meaningful empty state, never a grid of zeros. */
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionInfo, supabaseServer } from "@/lib/supabase";
import { WorkspaceShell, PageHeader, EmptyState } from "@ui/shell";
import { MessageCircle, Inbox as InboxIcon, CalendarCheck, Star, Bot, ShieldCheck, LogOut, Timer, ListTodo, Rocket } from "lucide-react";
import { CommandCenter } from "./command-center";

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
    .select("id,name,slug,onboarding_status,location").eq("slug", bizSlug).single();
  if (!biz) redirect("/unauthorized");
  if (biz.onboarding_status === "suspended") redirect("/suspended");
  if (biz.onboarding_status === "archived") redirect("/unauthorized");

  const dayStart = new Date(); dayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(Date.now() - 6 * 864e5); weekStart.setHours(0, 0, 0, 0);
  const iso = (d: Date) => d.toISOString();

  const [emps, leadsToday, convsToday, toursToday, reviewsToday, tasksOpen, prioLeads, prioBookings, activity, weekLeads] =
    await Promise.all([
      sb.from("ai_employees").select("id,name,type,is_active").eq("business_id", biz.id),
      sb.from("leads").select("id", { count: "exact", head: true }).eq("business_id", biz.id).gte("created_at", iso(dayStart)),
      sb.from("conversations").select("id", { count: "exact", head: true }).eq("business_id", biz.id).gte("started_at", iso(dayStart)),
      sb.from("bookings").select("id", { count: "exact", head: true }).eq("business_id", biz.id).gte("created_at", iso(dayStart)),
      sb.from("reviews").select("id", { count: "exact", head: true }).eq("business_id", biz.id).gte("created_at", iso(dayStart)),
      sb.from("tasks").select("id", { count: "exact", head: true }).eq("business_id", biz.id).eq("status", "scheduled"),
      sb.from("leads").select("id,name,enquiry_type,status,phone,created_at").eq("business_id", biz.id)
        .in("status", ["New", "Escalated", "callback-requested", "escalated", "new"]).order("created_at", { ascending: false }).limit(6),
      sb.from("bookings").select("id,service,status,created_at,booking_date").eq("business_id", biz.id)
        .in("status", ["pending", "request"]).order("created_at", { ascending: false }).limit(4),
      sb.from("ai_activity_log").select("kind,summary,created_at").eq("business_id", biz.id)
        .order("created_at", { ascending: false }).limit(10),
      sb.from("leads").select("created_at").eq("business_id", biz.id).gte("created_at", iso(weekStart)),
    ]);

  const employees = emps.data ?? [];
  const counts = {
    enquiries: leadsToday.count ?? 0,
    conversations: convsToday.count ?? 0,
    tours: toursToday.count ?? 0,
    reviews: reviewsToday.count ?? 0,
    followUps: tasksOpen.count ?? 0,
  };
  const minutesSaved = counts.conversations * 6 + counts.enquiries * 4;
  const anyToday = Object.values(counts).some((v) => v > 0);

  const priorities = [
    ...(prioLeads.data ?? []).map((l) => ({
      id: l.id, kind: "lead" as const,
      title: `${l.name || "Parent"} — ${l.enquiry_type || "enquiry"}`,
      sub: `${l.phone || "no phone captured"} · waiting since ${new Date(l.created_at).toLocaleString("en-CA", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}`,
      action: "Resolve", urgent: /escalat/i.test(l.status || ""),
    })),
    ...(prioBookings.data ?? []).map((b) => ({
      id: b.id, kind: "booking" as const,
      title: `${b.service || "Tour"} needs confirmation`,
      sub: b.booking_date ? `requested for ${new Date(b.booking_date).toLocaleString("en-CA", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}` : "time to be proposed",
      action: "Confirm", urgent: false,
    })),
  ];

  /* 7-day enquiry mini chart */
  const days: { label: string; n: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 864e5);
    const key = d.toDateString();
    days.push({
      label: d.toLocaleDateString("en-CA", { weekday: "short" }),
      n: (weekLeads.data ?? []).filter((l) => new Date(l.created_at).toDateString() === key).length,
    });
  }
  const maxN = Math.max(1, ...days.map((d) => d.n));

  const role = membership?.role ?? "platform admin";
  const hr = new Date().getHours();
  const greet = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";
  const workingCount = employees.filter((e) => e.is_active).length;

  const METRICS = [
    { label: "Parents assisted", value: counts.conversations, icon: <MessageCircle size={15} /> },
    { label: "New enquiries", value: counts.enquiries, icon: <InboxIcon size={15} /> },
    { label: "Tours booked", value: counts.tours, icon: <CalendarCheck size={15} /> },
    { label: "Reviews collected", value: counts.reviews, icon: <Star size={15} /> },
    { label: "Follow-ups scheduled", value: counts.followUps, icon: <ListTodo size={15} /> },
    { label: "Staff time saved (est.)", value: minutesSaved >= 60 ? `${(minutesSaved / 60).toFixed(1)}h` : `${minutesSaved}m`, icon: <Timer size={15} /> },
  ];

  return (
    <WorkspaceShell bizSlug={biz.slug} bizName={biz.name}>
      {isAdminView && (
        <div role="status" style={{ marginBottom: 16, padding: "9px 14px", borderRadius: 8, background: "var(--warning-soft)", color: "var(--warning)", fontSize: "0.8125rem", display: "flex", gap: 8, alignItems: "center" }}>
          <ShieldCheck size={15} /> Viewing as Digital Rise platform admin (support view — actions are audited).
        </div>
      )}
      <PageHeader
        title={`${greet}, ${biz.name}`}
        description={workingCount > 0
          ? `Your AI workforce (${workingCount} working) handled ${counts.conversations + counts.enquiries} parent interaction${counts.conversations + counts.enquiries === 1 ? "" : "s"} today.`
          : `Signed in as ${session.fullName || session.email} · role: ${role}.`}
        badge={<span className={`badge ${biz.onboarding_status === "live" ? "badge-success" : "badge-warning"}`}>
          {biz.onboarding_status === "live" ? <><span className="dot live" /> Live</> : (biz.onboarding_status ?? "in setup").replace(/_/g, " ")}
        </span>}
        actions={<Link href="/logout" className="btn btn-ghost"><LogOut size={15} /> Sign out</Link>}
      />

      {/* Today's impact */}
      {anyToday ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginBottom: 20 }}>
          {METRICS.map((m) => (
            <div className="card" key={m.label} style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--text-secondary)", marginBottom: 8, fontSize: "0.71875rem", fontWeight: 600 }}>
                {m.icon}{m.label}
              </div>
              <div className="tabular" style={{ fontSize: "1.5rem", fontWeight: 800 }}>{m.value}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ marginBottom: 20 }}>
          <EmptyState icon={<Rocket size={22} />} title="No parent activity yet today"
            description="The moment your AI employees answer a parent, book a tour or capture an enquiry, today's impact appears here — real numbers only, never placeholders." />
        </div>
      )}

      <CommandCenter bizId={biz.id} role={role} isPlatformAdmin={!!isAdminView || session.isPlatformAdmin}
        employees={employees} priorities={priorities} />

      {/* Live activity + 7-day chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 16, marginTop: 16 }} className="cc-cols2">
        <div className="card">
          <div className="overline" style={{ marginBottom: 12 }}>Live activity</div>
          {(activity.data ?? []).length === 0 ? (
            <p className="text-secondary" style={{ fontSize: "0.8125rem" }}>
              Activity from your AI employees and team appears here as it happens.</p>
          ) : (activity.data ?? []).map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: "1px solid var(--border)", fontSize: "0.8125rem" }}>
              <span style={{ display: "inline-flex", padding: 6, borderRadius: 7, background: "var(--primary-soft)", color: "var(--primary)", height: "fit-content" }}><Bot size={13} /></span>
              <span style={{ flex: 1 }}>{a.summary}</span>
              <span className="text-secondary" style={{ fontSize: "0.6875rem", whiteSpace: "nowrap" }}>
                {new Date(a.created_at).toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="overline" style={{ marginBottom: 14 }}>Enquiries — last 7 days</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
            {days.map((d) => (
              <div key={d.label + d.n} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span className="tabular text-secondary" style={{ fontSize: "0.65625rem" }}>{d.n || ""}</span>
                <div style={{ width: "100%", maxWidth: 34, height: `${Math.max(4, (d.n / maxN) * 84)}px`, borderRadius: 6, background: d.n ? "var(--primary)" : "var(--surface-subtle)", transition: "height .4s ease" }} />
                <span className="text-secondary" style={{ fontSize: "0.625rem" }}>{d.label}</span>
              </div>
            ))}
          </div>
          <p className="text-secondary" style={{ fontSize: "0.6875rem", marginTop: 12 }}>
            Full analytics (sources, conversion, response times) arrive in Phase 11.</p>
        </div>
      </div>
      <style>{`@media(max-width:900px){.cc-cols2{grid-template-columns:1fr!important}}`}</style>
    </WorkspaceShell>
  );
}
