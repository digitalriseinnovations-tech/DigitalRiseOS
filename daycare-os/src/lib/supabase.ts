/* Supabase clients — browser + server (cookie-based sessions via @supabase/ssr). */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          /* called from a Server Component — middleware refreshes sessions */
        }
      },
    },
  });
}

export type SessionInfo = {
  userId: string;
  email: string;
  fullName: string;
  isPlatformAdmin: boolean;
  status: string;
  memberships: { businessId: string; role: string; slug: string; name: string; bizStatus: string }[];
};

/** Resolve the signed-in user with profile + memberships. Null if signed out. */
export async function getSessionInfo(): Promise<SessionInfo | null> {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const [{ data: profile }, { data: members }] = await Promise.all([
    sb.from("profiles").select("full_name,is_platform_admin,is_super_admin,status").eq("id", user.id).single(),
    sb.from("members")
      .select("business_id,role,status,businesses(name,slug,status,onboarding_status)")
      .eq("user_id", user.id).eq("status", "active"),
  ]);
  return {
    userId: user.id,
    email: user.email ?? "",
    fullName: profile?.full_name ?? "",
    isPlatformAdmin: !!(profile?.is_platform_admin || profile?.is_super_admin),
    status: profile?.status ?? "active",
    memberships: (members ?? []).map((m: any) => ({
      businessId: m.business_id,
      role: m.role,
      slug: m.businesses?.slug ?? "",
      name: m.businesses?.name ?? "",
      bizStatus: m.businesses?.onboarding_status ?? m.businesses?.status ?? "live",
    })),
  };
}
