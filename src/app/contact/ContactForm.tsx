// ============================================================================
// src/app/contact/ContactForm.tsx
//
// Client-side inquiry form. POSTs to /api/inquiries, shows a success toast
// and clears the form on success, or an inline error on failure.
//
// Optional `productId` prop — used by the product page's inline RFQ form to
// bind the inquiry to a specific product. On the /contact page this prop is
// omitted so the form posts a general inquiry.
// ============================================================================

"use client";

import { useId, useRef, useState } from "react";
import { Button } from "@/components/Button";

type Status = "idle" | "submitting" | "success" | "error";

interface ContactFormProps {
  productId?: string;
  productTitle?: string;
}

export function ContactForm({ productId, productTitle }: ContactFormProps) {
  const nameId = useId();
  const emailId = useId();
  const companyId = useId();
  const phoneId = useId();
  const messageId = useId();

  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const form = formRef.current;
    if (!form) return;

    const fd = new FormData(form);
    const payload = {
      name: (fd.get("name") ?? "").toString(),
      email: (fd.get("email") ?? "").toString(),
      company: (fd.get("company") ?? "").toString(),
      phone: (fd.get("phone") ?? "").toString(),
      message: (fd.get("message") ?? "").toString(),
      product_id: productId ?? "",
    };

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Parse JSON regardless of status so we can surface server messages.
      let data: { ok?: boolean; id?: string; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        // Non-JSON response; fall through to generic error.
      }

      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? `Request failed (${res.status}).`);
        return;
      }

      // Success — clear the form and show toast.
      form.reset();
      setStatus("success");

      // Auto-dismiss the toast after a few seconds for a tidy UX.
      window.setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      console.error("[ContactForm] submit failed:", err);
      setStatus("error");
      setErrorMsg("Network error — please try again.");
    }
  }

  const isSubmitting = status === "submitting";

  return (
    <div className="w-full">
      {/* Toast banner — only visible on success. */}
      {status === "success" && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 flex items-start gap-3 rounded-md border border-success/30 bg-success/10 px-4 py-3 text-sm text-fg"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="mt-0.5 h-5 w-5 shrink-0 text-success"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <p>
            <span className="font-semibold">Thanks —</span> we&apos;ll respond
            within 24h.
          </p>
        </div>
      )}

      {/* Error banner — only visible on failure. */}
      {status === "error" && errorMsg && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-md border border-sale/30 bg-sale/10 px-4 py-3 text-sm text-fg"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="mt-0.5 h-5 w-5 shrink-0 text-sale"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.94 6.94a1 1 0 011.06-.06l3 1.5a1 1 0 11-.894 1.788L10 8.618l-2.106 1.054a1 1 0 11-.894-1.788l3-1.5a1 1 0 01.94-.444zM9 13a1 1 0 112 0v2a1 1 0 11-2 0v-2z"
              clipRule="evenodd"
            />
          </svg>
          <p>{errorMsg}</p>
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5"
      >
        {productId && productTitle && (
          <div className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-text-muted">
            <span className="font-medium text-fg">About:</span>{" "}
            {productTitle}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Name */}
          <div>
            <label
              htmlFor={nameId}
              className="mb-1 block text-sm font-medium text-fg"
            >
              Name <span className="text-accent">*</span>
            </label>
            <input
              id={nameId}
              name="name"
              type="text"
              required
              autoComplete="name"
              disabled={isSubmitting}
              className="h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-60"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor={emailId}
              className="mb-1 block text-sm font-medium text-fg"
            >
              Email <span className="text-accent">*</span>
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              required
              autoComplete="email"
              disabled={isSubmitting}
              className="h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-60"
            />
          </div>

          {/* Company (optional) */}
          <div>
            <label
              htmlFor={companyId}
              className="mb-1 block text-sm font-medium text-fg"
            >
              Company{" "}
              <span className="text-xs font-normal text-text-muted">
                (optional)
              </span>
            </label>
            <input
              id={companyId}
              name="company"
              type="text"
              autoComplete="organization"
              disabled={isSubmitting}
              className="h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-60"
            />
          </div>

          {/* Phone (optional) */}
          <div>
            <label
              htmlFor={phoneId}
              className="mb-1 block text-sm font-medium text-fg"
            >
              Phone{" "}
              <span className="text-xs font-normal text-text-muted">
                (optional)
              </span>
            </label>
            <input
              id={phoneId}
              name="phone"
              type="tel"
              autoComplete="tel"
              disabled={isSubmitting}
              className="h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-60"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor={messageId}
            className="mb-1 block text-sm font-medium text-fg"
          >
            Message <span className="text-accent">*</span>
          </label>
          <textarea
            id={messageId}
            name="message"
            required
            rows={5}
            disabled={isSubmitting}
            placeholder="Tell us what you're looking for — quantities, timelines, customisation…"
            className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-60"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            By submitting, you agree to our{" "}
            <a href="/privacy" className="underline hover:text-accent">
              Privacy Policy
            </a>
            .
          </p>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send message"}
          </Button>
        </div>
      </form>
    </div>
  );
}
