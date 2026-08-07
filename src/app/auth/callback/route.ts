// ============================================================================
// src/app/auth/callback/route.ts
// Magic-link callback handler. Supabase redirects the user here after
// they click the link in their email. We exchange the auth code for a
// session cookie, then redirect to ?next= (or / by default).
// ============================================================================

import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/";

  if (!code) {
    return Response.redirect(new URL("/login?error=missing_code", url.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("auth/callback exchange failed:", error);
    return Response.redirect(new URL("/login?error=exchange_failed", url.origin));
  }

  // Look up the user's profile to see if onboarding is needed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("onboarding_step")
      .eq("id", user.id)
      .maybeSingle();

    const step = profile?.onboarding_step ?? 1;

    // If first sign-in (no profile yet, or step=1, or step between 1-3),
    // send to onboarding wizard. Otherwise send to the original destination.
    if (!profile || (step >= 1 && step <= 4)) {
      return Response.redirect(
        new URL(`/onboarding?step=${profile ? step : 1}`, url.origin)
      );
    }
  }

  return Response.redirect(new URL(next, url.origin));
}
