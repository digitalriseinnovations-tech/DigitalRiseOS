"use client";
/* Handles the Supabase recovery link → set a new password.
   Also serves first-time password setup for recovery-style invites. */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { AuthCard, Alert } from "../(auth)/auth-card";

export default function ResetPassword() {
  const router = useRouter();
  const [ready, setReady] = useState<boolean | null>(null);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const sb = supabaseBrowser();
    /* The recovery link signs the user in with a temporary session. */
    sb.auth.getUser().then(({ data: { user } }) => setReady(!!user));
    const { data: sub } = sb.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 8) { setError("Password must be at least 8 characters."); setState("error"); return; }
    if (pw !== pw2) { setError("Passwords do not match."); setState("error"); return; }
    setState("loading");
    const sb = supabaseBrowser();
    const { error: err } = await sb.auth.updateUser({ password: pw });
    if (err) { setError(err.message); setState("error"); return; }
    setState("done");
    setTimeout(() => router.push("/login"), 1600);
  }

  if (ready === null) return <AuthCard title="Checking link…"><p className="text-secondary">One moment.</p></AuthCard>;
  if (!ready) {
    return (
      <AuthCard title="Link expired or invalid"
        subtitle="Password reset links are single-use and expire quickly."
        footer={<Link href="/forgot-password" style={{ color: "var(--primary)", fontWeight: 600 }}>Request a new link</Link>}>
        <Alert kind="danger">This reset link is no longer valid. Request a fresh one and try again.</Alert>
      </AuthCard>
    );
  }
  return (
    <AuthCard title="Set a new password">
      {state === "done" ? (
        <Alert kind="success">Password updated. Taking you to sign in…</Alert>
      ) : (
        <form onSubmit={submit} noValidate>
          <div className="field" style={{ marginBottom: 14 }}>
            <label htmlFor="pw">New password <span style={{ color: "var(--danger)" }}>*</span></label>
            <input id="pw" className="input" type="password" autoComplete="new-password"
              value={pw} onChange={(e) => setPw(e.target.value)} placeholder="At least 8 characters" />
          </div>
          <div className="field" style={{ marginBottom: 18 }}>
            <label htmlFor="pw2">Confirm password <span style={{ color: "var(--danger)" }}>*</span></label>
            <input id="pw2" className="input" type="password" autoComplete="new-password"
              value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="Repeat the password" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={state === "loading"}>
            {state === "loading" ? "Saving…" : "Save new password"}
          </button>
          {state === "error" && <Alert kind="danger">{error}</Alert>}
        </form>
      )}
    </AuthCard>
  );
}
