// src/app/help/payments/page.tsx
// Payments — accepted methods, security, billing, gift cards.

import { CreditCard, Lock, ShieldCheck, Wallet } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Payments",
  description: "Accepted payment methods, security, and billing questions at GLAM.",
};

export default function PaymentsHelpPage() {
  return (
    <main className="container-x py-10 sm:py-14">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">
        Help
      </p>
      <h1 className="mb-3 text-3xl font-black text-fg sm:text-4xl">Payments</h1>
      <p className="mb-8 max-w-2xl text-base text-text-muted">
        Everything you need to know about paying for your GLAM order — accepted
        methods, security, and billing.
      </p>

      {/* Methods grid */}
      <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: CreditCard, title: "Credit & debit", body: "Visa, Mastercard, American Express, Discover." },
          { icon: Wallet, title: "Digital wallets", body: "Apple Pay, Google Pay, Shop Pay." },
          { icon: Lock, title: "Secure checkout", body: "Stripe-powered — your card details never touch our servers." },
          { icon: ShieldCheck, title: "Buyer protection", body: "Full refund if your order doesn't arrive or match the description." },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className="rounded-xl border border-border bg-bg p-5">
              <Icon className="mb-3 text-accent" size={24} />
              <h2 className="mb-1 text-sm font-bold text-fg">{c.title}</h2>
              <p className="text-sm text-text-muted">{c.body}</p>
            </div>
          );
        })}
      </section>

      <div className="prose-like max-w-2xl space-y-6">
        <section>
          <h2 className="mb-3 text-xl font-bold text-fg">When is my card charged?</h2>
          <p className="text-base text-text-muted leading-relaxed">
            Your card is authorized when you place the order and charged when
            your order ships. If your order is cancelled before shipping, the
            authorization is released within 5–10 business days (depending on
            your card issuer).
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-fg">Sales tax</h2>
          <p className="text-base text-text-muted leading-relaxed">
            Sales tax is calculated at checkout based on your shipping address
            and local rates. The amount is shown before you confirm your order.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-fg">Promo codes</h2>
          <p className="text-base text-text-muted leading-relaxed">
            Enter your promo code in the &ldquo;Discount&rdquo; field at checkout.
            Only one code can be applied per order. Subscribe to our newsletter
            for an instant 10% off your first order.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-fg">Is it safe to pay online?</h2>
          <p className="text-base text-text-muted leading-relaxed">
            Yes. All payments are processed by Stripe, a PCI-DSS Level 1
            certified payment processor. Your card details are encrypted in
            transit and never stored on our servers.
          </p>
        </section>
      </div>

      <p className="mt-12 text-xs text-text-muted">
        Last updated: August 2026
      </p>
    </main>
  );
}
