// Debug-only endpoint: shows what the emailRedirectTo URL looks like
// at request time. DELETE me after the auth flow is working.

export const dynamic = "force-dynamic";

export async function GET() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "(not set)";
  const stripped = raw.replace(/\/$/, "").replace(/\/.*$/, "");
  const callbackUrl = `${stripped}/auth/callback?next=${encodeURIComponent("/")}`;

  return Response.json({
    rawSiteUrl: raw,
    strippedSiteUrl: stripped,
    callbackUrlWeBuild: callbackUrl,
    hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  });
}
