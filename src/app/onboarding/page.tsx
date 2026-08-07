// src/app/onboarding/page.tsx
// Onboarding wizard shell — 4 steps, gated by signed-in auth.
// Server Component fetches the current step from profiles and renders
// the corresponding step component. Each step is a Client Component
// that calls saveOnboardingStep on submit.

import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAllCategories } from "@/lib/queries";
import { OnboardingClient } from "./OnboardingClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Welcome to GLAM",
  description: "Let's get your account set up — takes about a minute.",
};

interface ProfileData {
  id: string;
  email: string;
  full_name: string | null;
  display_name: string | null;
  preferred_categories: string[] | null;
  marketing_opt_in: boolean;
  onboarding_step: number;
}

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) {
  const { step: stepParam } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/onboarding");
  }

  // Fetch the user's profile + current onboarding step.
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select(
      "id, full_name, display_name, preferred_categories, marketing_opt_in, onboarding_step"
    )
    .eq("id", user.id)
    .maybeSingle();

  // No profile row yet (shouldn't happen thanks to the trigger, but guard anyway).
  if (!profile) {
    await admin.from("profiles").insert({
      id: user.id,
      role: "customer",
      onboarding_step: 1,
    });
    redirect("/onboarding?step=1");
  }

  // User has completed or skipped onboarding — bounce to home.
  if (profile.onboarding_step >= 999) {
    redirect("/");
  }

  const requestedStep = Number(stepParam ?? profile.onboarding_step);
  const step = [1, 2, 3, 4].includes(requestedStep)
    ? requestedStep
    : profile.onboarding_step;

  // Fetch categories for step 2.
  let categories: { id: string; slug: string; name: string; image_url: string | null }[] = [];
  try {
    categories = await getAllCategories();
  } catch (err) {
    console.error("Onboarding categories fetch failed:", err);
  }

  const initial: ProfileData = {
    id: user.id,
    email: user.email ?? "",
    full_name: profile.full_name,
    display_name: profile.display_name,
    preferred_categories: profile.preferred_categories ?? [],
    marketing_opt_in: profile.marketing_opt_in ?? false,
    onboarding_step: step,
  };

  return (
    <main className="min-h-[80vh] bg-gradient-to-b from-bg via-bg to-surface">
      <div className="container-x py-10 sm:py-14">
        <header className="mb-8 text-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
            <Sparkles size={12} />
            Welcome
          </span>
          <h1 className="mt-3 text-3xl font-black text-fg sm:text-4xl">
            Let&apos;s set up your GLAM
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Takes about a minute. You can skip any step and finish later.
          </p>
        </header>

        <OnboardingClient
          profile={initial}
          categories={categories}
        />
      </div>
    </main>
  );
}
