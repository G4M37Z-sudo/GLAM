// ============================================================================
// src/app/terms/page.tsx
//
// Terms of service skeleton. Static Server Component; no data fetching.
// ============================================================================

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Terms of Service",
  description:
    "The terms governing your use of the MARKET storefront — accounts, orders, payments, and liability.",
};

export default function TermsPage() {
  return (
    <main className="container-x py-10 sm:py-14">
      <h1 className="text-2xl font-bold text-fg sm:text-3xl">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        The terms governing your use of the MARKET storefront.
      </p>

      <div className="mt-6 space-y-4 text-base text-fg leading-relaxed">
        <p>
          These Terms of Service ("Terms") govern your access to and use of
          the website, products, and services made available by MARKET
          Wholesale Co. ("MARKET," "we," or "us") at market.example (the
          "Service"). By creating an account, placing an order, or otherwise
          using the Service, you agree to these Terms.
        </p>
        <p className="text-text-muted">
          <em>
            This is a Terms skeleton for the v1 launch. Replace with final
            legal review before production.
          </em>
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        Eligibility &amp; accounts
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          You must be at least 18 years old (or the age of digital consent in
          your jurisdiction) to use the Service. When you create an account
          you agree to provide accurate information, keep it updated, and
          safeguard your credentials. You're responsible for activity that
          happens under your account, so please use a strong password and let
          us know right away if you suspect unauthorized access.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        Orders &amp; payment
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          All orders are subject to acceptance and availability. We may
          decline or cancel an order if a price was displayed incorrectly, an
          item is out of stock, or fraud screening flags the transaction.
          When that happens we'll notify you and refund any payment.
        </p>
        <p>
          Prices are shown in the currency selected at checkout and may
          exclude duties, taxes, or import fees for international shipments
          unless explicitly noted. Payment is processed by a third-party
          payment processor; we don't store full payment card numbers.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">Shipping</h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          We ship to the countries listed at checkout. Delivery windows are
          estimates, not guarantees — carriers, weather, customs, and peak
          season volume can all affect timing. Risk of loss and title for
          items pass to you when the carrier hands the package over to you
          (or to the recipient you designate).
        </p>
        <p>
          See our{" "}
          <a
            href="/help/shipping"
            className="text-accent underline-offset-2 hover:underline"
          >
            shipping policy
          </a>{" "}
          for current rates and delivery options.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">Returns</h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          Most items can be returned within 30 days of delivery for a full
          refund, subject to the conditions described in our{" "}
          <a
            href="/help/returns"
            className="text-accent underline-offset-2 hover:underline"
          >
            returns policy
          </a>
          . Final-sale items, personalized items, and certain hygiene-sensitive
          categories are non-returnable; we'll flag them clearly on the
          product page and at checkout.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        Acceptable use
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          You agree not to misuse the Service — for example, by scraping or
          automated data collection without our written permission, by
          attempting to bypass security measures, by uploading malicious
          code, or by interfering with other customers' use of the Service.
          We may suspend or terminate accounts that violate these rules.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        Intellectual property
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          The Service, including its design, branding, copy, photography, and
          source code, is owned by MARKET or our licensors. You may view and
          use it for personal, non-commercial purposes. You may not copy,
          reproduce, distribute, or create derivative works without our prior
          written permission.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        Disclaimers &amp; liability
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          The Service is provided "as is" and "as available." To the fullest
          extent permitted by law, we disclaim all warranties, express or
          implied, including warranties of merchantability, fitness for a
          particular purpose, and non-infringement.
        </p>
        <p>
          To the fullest extent permitted by law, our total liability arising
          out of or related to your use of the Service will not exceed the
          amounts you paid to MARKET in the twelve months preceding the
          claim. We're not liable for indirect, incidental, special,
          consequential, or punitive damages.
        </p>
        <p>
          Nothing in these Terms limits liability that cannot be excluded
          under applicable law.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        Governing law &amp; disputes
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          These Terms are governed by the laws of the State of California,
          without regard to conflict-of-laws principles. Any dispute will be
          resolved exclusively in the state or federal courts located in San
          Francisco County, California, except where consumer-protection law
          in your jurisdiction gives you the right to bring a claim locally.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">Changes</h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          We may update these Terms from time to time. Material changes will
          be communicated by email and an in-app banner. Continued use of the
          Service after a change takes effect constitutes acceptance of the
          updated Terms.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">Contact</h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          Questions about these Terms? Email{" "}
          <a
            href="mailto:legal@market.example"
            className="text-accent underline-offset-2 hover:underline"
          >
            legal@market.example
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