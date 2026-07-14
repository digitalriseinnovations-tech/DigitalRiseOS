/* Session refresh + route protection.
   /platform/* → platform admins only.
   /w/*        → authenticated members (except /w/demo sandbox).
   Public: /login, /forgot-password, /reset-password, /invite/*, /bootstrap,
           /suspended, /unauthorized, /w/demo. */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC = ["/login", "/forgot-password", "/reset-password", "/invite", "/bootstrap", "/suspended", "/unauthorized"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const isPublic = PUBLIC.some((p) => path === p || path.startsWith(p + "/")) || path === "/w/demo";

  if (!user && !isPublic && (path.startsWith("/platform") || path.startsWith("/w"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (user && path.startsWith("/platform")) {
    const { data: profile } = await supabase
      .from("profiles").select("is_platform_admin,is_super_admin,status").eq("id", user.id).single();
    if (!profile || profile.status !== "active") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    if (!(profile.is_platform_admin || profile.is_super_admin)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/platform/:path*", "/w/:path*", "/login", "/bootstrap"],
};
