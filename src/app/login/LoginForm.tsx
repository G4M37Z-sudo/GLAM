"use client";

// src/app/login/LoginForm.tsx
// Email + magic-link form. Calls the server action and shows the
// "check your inbox" confirmation when the email is sent.

import { useState, useTransition } from "react";
import { signInWithEmail } from "@/lib/supabase/actions";
import { Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface LoginFormProps {
  next: string;
  initialError?: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  missing_code: "The link looks incomplete. Please request a new one.",
  exchange_failed: "We couldn't sign you in. Please try again.",
};

export function LoginForm({ next, initialError }: LoginFormProps) {
  const [pending, startTransition] = useTransition();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    initialError ? ERROR_MESSAGES[initialError] ?? "Something went wrong." : null
  );

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await signInWithEmail(formData);
      if (res.error) {
        setError(res.error);
      } else if (res.ok) {
        setSentTo(res.email);
      }
    });
  }

  if (sentTo) {
    return (
      <div className="text-center">
        <CheckCircle2
          className="mx-auto mb-4 text-success"
          size={48}
        />
        <h2 className="mb-2 text-lg font-bold text-fg">Check your inbox</h2>
        <p className="mb-1 text-sm text-text-muted">
          We sent a sign-in link to:
        </p>
        <p className="mb-4 font-mono text-sm text-fg">{sentTo}</p>
        <p className="text-xs text-text-muted">
          Click the link in the email to finish signing in. You can close this
          tab.
        </p>
        <button
          type="button"
          onClick={() => setSentTo(null)}
          className="mt-6 text-xs font-medium text-accent hover:underline"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-fg"
        >
          Email address
        </label>
        <div className="relative">
          <Mail
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="h-11 w-full rounded-md border border-border bg-bg pl-10 pr-3 text-sm text-fg placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <input type="hidden" name="next" value={next} />

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-sale/30 bg-sale/5 px-3 py-2 text-sm text-sale">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending link…
          </>
        ) : (
          "Send magic link"
        )}
      </button>
    </form>
  );
}
