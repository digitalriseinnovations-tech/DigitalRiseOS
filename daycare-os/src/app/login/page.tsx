"use client";
/* Login screen. Real authentication (Supabase Auth) activates in Phase 2 —
   this page is honest about that and never pretends to log anyone in. */
import { useState } from "react";
import Link from "next/link";
import { Sparkles, Info } from "lucide-react";
import { ThemeToggle } from "@ui/theme";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errs.email = "Enter a valid email address.";
    if (password.length < 8) errs.password = "Password must be at least 8 characters.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setNotice(
      "Sign-in opens in Phase 2. Accounts are provisioned by Digital Rise — your invitation email will contain your first-time setup link."
    );
  }

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
          <h2 style={{ marginBottom: 4 }}>Welcome back</h2>
          <p className="text-secondary" style={{ marginBottom: 20 }}>Sign in to your daycare workspace.</p>

          <form onSubmit={submit} noValidate>
            <div className="field" style={{ marginBottom: 14 }}>
              <label htmlFor="email">Email <span style={{ color: "var(--danger)" }}>*</span></label>
              <input id="email" className="input" type="email" autoComplete="email"
                value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@yourdaycare.com" />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="field" style={{ marginBottom: 18 }}>
              <label htmlFor="password">Password <span style={{ color: "var(--danger)" }}>*</span></label>
              <input id="password" className="input" type="password" autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Sign in</button>
          </form>

          {notice && (
            <div style={{
              marginTop: 16, display: "flex", gap: 10, padding: "12px 14px",
              background: "var(--info-soft)", color: "var(--info)",
              borderRadius: "var(--r-sm)", fontSize: "0.8125rem", lineHeight: 1.55,
            }} role="status">
              <Info size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{notice}</span>
            </div>
          )}

          <div style={{ marginTop: 16, textAlign: "center", fontSize: "0.8125rem" }}>
            <span className="text-secondary">Forgot password? Available in Phase 2 · </span>
            <Link href="/w/demo" style={{ color: "var(--primary)", fontWeight: 600 }}>Preview the workspace →</Link>
          </div>
        </div>

        <p className="text-secondary" style={{ textAlign: "center", marginTop: 16, fontSize: "0.71875rem" }}>
          Accounts are created by your Digital Rise administrator.
        </p>
      </div>
    </div>
  );
}
