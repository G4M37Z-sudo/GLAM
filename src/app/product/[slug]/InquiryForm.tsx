"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";

interface InquiryFormProps {
  productId: string;
  productTitle: string;
}

/**
 * "Contact Supplier / RFQ" form.
 * POSTs to /api/inquiries (built by another agent).
 * On success, shows an inline confirmation banner in place of the form.
 */
export function InquiryForm({ productId, productTitle }: InquiryFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          name: name.trim(),
          email: email.trim(),
          company: company.trim() || null,
          phone: phone.trim() || null,
          message: message.trim(),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const msg =
          body?.error || body?.message || `Request failed (${res.status})`;
        throw new Error(msg);
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-start gap-3 rounded-lg border border-success/30 bg-success/5 p-6"
      >
        <div className="flex items-center gap-2 text-success">
          <CheckCircle2 size={20} />
          <span className="font-semibold">Inquiry sent!</span>
        </div>
        <p className="text-sm text-fg">
          Thanks {name.split(" ")[0] || "there"} — the supplier will reach out to{" "}
          <span className="font-semibold">{email}</span> shortly about{" "}
          <span className="font-semibold">{productTitle}</span>.
        </p>
      </div>
    );
  }

  const inputClass = cn(
    "h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-lg border border-border bg-bg p-6"
      noValidate
    >
      <input type="hidden" name="product_id" value={productId} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-semibold text-fg">
            Name <span className="text-accent">*</span>
          </span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            autoComplete="name"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-semibold text-fg">
            Email <span className="text-accent">*</span>
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-semibold text-fg">Company</span>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme Trading Co."
            autoComplete="organization"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-semibold text-fg">Phone</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 123-4567"
            autoComplete="tel"
            className={inputClass}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-semibold text-fg">
          Message <span className="text-accent">*</span>
        </span>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Tell us about your needs for "${productTitle}" — target quantity, delivery timeline, customization, etc.`}
          className={cn(inputClass, "h-auto py-3 leading-relaxed")}
        />
      </label>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-accent/30 bg-accent/5 px-3 py-2 text-sm text-accent"
        >
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-text-muted">
          By submitting you agree to be contacted by the supplier.
        </p>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={submitting}
          className="min-w-[180px]"
        >
          <Send size={16} />
          {submitting ? "Sending…" : "Send Inquiry"}
        </Button>
      </div>
    </form>
  );
}
