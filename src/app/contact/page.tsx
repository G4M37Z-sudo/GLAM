// ============================================================================
// src/app/contact/page.tsx
//
// Server Component shell for /contact. Renders:
//   1. Header / "Get in touch" panel (email, phone, address — placeholder data)
//   2. ContactForm (client component, posts to /api/inquiries)
//   3. FAQ section — static <details> items
//
// `dynamic = 'force-dynamic'` is set explicitly so Next.js doesn't waste a
// prerender attempt — there's no auth-bound data here, but it's the same
// pattern used by the rest of the site and it keeps the page out of the
// static cache.
// ============================================================================

import { Mail, Phone, MapPin } from "lucide-react";

import { ContactForm } from "./ContactForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with our wholesale and retail team. We respond within 24 hours.",
};

// --- Static contact info (placeholder; swap for real values when known) ---
const CONTACT = {
  email: "hello@market.example",
  phone: "+1 (555) 0100",
  addressLines: [
    "MARKET Wholesale Co.",
    "123 Market Street",
    "San Francisco, CA 94103",
  ],
  hours: "Mon–Fri · 9:00–18:00 PT",
};

// --- FAQ items — short, one paragraph each -------------------------------
const FAQ: { q: string; a: string }[] = [
  {
    q: "How do I track my order?",
    a: "Once your order ships you'll receive a confirmation email with a carrier tracking link. You can also view the status of any order from your account page — pending, paid, shipped, delivered — and we'll send a notification the moment the label is created.",
  },
  {
    q: "Can I cancel my order?",
    a: "You can cancel an order free of charge while it's still in the pending or paid state, before the warehouse starts picking. Once it's marked shipped we're unable to cancel — but you can still request a return on arrival. Head to your account → Orders → Cancel to start the process.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes — we ship to 60+ countries. Duties and taxes are calculated at checkout for most destinations so there are no surprise fees on delivery. Wholesale (B2B) shipments may have separate freight terms; we'll confirm these with you on the quote.",
  },
  {
    q: "How do returns work?",
    a: "Retail customers have a 30-day return window for unused items in their original packaging. Start a return from your account → Orders → Return Items; we'll email a prepaid label for domestic orders. Wholesale / custom orders are handled case-by-case — reach out via the form below and we'll make it right.",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Page header */}
      <header className="border-b border-border bg-surface">
        <div className="container-x py-10 sm:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
            Contact
          </p>
          <h1 className="text-3xl font-bold text-fg sm:text-4xl">
            Let&apos;s talk
          </h1>
          <p className="mt-3 max-w-2xl text-base text-text-muted">
            Questions about a product, a wholesale order, or a partnership?
            Drop us a note — we typically reply within one business day.
          </p>
        </div>
      </header>

      {/* Get in touch + form */}
      <section className="container-x py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          {/* Left rail: contact info */}
          <aside aria-labelledby="get-in-touch-heading">
            <h2
              id="get-in-touch-heading"
              className="text-xl font-bold text-fg sm:text-2xl"
            >
              Get in touch
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Prefer email, phone, or a visit? Here&apos;s how to reach us.
            </p>

            <ul className="mt-6 space-y-5">
              <li className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                  <Mail size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-fg">Email</p>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="text-sm text-text-muted transition-colors hover:text-accent"
                  >
                    {CONTACT.email}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                  <Phone size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-fg">Phone</p>
                  <a
                    href={`tel:${CONTACT.phone.replace(/\s|\(|\)|-/g, "")}`}
                    className="text-sm text-text-muted transition-colors hover:text-accent"
                  >
                    {CONTACT.phone}
                  </a>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {CONTACT.hours}
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                  <MapPin size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-fg">Address</p>
                  <address className="not-italic text-sm text-text-muted">
                    {CONTACT.addressLines.map((line, i) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>
              </li>
            </ul>
          </aside>

          {/* Right: the form */}
          <div>
            <h2 className="text-xl font-bold text-fg sm:text-2xl">
              Send us a message
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Fill in the form and we&apos;ll get back to you by email.
            </p>
            <div className="mt-6 rounded-lg border border-border bg-bg p-6 shadow-sm sm:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-surface">
        <div className="container-x py-12 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold text-fg sm:text-2xl">
              Frequently asked questions
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Quick answers to the questions we hear most.
            </p>

            <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-bg">
              {FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group p-5 open:bg-surface/40"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-fg">
                    <span>{item.q}</span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      className="h-4 w-4 shrink-0 text-text-muted transition-transform group-open:rotate-180"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>

            <p className="mt-6 text-center text-sm text-text-muted">
              Didn&apos;t find what you&apos;re looking for?{" "}
              <a
                href="#contact-form"
                className="font-medium text-accent hover:underline"
              >
                Drop us a message
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
