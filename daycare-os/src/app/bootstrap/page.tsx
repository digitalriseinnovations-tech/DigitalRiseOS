"use client";
/* One-time founder bootstrap: the FIRST account to claim becomes the
   Platform Super Admin. Refuses silently once any admin exists. */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { AuthCard, Alert } from "../(auth)/auth-card";

export default function Bootstrap() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "confirm-email" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setError("Enter a valid email."); setState("error"); return; }
    if (name.trim().length < 2) { setError("Enter your name."); setState("error"); return; }
    if (pw.length < 8) { setError("Password must be at least 8 characters."); setState("error"); return; }
    setState("loading");
    const sb = supabaseBrowser();
    const { data, error: suErr } = await sb.auth.signUp({
      email, password: pw, options: { data: { full_name: name.trim() } },
    });
    if (suErr && /already registered/i.test(suErr.message)) {
      const { error: siErr } = await sb.auth.signInWithPassword({ email, password: pw });
      if (siErr) { setError("Account exists — wrong password."); setState("error"); return; }
    } else if (suErr) { setError(suErr.message); setState("error"); return; }
    else if (data.user && !data.session) { setState("confirm-email"); return; }

    const { data: claimed, error: cErr } = await sb.rpc("claim_founder");
    if (cErr) { setError(cErr.message); setState("error"); return; }
    if (!claimed) { setError("A platform admin already exists — this page is disabled."); setState("error"); return; }
    router.push("/platform");
  }

  return (
    <AuthCard title="Platform setup" subtitle="Create the first Digital Rise platform administrator. This works exactly once.">
      {state === "confirm-email" ? (
        <Alert kind="info">Confirmation email sent to <b>{email}</b>. Confirm it, sign in at /login, then open /bootstrap again to claim admin.</Alert>
      ) : (
        <form onSubmit={submit} noValidate>
          <div className="field" style={{ marginBottom: 14 }}>
            <label htmlFor="name">Your name <span style={{ color: "var(--danger)" }}>*</span></label>
            <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field" style={{ marginBottom: 14 }}>
            <label htmlFor="email">Email <span style={{ color: "var(--danger)" }}>*</span></label>
            <input id="email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field" style={{ marginBottom: 18 }}>
            <label htmlFor="pw">Password <span style={{ color: "var(--danger)" }}>*</span></label>
            <input id="pw" className="input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="At least 8 characters" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={state === "loading"}>
            {state === "loading" ? "Setting up…" : "Create platform admin"}
          </button>
          {state === "error" && <Alert kind="danger">{error}</Alert>}
        </form>
      )}
    </AuthCard>
  );
}
