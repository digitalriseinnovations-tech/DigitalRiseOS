"use client";
/* Invited-user activation: validate token → create account (set password)
   → accept invitation → enter workspace. Handles expired/used invites. */
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { AuthCard, Alert } from "../../(auth)/auth-card";

type Inv = { email: string; role: string; business_name: string; business_slug: string; status: string; expired: boolean };

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [inv, setInv] = useState<Inv | null | "loading">("loading");
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "confirm-email" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const sb = supabaseBrowser();
    sb.rpc("get_invitation", { p_token: token }).then(({ data }) => {
      setInv((data && data[0]) || null);
    });
  }, [token]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!inv || inv === "loading") return;
    if (name.trim().length < 2) { setError("Enter your full name."); setState("error"); return; }
    if (pw.length < 8) { setError("Password must be at least 8 characters."); setState("error"); return; }
    setState("loading");
    const sb = supabaseBrowser();

    /* Create the account (or sign in if it already exists) */
    const { data: signUp, error: suErr } = await sb.auth.signUp({
      email: inv.email, password: pw,
      options: { data: { full_name: name.trim() } },
    });
    if (suErr && /already registered/i.test(suErr.message)) {
      const { error: siErr } = await sb.auth.signInWithPassword({ email: inv.email, password: pw });
      if (siErr) { setError("An account with this email already exists — sign in with its password, or reset it first."); setState("error"); return; }
    } else if (suErr) {
      setError(suErr.message); setState("error"); return;
    } else if (signUp.user && !signUp.session) {
      /* Email confirmation is enabled in Supabase — the membership is granted after they confirm + sign in */
      setState("confirm-email"); return;
    }

    const { data: slug, error: accErr } = await sb.rpc("accept_invitation", { p_token: token });
    if (accErr) {
      const msg = accErr.message.includes("expired") ? "This invitation has expired — ask your administrator to resend it."
        : accErr.message.includes("email_mismatch") ? "This invitation belongs to a different email address."
        : accErr.message;
      setError(msg); setState("error"); return;
    }
    router.push(`/w/${slug}`);
  }

  if (inv === "loading") return <AuthCard title="Checking invitation…"><p className="text-secondary">One moment.</p></AuthCard>;
  if (!inv) return (
    <AuthCard title="Invitation not found" footer={<Link href="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Go to sign in</Link>}>
      <Alert kind="danger">This invitation link is not valid. Ask your administrator to send a new one.</Alert>
    </AuthCard>
  );
  if (inv.expired || inv.status === "expired") return (
    <AuthCard title="Invitation expired" footer={<Link href="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Go to sign in</Link>}>
      <Alert kind="danger">This invitation to <b>{inv.business_name}</b> has expired. Ask your administrator to resend it.</Alert>
    </AuthCard>
  );
  if (inv.status === "accepted") return (
    <AuthCard title="Already activated" footer={<Link href="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Sign in</Link>}>
      <Alert kind="info">This invitation was already used. Sign in with your email and password.</Alert>
    </AuthCard>
  );
  if (inv.status === "revoked") return (
    <AuthCard title="Invitation revoked">
      <Alert kind="danger">This invitation was revoked by an administrator.</Alert>
    </AuthCard>
  );

  return (
    <AuthCard title={`Join ${inv.business_name}`}
      subtitle={`You've been invited as ${inv.role}. Set up your account to get started.`}>
      {state === "confirm-email" ? (
        <Alert kind="info">Almost there — we sent a confirmation email to <b>{inv.email}</b>. Confirm it, then open this invite link again to finish joining.</Alert>
      ) : (
        <form onSubmit={submit} noValidate>
          <div className="field" style={{ marginBottom: 14 }}>
            <label>Email</label>
            <input className="input" value={inv.email} disabled aria-label="Invited email" />
          </div>
          <div className="field" style={{ marginBottom: 14 }}>
            <label htmlFor="name">Your full name <span style={{ color: "var(--danger)" }}>*</span></label>
            <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sarah Chen" />
          </div>
          <div className="field" style={{ marginBottom: 18 }}>
            <label htmlFor="pw">Choose a password <span style={{ color: "var(--danger)" }}>*</span></label>
            <input id="pw" className="input" type="password" autoComplete="new-password"
              value={pw} onChange={(e) => setPw(e.target.value)} placeholder="At least 8 characters" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={state === "loading"}>
            {state === "loading" ? "Creating your account…" : "Activate account"}
          </button>
          {state === "error" && <Alert kind="danger">{error}</Alert>}
        </form>
      )}
    </AuthCard>
  );
}

