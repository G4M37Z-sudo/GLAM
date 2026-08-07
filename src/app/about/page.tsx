// ============================================================================
// src/app/about/page.tsx
//
// About GLAM — company story, mission, and values.
// Static Server Component; no data fetching.
// ============================================================================

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About",
  description:
    "The story behind GLAM — discover our mission, what we stand for, and how we're reshaping everyday commerce.",
};

export default function AboutPage() {
  return (
    <main className="container-x py-10 sm:py-14">
      <h1 className="text-2xl font-bold text-fg sm:text-3xl">
        About GLAM
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Our story, mission, and the values that guide everything we ship.
      </p>

      <div className="mt-6 space-y-4 text-base text-fg leading-relaxed">
        <p>
          GLAM started with a simple observation: the gap between what a
          product costs to make and what most people end up paying for it has
          grown out of control. We set out to build a storefront that closes
          that gap — connecting independent makers, brand-name wholesalers,
          and everyday shoppers in one place without the markups that
          traditionally sit in between.
        </p>
        <p>
          Today we host millions of styles across electronics, home, fashion,
          beauty, and sports — each item sourced through verified partners and
          delivered straight from the warehouse to your door. No middlemen, no
          inflated retail tax, no surprises.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">Our mission</h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          Make well-made, well-priced goods available to everyone — and give
          the brands that make them a direct line to the people who use them.
          We measure success by the number of first-time customers who come
          back, not by the margin we extract on a single order.
        </p>
        <p>
          That means transparent pricing, honest shipping estimates, and a
          return policy you can actually use. If something isn't right, we
          want to know about it — and we want to fix it.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">What we value</h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          <span className="font-semibold text-fg">Honesty over hype.</span> We
          don't bury fees at checkout, don't fake countdown timers, and don't
          pretend something is on sale when it isn't. If a deal is real, you'll
          see the strike-through price and the discount end date — that's it.
        </p>
        <p>
          <span className="font-semibold text-fg">Quality over quantity.</span>{" "}
          Every brand we onboard goes through a vetting process. We look at
          materials, manufacturing conditions, customer feedback, and return
          rates. If a partner doesn't clear the bar, we part ways.
        </p>
        <p>
          <span className="font-semibold text-fg">People over scale.</span> Our
          support team replies within a business day, our warehouse staff are
          full-time with benefits, and our engineering culture prioritizes
          shipping fixes before features.
        </p>
        <p>
          <span className="font-semibold text-fg">Light footprint.</span> We're
          not perfect, but we work at it — see our{" "}
          <a
            href="/sustainability"
            className="text-accent underline-offset-2 hover:underline"
          >
            sustainability
          </a>{" "}
          page for the initiatives we have running today.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">Where we're headed</h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          Next up: faster checkout, smarter search, more local warehouses to
          shorten delivery windows, and an expanded wholesale program for
          small businesses. We're also investing in our seller tooling so
          independent brands can manage inventory, fulfillment, and customer
          service from one place.
        </p>
        <p>
          We're still early — and we'd love to hear what you'd like to see.
          Drop us a note via the{" "}
          <a
            href="/contact"
            className="text-accent underline-offset-2 hover:underline"
          >
            contact page
          </a>
          .
        </p>
      </div>

      <p className="mt-10 text-xs text-text-muted">
        Last updated: August 2026
      </p>
    </main>
  );
}