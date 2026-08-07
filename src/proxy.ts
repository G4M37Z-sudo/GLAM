// ============================================================================
// src/proxy.ts
// Refresh the Supabase session cookie on every request and gate
// the /onboarding and /account routes to signed-in users.
//
// Next.js 16 renamed `middleware.ts` → `proxy.ts` and the exported
// function name from `middleware` → `proxy`. See:
// https://nextjs.org/docs/app/api-reference/file-conventions/proxy
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  // If Supabase env vars aren't configured (e.g. before SETUP.md has been
  // followed), short-circuit — the proxy is for auth only, and we can't
  // refresh a session that doesn't exist. Without this guard, the page
  // request itself fails because the proxy throws on every incoming req.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Refresh the session — must be called in proxy to keep cookies alive.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Gate /onboarding — must be signed in.
  if (!user && request.nextUrl.pathname.startsWith("/onboarding")) {
    const next = encodeURIComponent(request.nextUrl.pathname);
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${next}`;
    return NextResponse.redirect(url);
  }

  // Gate /account and /account/* — must be signed in.
  if (
    !user &&
    (request.nextUrl.pathname === "/account" ||
      request.nextUrl.pathname.startsWith("/account/"))
  ) {
    const next = encodeURIComponent(request.nextUrl.pathname);
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${next}`;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    // Skip static assets and Next internals.
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
