// ============================================================================
// src/lib/supabase/server.ts
// Per-request server-side Supabase client for Next.js 16 App Router.
// `cookies()` from next/headers is async in v15+ — must be awaited.
// ============================================================================

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Creates a Supabase client bound to the current request's cookies.
 * Use inside Server Components, Server Actions, and Route Handlers.
 *
 * Important: do NOT cache the result across requests — always call this
 * fresh inside the handler/render so each request gets its own session.
 */
export async function createClient() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY must be set (see .env.local)."
    );
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // setAll is called from a Server Component, which is a read-only
          // context for cookies. Swallowing here is the documented
          // @supabase/ssr pattern; session refresh is handled by middleware.
        }
      },
    },
  });
}
