"use client";

// src/app/onboarding/OnboardingClient.tsx
// 4-step wizard with progress dots, per-step forms, and a "skip" link.
// Each step's submit posts to saveOnboardingStep (server action).

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Mail,
  User as UserIcon,
  Tag,
} from "lucide-react";
import { saveOnboardingStep, skipOnboarding } from "@/lib/supabase/actions";

interface Category {
  id: string;
  slug: string;
  name: string;
  image_url: string | null;
}

interface ProfileData {
  id: string;
  email: string;
  full_name: string | null;
  display_name: string | null;
  preferred_categories: string[] | null;
  marketing_opt_in: boolean;
  onboarding_step: number;
}

interface OnboardingClientProps {
  profile: ProfileData;
  categories: Category[];
}

const STEP_LABELS = ["Welcome", "Interests", "Profile", "Done"];
const STEP_ICONS = [Sparkles, Tag, UserIcon, Check];

export function OnboardingClient({ profile, categories }: OnboardingClientProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Working state that advances as the user progresses through steps.
  const [step, setStep] = useState<number>(profile.onboarding_step);
  const [pickedCategories, setPickedCategories] = useState<string[]>(
    profile.preferred_categories ?? []
  );
  const [displayName, setDisplayName] = useState<string>(
    profile.display_name ?? profile.full_name ?? ""
  );
  const [marketingOptIn, setMarketingOptIn] = useState<boolean>(
    profile.marketing_opt_in
  );
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  function goToStep(next: number, formData?: FormData) {
    setError(null);
    startTransition(async () => {
      const payload: Parameters<typeof saveOnboardingStep>[0] = {
        step: step as 1 | 2 | 3 | 4,
      };
      if (step === 2 && formData) {
        payload.preferredCategories = formData.getAll("categories").map(String);
      }
      if (step === 3 && formData) {
        payload.displayName = String(formData.get("displayName") ?? "");
        payload.marketingOptIn = formData.get("marketingOptIn") === "on";
        payload.termsAccepted = termsAccepted;
      }
      const res = await saveOnboardingStep(payload);
      if (res.error) {
        setError(res.error);
        return;
      }
      // Reflect the latest picks in local state for visual continuity.
      if (step === 2) {
        setPickedCategories(
          payload.preferredCategories ?? pickedCategories
        );
      }
      if (step === 3) {
        setDisplayName(payload.displayName ?? displayName);
        setMarketingOptIn(payload.marketingOptIn ?? marketingOptIn);
      }
      setStep(next);
    });
  }

  function handleSkip() {
    startTransition(async () => {
      await skipOnboarding();
    });
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Stepper */}
      <ol className="mb-8 flex items-center justify-between gap-2">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const active = n === step;
          const done = n < step;
          const Icon = STEP_ICONS[i];
          return (
            <li key={label} className="flex flex-1 items-center gap-2">
              <div
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                  done
                    ? "border-accent bg-accent text-white"
                    : active
                      ? "border-accent bg-bg text-accent"
                      : "border-border bg-bg text-text-muted"
                }`}
              >
                {done ? <Check size={14} /> : <Icon size={14} />}
              </div>
              <span
                className={`text-xs font-medium sm:text-sm ${
                  active ? "text-fg" : "text-text-muted"
                }`}
              >
                {label}
              </span>
              {i < STEP_LABELS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 rounded-full ${
                    done ? "bg-accent" : "bg-border"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Card */}
      <div className="rounded-2xl border border-border bg-bg p-6 shadow-sm sm:p-8">
        {error && (
          <div className="mb-4 rounded-md border border-sale/30 bg-sale/5 px-3 py-2 text-sm text-sale">
            {error}
          </div>
        )}

        {step === 1 && (
          <Step1Welcome
            displayName={displayName}
            email={profile.email}
            pending={pending}
            onContinue={() => goToStep(2)}
            onSkip={handleSkip}
          />
        )}

        {step === 2 && (
          <Step2Categories
            categories={categories}
            picked={pickedCategories}
            setPicked={setPickedCategories}
            pending={pending}
            onBack={() => setStep(1)}
            onContinue={(fd) => goToStep(3, fd)}
            onSkip={handleSkip}
          />
        )}

        {step === 3 && (
          <Step3Profile
            displayName={displayName}
            setDisplayName={setDisplayName}
            marketingOptIn={marketingOptIn}
            setMarketingOptIn={setMarketingOptIn}
            termsAccepted={termsAccepted}
            setTermsAccepted={setTermsAccepted}
            pending={pending}
            onBack={() => setStep(2)}
            onContinue={(fd) => goToStep(4, fd)}
            onSkip={handleSkip}
          />
        )}

        {step === 4 && (
          <Step4Done
            displayName={displayName}
            pickedCount={pickedCategories.length}
            pending={pending}
            onContinue={() => goToStep(4)}
            onHome={() => router.push("/")}
          />
        )}
      </div>

      {/* Skip link footer (only on steps that allow skipping) */}
      {step < 4 && (
        <div className="mt-4 text-center">
          <button
            type="button"
            disabled={pending}
            onClick={handleSkip}
            className="text-xs text-text-muted hover:text-fg disabled:opacity-50"
          >
            Skip for now
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — welcome
// ---------------------------------------------------------------------------

function Step1Welcome({
  displayName,
  email,
  pending,
  onContinue,
  onSkip,
}: {
  displayName: string;
  email: string;
  pending: boolean;
  onContinue: () => void;
  onSkip: () => void;
}) {
  return (
    <div>
      <h2 className="mb-2 text-2xl font-black text-fg">
        Hi {displayName || "there"} 👋
      </h2>
      <p className="mb-4 text-sm text-text-muted">
        You&apos;re signed in as <span className="font-mono">{email}</span>. Let&apos;s
        personalise your GLAM experience in three quick steps.
      </p>
      <ul className="mb-6 space-y-2 text-sm text-fg">
        <li className="flex items-start gap-2">
          <Tag size={16} className="mt-0.5 shrink-0 text-accent" />
          Pick the categories you love
        </li>
        <li className="flex items-start gap-2">
          <UserIcon size={16} className="mt-0.5 shrink-0 text-accent" />
          Add a display name and email preferences
        </li>
        <li className="flex items-start gap-2">
          <Sparkles size={16} className="mt-0.5 shrink-0 text-accent" />
          Get a homepage tailored to you
        </li>
      </ul>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onSkip}
          disabled={pending}
          className="text-sm font-medium text-text-muted hover:text-fg disabled:opacity-50"
        >
          Skip for now
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          Get started
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — categories
// ---------------------------------------------------------------------------

function Step2Categories({
  categories,
  picked,
  setPicked,
  pending,
  onBack,
  onContinue,
  onSkip,
}: {
  categories: Category[];
  picked: string[];
  setPicked: (next: string[]) => void;
  pending: boolean;
  onBack: () => void;
  onContinue: (fd: FormData) => void;
  onSkip: () => void;
}) {
  function toggle(slug: string) {
    if (picked.includes(slug)) {
      setPicked(picked.filter((s) => s !== slug));
    } else if (picked.length < 5) {
      setPicked([...picked, slug]);
    }
  }

  return (
    <form action={onContinue}>
      <h2 className="mb-2 text-2xl font-black text-fg">
        What are you into?
      </h2>
      <p className="mb-1 text-sm text-text-muted">
        Pick up to 5 categories. We&apos;ll prioritise them on your homepage.
      </p>
      <p className="mb-5 text-xs text-text-muted">
        {picked.length} / 5 selected
      </p>

      {categories.length === 0 ? (
        <div className="rounded-md border border-dashed border-border bg-surface p-4 text-center text-sm text-text-muted">
          Categories aren&apos;t loaded yet. You can skip this step and pick
          them later.
        </div>
      ) : (
        <ul className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {categories.map((c) => {
            const selected = picked.includes(c.slug);
            const disabled = !selected && picked.length >= 5;
            return (
              <li key={c.id}>
                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors ${
                    selected
                      ? "border-accent bg-accent/5"
                      : disabled
                        ? "cursor-not-allowed border-border bg-surface opacity-50"
                        : "border-border bg-bg hover:border-fg"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="categories"
                    value={c.slug}
                    checked={selected}
                    onChange={() => toggle(c.slug)}
                    disabled={disabled}
                    className="sr-only"
                  />
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded border-2 ${
                      selected
                        ? "border-accent bg-accent text-white"
                        : "border-border"
                    }`}
                  >
                    {selected && <Check size={12} />}
                  </span>
                  <span className="text-sm font-medium text-fg">{c.name}</span>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      {/* Hidden inputs to ensure empty picks still get serialized */}
      {picked.map((s) => (
        <input key={s} type="hidden" name="categories" value={s} />
      ))}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={pending}
          className="inline-flex items-center gap-1 text-sm font-medium text-text-muted hover:text-fg disabled:opacity-50"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSkip}
            disabled={pending}
            className="rounded-full px-4 py-2 text-sm font-medium text-text-muted hover:text-fg disabled:opacity-50"
          >
            Skip
          </button>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            Continue
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — profile + email prefs
// ---------------------------------------------------------------------------

function Step3Profile({
  displayName,
  setDisplayName,
  marketingOptIn,
  setMarketingOptIn,
  termsAccepted,
  setTermsAccepted,
  pending,
  onBack,
  onContinue,
  onSkip,
}: {
  displayName: string;
  setDisplayName: (v: string) => void;
  marketingOptIn: boolean;
  setMarketingOptIn: (v: boolean) => void;
  termsAccepted: boolean;
  setTermsAccepted: (v: boolean) => void;
  pending: boolean;
  onBack: () => void;
  onContinue: (fd: FormData) => void;
  onSkip: () => void;
}) {
  return (
    <form action={onContinue}>
      <h2 className="mb-2 text-2xl font-black text-fg">
        A bit about you
      </h2>
      <p className="mb-5 text-sm text-text-muted">
        We&apos;ll show this name on your orders and recommendations.
      </p>

      <div className="mb-5">
        <label
          htmlFor="displayName"
          className="mb-1.5 block text-sm font-medium text-fg"
        >
          Display name
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          maxLength={80}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="What should we call you?"
          className="h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      <div className="mb-6">
        <label className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4">
          <input
            type="checkbox"
            name="marketingOptIn"
            checked={marketingOptIn}
            onChange={(e) => setMarketingOptIn(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent"
          />
          <span>
            <span className="flex items-center gap-1 text-sm font-medium text-fg">
              <Mail size={14} />
              Email me about new arrivals, sales, and exclusive offers
            </span>
            <span className="mt-0.5 block text-xs text-text-muted">
              You can unsubscribe any time. We never share your email.
            </span>
          </span>
        </label>
      </div>

      <div className="mb-6">
        <label className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            required
            aria-required="true"
            className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent"
          />
          <span>
            <span className="text-sm font-medium text-fg">
              I agree to the{" "}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline hover:no-underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline hover:no-underline"
              >
                Privacy Policy
              </a>
            </span>
            <span className="mt-0.5 block text-xs text-text-muted">
              Required to finish setting up your account.
            </span>
          </span>
        </label>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={pending}
          className="inline-flex items-center gap-1 text-sm font-medium text-text-muted hover:text-fg disabled:opacity-50"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSkip}
            disabled={pending}
            className="rounded-full px-4 py-2 text-sm font-medium text-text-muted hover:text-fg disabled:opacity-50"
          >
            Skip
          </button>
          <button
            type="submit"
            disabled={pending || !termsAccepted}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            Continue
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Step 4 — done
// ---------------------------------------------------------------------------

function Step4Done({
  displayName,
  pickedCount,
  pending,
  onContinue,
  onHome,
}: {
  displayName: string;
  pickedCount: number;
  pending: boolean;
  onContinue: () => void;
  onHome: () => void;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-accent/10">
        <Sparkles size={32} className="text-accent" />
      </div>
      <h2 className="mb-2 text-2xl font-black text-fg">
        You&apos;re all set, {displayName || "friend"}!
      </h2>
      <p className="mb-6 text-sm text-text-muted">
        We&apos;ve saved{" "}
        {pickedCount > 0 ? (
          <>
            <strong className="text-fg">{pickedCount}</strong> category
            {pickedCount === 1 ? "" : "ies"} and{" "}
          </>
        ) : null}
        your preferences. Your homepage is now personalised.
      </p>
      <button
        type="button"
        onClick={onContinue}
        disabled={pending}
        className="mx-auto inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? "Saving…" : "Finish setup"}
        <ArrowRight size={16} />
      </button>
      <p className="mt-4 text-xs text-text-muted">
        Or{" "}
        <button
          type="button"
          onClick={onHome}
          className="text-accent hover:underline"
        >
          jump to the homepage
        </button>
        .
      </p>
    </div>
  );
}
