import Link from "next/link";
import { PauseCircle } from "lucide-react";

export default function Suspended() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div className="card page-in" style={{ maxWidth: 440, textAlign: "center", padding: 36 }}>
        <div style={{ display: "inline-flex", padding: 14, borderRadius: 14, background: "var(--warning-soft)", color: "var(--warning)", marginBottom: 14 }}>
          <PauseCircle size={26} />
        </div>
        <h2>This workspace is suspended</h2>
        <p className="text-secondary" style={{ margin: "8px 0 20px" }}>
          Your daycare&apos;s Digital Rise workspace is currently paused. Please contact Digital Rise support
          or your account administrator to restore access.
        </p>
        <Link href="/login" className="btn btn-secondary">Back to sign in</Link>
      </div>
    </div>
  );
}
