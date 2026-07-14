import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function Unauthorized() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div className="card page-in" style={{ maxWidth: 440, textAlign: "center", padding: 36 }}>
        <div style={{ display: "inline-flex", padding: 14, borderRadius: 14, background: "var(--danger-soft)", color: "var(--danger)", marginBottom: 14 }}>
          <ShieldAlert size={26} />
        </div>
        <h2>You don&apos;t have access to this area</h2>
        <p className="text-secondary" style={{ margin: "8px 0 20px" }}>
          Your account doesn&apos;t have permission for this page, or it isn&apos;t linked to a workspace yet.
          If you believe this is a mistake, contact your administrator.
        </p>
        <Link href="/login" className="btn btn-secondary">Back to sign in</Link>
      </div>
    </div>
  );
}
