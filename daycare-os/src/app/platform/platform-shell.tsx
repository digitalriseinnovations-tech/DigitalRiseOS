"use client";
/* Platform Admin shell — Digital Rise internal console. */
import { type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Building2, PlusCircle, LogOut, Sparkles } from "lucide-react";
import { ThemeToggle } from "@ui/theme";
import { supabaseBrowser } from "@/lib/supabase-browser";

const NAV = [
  { label: "Overview", href: "/platform", icon: <LayoutDashboard size={17} /> },
  { label: "Daycare Businesses", href: "/platform/businesses", icon: <Building2 size={17} /> },
  { label: "New Daycare Setup", href: "/platform/businesses/new", icon: <PlusCircle size={17} /> },
];

export function PlatformShell({ children, adminName }: { children: ReactNode; adminName?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await supabaseBrowser().auth.signOut();
    router.push("/login");
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div style={{ padding: "16px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--surface)", flexShrink: 0 }}>
            <Sparkles size={17} />
          </div>
          <div className="biz-name">
            <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>Digital Rise</div>
            <div className="text-secondary" style={{ fontSize: "0.6875rem" }}>Platform Admin</div>
          </div>
        </div>
        <nav style={{ flex: 1 }}>
          <div className="nav-group">
            <div className="overline" style={{ padding: "6px 10px 4px" }}>Console</div>
            {NAV.map((it) => {
              const active = it.href === "/platform" ? pathname === "/platform" : pathname.startsWith(it.href);
              return (
                <Link key={it.href} href={it.href} className={`nav-item ${active ? "active" : ""}`}>
                  {it.icon}<span className="nav-label">{it.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
        <div style={{ padding: 12, borderTop: "1px solid var(--border)" }}>
          <button type="button" className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }} onClick={signOut}>
            <LogOut size={16} /> <span className="nav-label">Sign out</span>
          </button>
        </div>
      </aside>
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header className="topbar">
          <span className="overline">Platform Console</span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <ThemeToggle />
            <span className="badge badge-neutral">{adminName || "Admin"}</span>
          </div>
        </header>
        <main className="content page-in">{children}</main>
      </div>
    </div>
  );
}
