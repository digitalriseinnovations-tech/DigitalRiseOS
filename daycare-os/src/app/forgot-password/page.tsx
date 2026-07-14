"use client";
import { useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { AuthCard, Alert } from "../(auth)/auth-card";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setError("Enter a valid email address."); setState("error"); return; }
    setState("loading");
    const sb = supabaseBrowser();
    const { error: err } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (err) { setError(err.message); setState("error"); return; }
    setState("sent");
  }

  return (
    <AuthCard title="Reset your password" subtitle="We'll email you a secure reset link."
      footer={<Link href="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>← Back to sign in</Link>}>
      {state === "sent" ? (
        <Alert kind="success">If an account exists for <b>{email}</b>, a reset link is on its way. Check your inbox (and spam folder).</Alert>
      ) : (
        <form onSubmit={submit} noValidate>
          <div className="field" style={{ marginBottom: 18 }}>
            <label htmlFor="email">Email <span style={{ color: "var(--danger)" }}>*</span></label>
            <input id="email" className="input" type="email" autoComplete="email"
              value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@yourdaycare.com" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={state === "loading"}>
            {state === "loading" ? "Sending…" : "Send reset link"}
          </button>
          {state === "error" && <Alert kind="danger">{error}</Alert>}
        </form>
      )}
    </AuthCard>
  );
}
