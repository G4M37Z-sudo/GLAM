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
// signInWithEmail
// Sends a magic-link email to the address. If the user is new, a profile
// row is created with onboarding_step = 1 (so they land on the wizard).
// ---------------------------------------------------------------------------

export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = String(formData.get("next") ?? "/");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = await createClient();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error("signInWithEmail failed:", error);
    return { error: "We couldn't send the link. Please try again." };
  }

  return { ok: true, email };
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
