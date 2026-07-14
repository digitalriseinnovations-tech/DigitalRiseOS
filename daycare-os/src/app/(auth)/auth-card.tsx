"use client";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "@ui/theme";
import type { ReactNode } from "react";

export function AuthCard({ title, subtitle, children, footer }: {
  title: string; subtitle?: string; children: ReactNode; footer?: ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, position: "relative" }}>
      <div style={{ position: "absolute", top: 16, right: 16 }}><ThemeToggle /></div>
      <div style={{ width: "100%", maxWidth: 400 }} className="page-in">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, justifyContent: "center" }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <Sparkles size={19} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.0625rem", letterSpacing: "-0.01em" }}>Digital Rise</div>
            <div className="text-secondary" style={{ fontSize: "0.71875rem" }}>Daycare OS</div>
          </div>
        </div>
        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ marginBottom: 4 }}>{title}</h2>
          {subtitle && <p className="text-secondary" style={{ marginBottom: 20 }}>{subtitle}</p>}
          {children}
        </div>
        {footer && <div style={{ textAlign: "center", marginTop: 16, fontSize: "0.8125rem" }} className="text-secondary">{footer}</div>}
      </div>
    </div>
  );
}

export function Alert({ kind, children }: { kind: "info" | "danger" | "success"; children: ReactNode }) {
  const map = { info: "var(--info)", danger: "var(--danger)", success: "var(--success)" } as const;
  const soft = { info: "var(--info-soft)", danger: "var(--danger-soft)", success: "var(--success-soft)" } as const;
  return (
    <div role="status" style={{
      marginTop: 14, padding: "11px 14px", background: soft[kind], color: map[kind],
      borderRadius: "var(--r-sm)", fontSize: "0.8125rem", lineHeight: 1.55,
    }}>{children}</div>
  );
}
