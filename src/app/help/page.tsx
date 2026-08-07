// src/app/help/page.tsx
// Help center index — directory of help topics with search-style cards.

import Link from "next/link";
import { Search, Package, CreditCard, User, Truck, RotateCcw, Ruler, Mail, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

const TOPICS = [
  {
    icon: Truck,
    title: "Shipping & delivery",
    body: "Delivery times, costs, tracking, and international shipping.",
    href: "/help/shipping",
  },
  {
    icon: RotateCcw,
    title: "Returns & refunds",
    body: "How to start a return, refund timing, and exchange options.",
    href: "/help/returns",
  },
  {
    icon: Ruler,
    title: "Size guide",
    body: "Measurements and fit tips for clothing, bags, and accessories.",
    href: "/help/size-guide",
  },
  {
    icon: CreditCard,
    title: "Payments",
    body: "Accepted payment methods, security, and billing questions.",
    href: "/help/payments",
  },
  {
    icon: Package,
    title: "Orders",
    body: "Track an order, change or cancel, view order history.",
    href: "/help/orders",
  },
  {
    icon: User,
    title: "Account",
    body: "Sign in, manage your profile, saved addresses, and email preferences.",
    href: "/help/account",
  },
  {
    icon: Mail,
    title: "Contact us",
    body: "Reach our team directly — email, phone, or live chat.",
    href: "/contact",
  },
];

export default function HelpIndex() {
  return (
    <main className="container-x py-10 sm:py-14">
      {/* Hero */}
      <header className="mb-10 max-w-3xl">
        <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
          <Search size={12} />
          Help center
        </span>
        <h1 className="mt-3 text-3xl font-black text-fg sm:text-5xl">
          How can we help?
        </h1>
        <p className="mt-3 text-base text-text-muted sm:text-lg">
          Browse our most-asked questions, or reach our team directly.
          We&apos;re here Monday to Friday, 9am – 6pm.
        </p>
      </header>

      {/* Search shortcut */}
      <form
        action="/search"
        method="get"
        className="mb-10 flex max-w-xl gap-2"
      >
        <input
          type="search"
          name="q"
          placeholder="Search help articles…"
          aria-label="Search help"
          className="h-12 flex-1 rounded-full border border-border bg-bg px-5 text-sm text-fg placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="submit"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Search
        </button>
      </form>

      {/* Topic grid */}
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOPICS.map((t) => {
          const Icon = t.icon;
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                className="group flex h-full items-start gap-4 rounded-2xl border border-border bg-bg p-5 transition-shadow hover:shadow-md"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                  <Icon size={22} />
                </div>
                <div className="flex-1">
                  <h2 className="mb-1 text-base font-bold text-fg group-hover:text-accent">
                    {t.title}
                  </h2>
                  <p className="text-sm text-text-muted">{t.body}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent">
                    Read more
                    <ChevronRight
                      size={12}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Bottom CTA */}
      <section className="mt-12 rounded-2xl bg-accent px-6 py-10 text-white sm:px-10 sm:py-12">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">
              Still need help?
            </h2>
            <p className="mt-1 text-white/90">
              Our team replies within one business day.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-accent transition-colors hover:bg-white/90"
          >
            Contact us
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
