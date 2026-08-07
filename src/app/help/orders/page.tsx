// src/app/help/orders/page.tsx
// Orders — tracking, change or cancel, order history.

import Link from "next/link";
import { Package, XCircle, Clock, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Orders",
  description: "Track an order, change or cancel, and view order history at GLAM.",
};

export default function OrdersHelpPage() {
  return (
    <main className="container-x py-10 sm:py-14">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">
        Help
      </p>
      <h1 className="mb-3 text-3xl font-black text-fg sm:text-4xl">Orders</h1>
      <p className="mb-8 max-w-2xl text-base text-text-muted">
        Track, change, or cancel an order — and find your order history.
      </p>

      {/* Lookup form shortcut */}
      <section className="mb-10 rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-fg">
          <Search size={20} className="text-accent" />
          Look up your orders
        </h2>
        <p className="mb-4 text-sm text-text-muted">
          Enter the email address you used at checkout to see all your orders.
        </p>
        <form action="/account" method="get" className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            aria-label="Email address"
            className="h-11 flex-1 rounded-md border border-border bg-bg px-3 text-sm text-fg placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <button
            type="submit"
            className="h-11 rounded-md bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            View orders
          </button>
        </form>
      </section>

      <div className="prose-like max-w-2xl space-y-8">
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-fg">
            <Clock size={20} className="text-accent" />
            Order status
          </h2>
          <p className="mb-3 text-base text-text-muted leading-relaxed">
            Every order goes through four stages:
          </p>
          <ul className="ml-6 list-disc space-y-2 text-base text-text-muted">
            <li>
              <strong className="text-fg">Pending</strong> — payment confirmed,
              waiting to be picked.
            </li>
            <li>
              <strong className="text-fg">Paid</strong> — payment captured, order
              is being prepared.
            </li>
            <li>
              <strong className="text-fg">Shipped</strong> — on its way. You&apos;ll
              receive a tracking link by email.
            </li>
            <li>
              <strong className="text-fg">Delivered</strong> — order has arrived.
              30-day return window starts here.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-fg">
            <XCircle size={20} className="text-accent" />
            Can I cancel or change my order?
          </h2>
          <p className="text-base text-text-muted leading-relaxed">
            You can cancel an order up to 1 hour after placing it, as long as it
            hasn&apos;t shipped. After 1 hour, the order is locked for picking.
            To cancel, contact us immediately with your order number.
          </p>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-fg">
            <Package size={20} className="text-accent" />
            Missing or wrong items?
          </h2>
          <p className="text-base text-text-muted leading-relaxed">
            We&apos;re sorry — that should never happen. Email us at{" "}
            <Link
              href="mailto:support@glam.example"
              className="font-medium text-accent hover:underline"
            >
              support@glam.example
            </Link>{" "}
            with your order number and a photo. We&apos;ll make it right with a
            replacement or full refund.
          </p>
        </section>
      </div>

      <p className="mt-12 text-xs text-text-muted">
        Last updated: August 2026
      </p>
    </main>
  );
}
