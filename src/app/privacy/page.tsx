// ============================================================================
// src/app/privacy/page.tsx
//
// Privacy policy skeleton. Static Server Component; no data fetching.
// ============================================================================

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How MARKET collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="container-x py-10 sm:py-14">
      <h1 className="text-2xl font-bold text-fg sm:text-3xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        How we collect, use, and protect your personal information.
      </p>

      <div className="mt-6 space-y-4 text-base text-fg leading-relaxed">
        <p>
          This Privacy Policy describes the information MARKET ("we," "us," or
          "our") collects about you, how we use it, and the rights you have
          over it. By using market.example (the "Service") you agree to the
          practices described here. If anything below is unclear, email us at{" "}
          <a
            href="mailto:privacy@market.example"
            className="text-accent underline-offset-2 hover:underline"
          >
            privacy@market.example
          </a>
          .
        </p>
        <p className="text-text-muted">
          <em>
            This is a policy skeleton for the v1 launch. Replace with final
            legal review before production.
          </em>
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        Information we collect
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          We collect three broad categories of information:
        </p>
        <ul className="ml-6 list-disc space-y-2 text-base text-fg">
          <li>
            <span className="font-semibold text-fg">Account information.</span>{" "}
            Name, email address, password (hashed), phone number (optional),
            and shipping/billing addresses you save to your profile.
          </li>
          <li>
            <span className="font-semibold text-fg">Order information.</span>{" "}
            Items purchased, order totals, delivery tracking events, return
            activity, and any messages you exchange with our support team
            about an order.
          </li>
          <li>
            <span className="font-semibold text-fg">Usage information.</span>{" "}
            Pages viewed, products browsed, search terms, referral source, and
            basic device/browser metadata collected through cookies and
            similar technologies. See our{" "}
            <a
              href="/cookies"
              className="text-accent underline-offset-2 hover:underline"
            >
              Cookie Policy
            </a>{" "}
            for details.
          </li>
        </ul>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        How we use your information
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          We use the information above to: process and ship your orders;
          prevent fraud and abuse; provide customer support; send transactional
          emails (order confirmations, shipping updates, return status); send
          marketing emails if you've opted in; improve the storefront through
          aggregated analytics; and meet legal and tax obligations.
        </p>
        <p>
          We do not sell personal information to third parties.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        Sharing your information
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          We share information only with the parties that need it to operate
          the Service: payment processors (e.g. Stripe), shipping carriers,
          fraud-prevention vendors, analytics providers, and customer-support
          tooling. Each is bound by a data-processing agreement that limits
          use to the purposes we've contracted.
        </p>
        <p>
          We may also disclose information when required by law, in response
          to a valid legal request, or to protect the safety and rights of our
          customers and staff.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">Data retention</h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          We keep account information for as long as your account is active.
          Order records are retained for the period required by tax and
          consumer-protection law (typically seven years). You can request
          deletion of your account at any time — we'll honour it within 30
          days, except where retention is required by law.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">Your rights</h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          Depending on where you live, you may have the right to: access the
          personal information we hold about you; correct inaccurate data;
          delete your data; restrict or object to certain processing; receive
          a portable copy of your data; and withdraw consent where we rely on
          consent as the legal basis for processing.
        </p>
        <p>
          To exercise any of these rights, email{" "}
          <a
            href="mailto:privacy@market.example"
            className="text-accent underline-offset-2 hover:underline"
          >
            privacy@market.example
          </a>
          . We'll respond within 30 days.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">Security</h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          We protect your data using industry-standard safeguards: TLS in
          transit, encryption at rest for sensitive fields, role-based access
          controls for staff, and routine security reviews of our third-party
          vendors. No system is perfectly secure, but we work continuously to
          reduce risk.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">Changes</h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          When we make material changes to this Policy we'll notify you by
          email and surface an in-app banner. Continued use of the Service
          after a change takes effect constitutes acceptance of the updated
          Policy.
        </p>
      </div>

      <p className="mt-10 text-xs text-text-muted">
        Last updated: August 2026
      </p>
    </main>
  );
}