import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
          );
        },
      },
    }
  );

  const { pathname } = request.nextUrl;

  // ✅ Bypass: halaman publik tidak perlu auth check
  if (
    pathname === "/login/reset-password" ||
    pathname === "/admission" ||
    pathname.startsWith("/auth/callback")
  ) {
    return supabaseResponse;
  }

  const { data: { user } } = await supabase.auth.getUser();

  // User belum login
  if (!user) {
    if (pathname !== "/login" && pathname !== "/") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return supabaseResponse;
  }

  // User sudah login — cek role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role;

  if (!role) {
    if (pathname === "/login" || pathname === "/") {
      return supabaseResponse;
    }
    return NextResponse.redirect(new URL("/?error=no_role", request.url));
  }

  if (pathname === "/portal" || pathname === "/login" || pathname === "/") {
    if (role === "guru" || role === "admin") return NextResponse.redirect(new URL("/guru/dashboard", request.url));
    if (role === "ortu") return NextResponse.redirect(new URL("/ortu/dashboard", request.url));
  }

  if (pathname.startsWith("/ortu") && (role === "guru" || role === "admin")) {
    return NextResponse.redirect(new URL("/guru/dashboard", request.url));
  }
  if (pathname.startsWith("/guru") && role === "ortu") {
    return NextResponse.redirect(new URL("/ortu/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};