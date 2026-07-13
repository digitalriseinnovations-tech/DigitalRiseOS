"use client";
/* Workspace app shell: grouped collapsible sidebar + sticky topbar.
   Navigation groups per ROUTES_AND_PERMISSIONS.md / brief §4. */
import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home, Bot, Inbox, Users, CalendarCheck, Hourglass, ClipboardList,
  Megaphone, PhoneIncoming, Star, Palette, Printer, BookOpen, FileText,
  Workflow, BarChart3, Plug, UserCog, Settings, Search, Bell, HelpCircle, Sparkles,
} from "lucide-react";
import { ThemeToggle } from "./theme";

const NAV: { group: string; items: { label: string; slug: string; icon: ReactNode }[] }[] = [
  {
    group: "Overview",
    items: [
      { label: "Home", slug: "", icon: <Home size={17} /> },
      { label: "AI Workforce", slug: "workforce", icon: <Bot size={17} /> },
    ],
  },
  {
    group: "Parent Journey",
    items: [
      { label: "Parent Inbox", slug: "inbox", icon: <Inbox size={17} /> },
      { label: "Enquiries", slug: "enquiries", icon: <Users size={17} /> },
      { label: "Tours", slug: "tours", icon: <CalendarCheck size={17} /> },
      { label: "Waitlist", slug: "waitlist", icon: <Hourglass size={17} /> },
      { label: "Registrations", slug: "registrations", icon: <ClipboardList size={17} /> },
    ],
  },
  {
    group: "Communication",
    items: [
      { label: "Parent Communication", slug: "communication", icon: <Megaphone size={17} /> },
      { label: "Phone & Callbacks", slug: "phone", icon: <PhoneIncoming size={17} /> },
      { label: "Reviews & Reputation", slug: "reviews", icon: <Star size={17} /> },
    ],
  },
  {
    group: "Daycare Content",
    items: [
      { label: "Activities", slug: "activities", icon: <Palette size={17} /> },
      { label: "Printable Hub", slug: "printables", icon: <Printer size={17} /> },
      { label: "Knowledge Hub", slug: "knowledge", icon: <BookOpen size={17} /> },
      { label: "Documents", slug: "documents", icon: <FileText size={17} /> },
    ],
  },
  {
    group: "Automation & Insights",
    items: [
      { label: "Automations", slug: "automations", icon: <Workflow size={17} /> },
      { label: "Analytics", slug: "analytics", icon: <BarChart3 size={17} /> },
      { label: "Integrations", slug: "integrations", icon: <Plug size={17} /> },
    ],
  },
  {
    group: "Administration",
    items: [
      { label: "Team", slug: "team", icon: <UserCog size={17} /> },
      { label: "Settings", slug: "settings", icon: <Settings size={17} /> },
    ],
  },
];

export function WorkspaceShell({
  bizSlug, bizName, children,
}: { bizSlug: string; bizName: string; children: ReactNode }) {
  const pathname = usePathname();
  const base = `/w/${bizSlug}`;

  return (
    <div className="shell">
      <aside className="sidebar">
        <div style={{ padding: "16px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, background: "var(--primary)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0,
          }}>
            <Sparkles size={17} />
          </div>
          <div className="biz-name" style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: "0.875rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{bizName}</div>
            <div className="text-secondary" style={{ fontSize: "0.6875rem" }}>Daycare AI Employee OS</div>
          </div>
        </div>
        <nav style={{ flex: 1, paddingBottom: 16 }}>
          {NAV.map((g) => (
            <div className="nav-group" key={g.group}>
              <div className="overline" style={{ padding: "6px 10px 4px" }}>{g.group}</div>
              {g.items.map((it) => {
                const href = it.slug ? `${base}/${it.slug}` : base;
                const active = it.slug ? pathname.startsWith(href) : pathname === base;
                return (
                  <Link key={it.slug} href={href} className={`nav-item ${active ? "active" : ""}`}>
                    {it.icon}
                    <span className="nav-label">{it.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header className="topbar">
          <div style={{
            flex: 1, maxWidth: 420, display: "flex", alignItems: "center", gap: 8,
            background: "var(--surface-subtle)", border: "1px solid var(--border)",
            borderRadius: "var(--r-sm)", padding: "0 12px", height: 34, color: "var(--text-secondary)",
          }}>
            <Search size={15} />
            <span style={{ fontSize: "0.8125rem" }}>Search… <span style={{ opacity: 0.6 }}>(⌘K — Phase 3)</span></span>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
            <button type="button" className="btn btn-ghost btn-icon" aria-label="Notifications" title="Notifications (Phase 3)"><Bell size={17} /></button>
            <button type="button" className="btn btn-ghost btn-icon" aria-label="Help" title="Help"><HelpCircle size={17} /></button>
            <ThemeToggle />
            <div style={{
              width: 32, height: 32, borderRadius: "50%", background: "var(--primary-soft)",
              color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: "0.75rem", marginLeft: 6,
            }} title="User menu (Phase 2)">DR</div>
          </div>
        </header>
        <main className="content page-in">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, badge, actions }: {
  title: string; description?: string; badge?: ReactNode; actions?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <h1>{title}</h1>{badge}
        </div>
        {description && <p className="text-secondary" style={{ marginTop: 4, maxWidth: 640 }}>{description}</p>}
      </div>
      {actions && <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{actions}</div>}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: {
  icon: ReactNode; title: string; description: string; action?: ReactNode;
}) {
  return (
    <div className="empty">
      <div style={{ display: "inline-flex", padding: 14, borderRadius: 14, background: "var(--primary-soft)", color: "var(--primary)", marginBottom: 12 }}>{icon}</div>
      <h3>{title}</h3>
      <p className="text-secondary" style={{ margin: "6px auto 16px", maxWidth: 420 }}>{description}</p>
      {action}
    </div>
  );
}
