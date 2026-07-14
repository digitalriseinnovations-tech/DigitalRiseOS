"use client";
/* Real sign-in via Supabase Auth. */
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { AuthCard, Alert } from "../(auth)/auth-card";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setError("Enter a valid email address.");
    if (!password) return setError("Enter your password.");
    setLoading(true);
    const sb = supabaseBrowser();
    const { error: err } = await sb.auth.signInWithPassword({ email, password });
    if (err) {
      setLoading(false);
      setError(err.message === "Invalid login credentials"
        ? "Email or password is incorrect."
        : err.message);
      return;
    }
    /* Route by role/membership */
    const { data: { user } } = await sb.auth.getUser();
    const { data: profile } = await sb.from("profiles")
      .select("is_platform_admin,is_super_admin,status").eq("id", user!.id).single();
    if (profile?.status === "inactive") {
      await sb.auth.signOut();
      setLoading(false);
      setError("This account has been deactivated. Contact your administrator.");
      return;
    }
    await sb.from("profiles").update({ last_login_at: new Date().toISOString() }).eq("id", user!.id);
    const next = params.get("next");
    if (next && next.startsWith("/")) return router.push(next);
    if (profile?.is_platform_admin || profile?.is_super_admin) return router.push("/platform");
    const { data: members } = await sb.from("members")
      .select("businesses(slug,status)").eq("user_id", user!.id).eq("status", "active").limit(1);
    const m: any = members?.[0];
    if (m?.businesses?.status === "suspended") return router.push("/suspended");
    if (m?.businesses?.slug) return router.push(`/w/${m.businesses.slug}`);
    router.push("/unauthorized");
  }

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your daycare workspace."
      footer={<>Accounts are created by your Digital Rise administrator · <Link href="/w/demo" style={{ color: "var(--primary)", fontWeight: 600 }}>Preview the workspace</Link></>}>
      <form onSubmit={submit} noValidate>
        <div className="field" style={{ marginBottom: 14 }}>
          <label htmlFor="email">Email <span style={{ color: "var(--danger)" }}>*</span></label>
          <input id="email" className="input" type="email" autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@yourdaycare.com" />
        </div>
        <div className="field" style={{ marginBottom: 18 }}>
          <label htmlFor="password">Password <span style={{ color: "var(--danger)" }}>*</span></label>
          <input id="password" className="input" type="password" autoComplete="current-password"
            value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      {error && <Alert kind="danger">{error}</Alert>}
      <div style={{ marginTop: 14, textAlign: "center", fontSize: "0.8125rem" }}>
        <Link href="/forgot-password" style={{ color: "var(--primary)", fontWeight: 600 }}>Forgot password?</Link>
      </div>
    </AuthCard>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
