// ============================================================================
// src/app/cookies/page.tsx
//
// Cookie policy skeleton. Static Server Component; no data fetching.
// ============================================================================

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cookie Policy",
  description:
    "What cookies and similar technologies MARKET uses, why we use them, and how to control them.",
};

export default function CookiesPage() {
  return (
    <main className="container-x py-10 sm:py-14">
      <h1 className="text-2xl font-bold text-fg sm:text-3xl">
        Cookie Policy
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        What cookies and similar technologies we use, and how to control them.
      </p>

      <div className="mt-6 space-y-4 text-base text-fg leading-relaxed">
        <p>
          This Cookie Policy explains what cookies and similar technologies
          ("cookies") MARKET ("we," "us," or "our") uses when you visit
          market.example (the "Service"), why we use them, and how you can
          control them. For details about how we handle personal information
          collected through cookies, see our{" "}
          <a
            href="/privacy"
            className="text-accent underline-offset-2 hover:underline"
          >
            Privacy Policy
          </a>
          .
        </p>
        <p className="text-text-muted">
          <em>
            This is a cookie policy skeleton for the v1 launch. Replace with
            final legal review before production.
          </em>
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        What are cookies?
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          Cookies are small text files placed on your device when you visit a
          website. They help the site remember your actions and preferences
          over time. We also use related technologies such as local storage,
          pixels, and SDKs — collectively, we call all of these "cookies" in
          this Policy.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        Categories of cookies we use
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <ul className="ml-6 list-disc space-y-2 text-base text-fg">
          <li>
            <span className="font-semibold text-fg">Strictly necessary.</span>{" "}
            Required for the Service to work — session authentication,
            shopping cart state, fraud-prevention, and load balancing. These
            cannot be switched off.
          </li>
          <li>
            <span className="font-semibold text-fg">Preferences.</span>{" "}
            Remember choices you've made — language, currency, recently
            viewed products — so you don't have to set them every visit.
          </li>
          <li>
            <span className="font-semibold text-fg">Analytics.</span> Help us
            understand how the Service is used so we can improve it. We use
            aggregated, de-identified data where possible.
          </li>
          <li>
            <span className="font-semibold text-fg">Marketing.</span> Used to
            measure the effectiveness of campaigns and to show you relevant
            ads on other sites you visit. We honour "do not track" and
            industry opt-out signals where required by law.
          </li>
        </ul>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        Specific cookies
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          The full list of named cookies — purpose, provider, expiration, and
          category — is maintained on this page and updated when we change
          vendors. Common examples include:
        </p>
        <ul className="ml-6 list-disc space-y-2 text-base text-fg">
          <li>
            <span className="font-semibold text-fg">session_id</span> —
            necessary, session-only.
          </li>
          <li>
            <span className="font-semibold text-fg">cart_id</span> — necessary,
            30 days.
          </li>
          <li>
            <span className="font-semibold text-fg">locale</span> —
            preferences, 365 days.
          </li>
          <li>
            <span className="font-semibold text-fg">_analytics</span> —
            analytics, 90 days, anonymized.
          </li>
          <li>
            <span className="font-semibold text-fg">_marketing</span> —
            marketing, 90 days, opt-out available.
          </li>
        </ul>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        How to control cookies
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          You can control cookies in several ways:
        </p>
        <ul className="ml-6 list-disc space-y-2 text-base text-fg">
          <li>
            Use the in-app cookie preferences to switch off non-essential
            categories. Strictly necessary cookies can't be disabled because
            the Service won't work without them.
          </li>
          <li>
            Adjust your browser settings to block or delete cookies. Most
            browsers let you block cookies globally or per-site.
          </li>
          <li>
            Use industry opt-out tools (e.g. the DAA Webchoices tool in the
            US, or Your Online Choices in the EU) to opt out of interest-based
            advertising.
          </li>
        </ul>
        <p>
          If you clear or block cookies, parts of the Service may not work as
          expected — for example, your cart state won't persist between
          visits.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">Contact</h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          Questions about our use of cookies? Email{" "}
          <a
            href="mailto:privacy@market.example"
            className="text-accent underline-offset-2 hover:underline"
          >
            privacy@market.example
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