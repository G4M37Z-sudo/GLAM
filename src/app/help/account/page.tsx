// src/app/help/account/page.tsx
// Account — sign in, profile, saved addresses, email preferences.

import Link from "next/link";
import { User, MapPin, Bell, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Account",
  description: "Sign in, manage your profile, saved addresses, and email preferences at GLAM.",
};

export default function AccountHelpPage() {
  return (
    <main className="container-x py-10 sm:py-14">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">
        Help
      </p>
      <h1 className="mb-3 text-3xl font-black text-fg sm:text-4xl">Account</h1>
      <p className="mb-8 max-w-2xl text-base text-text-muted">
        Sign in, manage your profile, and control your email preferences.
      </p>

      <section className="mb-10 rounded-2xl border border-accent/30 bg-accent/5 p-6 sm:p-8">
        <p className="text-sm text-text-muted">
          <strong className="text-fg">Note:</strong> Full account creation
          (with magic-link sign-in) is coming soon. For now, look up your orders
          by email on the{" "}
          <Link href="/account" className="font-medium text-accent hover:underline">
            account page
          </Link>
          .
        </p>
      </section>

      <div className="prose-like max-w-2xl space-y-8">
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-fg">
            <User size={20} className="text-accent" />
            Creating an account
          </h2>
          <p className="text-base text-text-muted leading-relaxed">
            You don&apos;t need an account to place an order — just enter your
            email and shipping address at checkout. We&apos;ll send your order
            confirmation and tracking to that email.
          </p>
          <p className="mt-3 text-base text-text-muted leading-relaxed">
            With a GLAM account, you can save addresses, see order history, and
            get faster checkout on future orders. Look for the
            &ldquo;Create account&rdquo; prompt at checkout.
          </p>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-fg">
            <MapPin size={20} className="text-accent" />
            Saved addresses
          </h2>
          <p className="text-base text-text-muted leading-relaxed">
            Once you create an account, you can save up to 5 addresses (home,
            work, gift recipients, etc.) and pick one at checkout. Editing an
            address doesn&apos;t affect orders already placed.
          </p>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-fg">
            <Bell size={20} className="text-accent" />
            Email preferences
          </h2>
          <p className="text-base text-text-muted leading-relaxed">
            We send two kinds of email: transactional (order updates, tracking)
            and marketing (new arrivals, sales). You can unsubscribe from
            marketing at any time using the link in any marketing email.
            Transactional emails can&apos;t be opted out of while you have an
            active order.
          </p>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-fg">
            <ShieldCheck size={20} className="text-accent" />
            Privacy & security
          </h2>
          <p className="text-base text-text-muted leading-relaxed">
            Your data is yours. We never sell your personal information. For
            full details, see our{" "}
            <Link href="/privacy" className="font-medium text-accent hover:underline">
              privacy policy
            </Link>
            .
          </p>
        </section>
      </div>

      <p className="mt-12 text-xs text-text-muted">
        Last updated: August 2026
      </p>
    </main>
  );
}
