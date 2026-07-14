/**
 * TEMPORARY one-time export of the two PUBLIC Supabase values
 * (URL + publishable key — these are browser-safe by design; RLS protects data).
 * Token-guarded; deleted immediately after the new project's envs are set.
 * NEVER exports secret keys.
 */
export default function handler(req, res) {
  if (req.query.k !== "dr-x7Qp2vKzM9wA4tLbN8Ye") {
    return res.status(404).json({ error: "Not found" });
  }
  return res.status(200).json({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || null,
    key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || null,
  });
}
