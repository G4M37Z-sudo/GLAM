// ============================================================================
// src/app/affiliates/page.tsx
//
// Affiliates program — how it works, commission rates placeholder, FAQ.
// Static Server Component; no data fetching.
// ============================================================================

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Affiliates",
  description:
    "Earn commission by recommending GLAM. Program overview, commission tiers, and how to apply.",
};

export default function AffiliatesPage() {
  return (
    <main className="container-x py-10 sm:py-14">
      <h1 className="text-2xl font-bold text-fg sm:text-3xl">
        Affiliates program
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Recommend GLAM, earn commission. Here's how the program works.
      </p>

      <div className="mt-6 space-y-4 text-base text-fg leading-relaxed">
        <p>
          The GLAM affiliate program lets creators, publishers, and
          reviewers earn a commission on sales they drive to our storefront.
          It's free to join, runs on a 30-day cookie window, and pays out on
          every qualifying order — including repeat purchases during the
          window.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        How it works
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <ol className="ml-6 list-decimal space-y-2 text-base text-fg">
          <li>
            <span className="font-semibold text-fg">Apply.</span> Fill in the
            short application below — tell us where you'll promote us and how
            your audience engages.
          </li>
          <li>
            <span className="font-semibold text-fg">Get approved.</span> Most
            applications are reviewed within two business days. We approve
            sites, blogs, social channels, and email lists with an engaged
            audience.
          </li>
          <li>
            <span className="font-semibold text-fg">Share your link.</span>{" "}
            You'll get access to product links, banners, and a real-time
            dashboard. Use them however fits your channel.
          </li>
          <li>
            <span className="font-semibold text-fg">Earn commission.</span>{" "}
            Every qualifying order placed through your link within the cookie
            window earns commission at your tier rate.
          </li>
          <li>
            <span className="font-semibold text-fg">Get paid.</span> Payouts
            run monthly via direct deposit or PayPal once you cross the
            minimum balance.
          </li>
        </ol>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        Commission rates
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          Commission is paid as a percentage of the order subtotal (excluding
          shipping, taxes, and returns). Our tier structure looks roughly
          like this:
        </p>
        <ul className="ml-6 list-disc space-y-2 text-base text-fg">
          <li>
            <span className="font-semibold text-fg">Starter:</span> 5% on
            orders from new partners.
          </li>
          <li>
            <span className="font-semibold text-fg">Pro:</span> 8% once you
            drive 50+ qualifying orders per month.
          </li>
          <li>
            <span className="font-semibold text-fg">Elite:</span> 12% once you
            drive 250+ qualifying orders per month, with a dedicated partner
            manager.
          </li>
        </ul>
        <p className="text-text-muted">
          <em>
            Final tier thresholds and rates are confirmed during onboarding
            and may vary by category.
          </em>
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        Tools you get
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          Every approved partner gets access to a dashboard with real-time
          click, conversion, and earnings reporting; a product feed you can
          plug into your CMS; static banner and text-link creatives; and an
          API for partners who want to build their own integrations.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        How to apply
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          Email{" "}
          <a
            href="mailto:affiliates@glam.example"
            className="text-accent underline-offset-2 hover:underline"
          >
            affiliates@glam.example
          </a>{" "}
          with your name, your channel(s), and a short note on how you'd
          promote GLAM. We'll reply within two business days with next
          steps.
        </p>
        <p>
          We're particularly interested in working with creators who focus on
          deal-finding, product reviews, sustainable living, home and
          organization, and small-business sourcing.
        </p>
      </div>

      <p className="mt-10 text-xs text-text-muted">
        Last updated: August 2026
      </p>
    </main>
  );
}