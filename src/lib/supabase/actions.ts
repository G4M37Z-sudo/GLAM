// ============================================================================
// src/lib/supabase/actions.ts
// Server Actions for auth (magic-link sign-in / sign-out) and onboarding.
// Uses @supabase/ssr with the request-bound cookie session.
// ============================================================================

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// ---------------------------------------------------------------------------
// signUpWithPassword
// Creates a new user with email + password. Sends a confirmation email;
// user clicks the link in the email to verify, then can sign in.
// ---------------------------------------------------------------------------

export async function signUpWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();
  const next = String(formData.get("next") ?? "/");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (displayName.length === 0) {
    return { error: "Please enter a display name." };
  }

  const supabase = await createClient();
  const rawSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  // Strip trailing slash AND any path component — Supabase rejects
  // \`emailRedirectTo\` URLs whose host differs from the configured Site URL.
  const siteUrl = rawSiteUrl
    .replace(/\/$/, "")
    .replace(/\/.*$/, "");

  const callbackUrl = `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackUrl,
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) {
    console.error("signUpWithPassword failed:", error);
    console.error("signUpWithPassword callbackUrl was:", callbackUrl);
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "An account with this email already exists. Try signing in." };
    }
    return { error: error.message || "We couldn't create your account. Please try again." };
  }

  // Supabase returns a user with identities=[] if the email is already taken
  // (this is the recommended way to detect "fake success" without leaking which emails exist).
  if (data?.user && data.user.identities && data.user.identities.length === 0) {
    return { error: "An account with this email already exists. Try signing in." };
  }

  return { ok: true, email };
}

// ---------------------------------------------------------------------------
// signInWithPassword
// Signs in an existing user. Email must be verified first; the trigger
// handle_new_user ensures a profile row exists.
// ---------------------------------------------------------------------------

export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (password.length === 0) {
    return { error: "Please enter your password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("signInWithPassword failed:", error);
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return {
        error:
          "Please verify your email first — check your inbox for the confirmation link.",
      };
    }
    if (error.message.toLowerCase().includes("invalid login")) {
      return { error: "Wrong email or password." };
    }
    return { error: "We couldn't sign you in. Please try again." };
  }

  return { ok: true, redirectTo: next };
}

// ---------------------------------------------------------------------------
// signOut
// Clears the session cookie and bounces to /.
// ---------------------------------------------------------------------------

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

// ---------------------------------------------------------------------------
// saveOnboardingStep
// Saves the current step's data + advances onboarding_step in profiles.
// Called from each step of the wizard.
// ---------------------------------------------------------------------------

const VALID_STEPS = [1, 2, 3, 4] as const;
type Step = (typeof VALID_STEPS)[number];

interface StepInput {
  step: Step;
  // Step 2 — categories
  preferredCategories?: string[];
  // Step 3 — profile + prefs
  displayName?: string;
  marketingOptIn?: boolean;
  // Step 3 — terms acceptance (required to leave onboarding)
  termsAccepted?: boolean;
}

export async function saveOnboardingStep(input: StepInput) {
  if (!VALID_STEPS.includes(input.step)) {
    return { error: "Invalid step." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const admin = createAdminClient();

  // Build the patch object based on the step's inputs.
  const patch: Record<string, unknown> = {
    onboarding_step: input.step === 4 ? 999 : input.step + 1,
    updated_at: new Date().toISOString(),
  };

  if (input.step === 2 && Array.isArray(input.preferredCategories)) {
    patch.preferred_categories = input.preferredCategories;
  }

  if (input.step === 3) {
    if (typeof input.displayName === "string") {
      patch.display_name = input.displayName.trim().slice(0, 80);
    }
    if (typeof input.marketingOptIn === "boolean") {
      patch.marketing_opt_in = input.marketingOptIn;
    }
    if (input.termsAccepted === true) {
      patch.terms_accepted_at = new Date().toISOString();
    }
  }

  if (input.step === 4) {
    patch.onboarding_completed_at = new Date().toISOString();
  }

  const { error } = await admin
    .from("profiles")
    .update(patch)
    .eq("id", user.id);

  if (error) {
    console.error("saveOnboardingStep update failed:", error);
    return { error: "We couldn't save your progress. Please try again." };
  }

  return { ok: true, next: input.step === 4 ? "/" : `/onboarding?step=${input.step + 1}` };
}

// ---------------------------------------------------------------------------
// skipOnboarding
// Marks the user as onboarding-complete-but-skipped (step=999, no
// completed_at timestamp). They land on the home page next time.
// ---------------------------------------------------------------------------

export async function skipOnboarding() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not signed in." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({
      onboarding_step: 999,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("skipOnboarding failed:", error);
    return { error: "Couldn't skip — please try again." };
  }

  redirect("/");
}
