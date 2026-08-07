// src/app/login/page.tsx
// Magic-link sign-in. Server Component shell that renders the form
// (a client component for the in-flight state).

import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sign in",
  description: "Sign in to GLAM with a magic link sent to your email.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <main className="container-x flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-accent/10 text-accent">
            <Mail size={26} />
          </div>
          <h1 className="mb-2 text-2xl font-black text-fg sm:text-3xl">
            Sign in to GLAM
          </h1>
          <p className="text-sm text-text-muted">
            Enter your email and we&apos;ll send you a magic link to sign in
            instantly. No password needed.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-bg p-6 sm:p-8">
          <LoginForm next={next ?? "/"} initialError={error} />
        </div>

        <p className="mt-6 text-center text-xs text-text-muted">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-fg">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-fg">
            Privacy Policy
          </Link>
          .
        </p>

        <div className="mt-8 rounded-lg border border-dashed border-border bg-surface p-4 text-center text-xs text-text-muted">
          <p>
            <strong className="text-fg">First time here?</strong> After signing
            in, we&apos;ll walk you through a quick onboarding to personalise
            your experience.
          </p>
          <Link
            href="/"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
          >
            Continue browsing first
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </main>
  );
}
