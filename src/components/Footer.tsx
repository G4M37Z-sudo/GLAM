import Link from "next/link";

const COLUMNS = [
  {
    title: "Help",
    links: [
      { label: "Customer Service", href: "/help" },
      { label: "Shipping & Delivery", href: "/help/shipping" },
      { label: "Returns & Refunds", href: "/help/returns" },
      { label: "Size Guide", href: "/help/size-guide" },
      { label: "Contact Us", href: "/help/contact" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About MARKET", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Affiliates", href: "/affiliates" },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "Women", href: "/categories/women" },
      { label: "Men", href: "/categories/men" },
      { label: "Kids", href: "/categories/kids" },
      { label: "Beauty", href: "/categories/beauty" },
      { label: "Home", href: "/categories/home" },
      { label: "Tech", href: "/categories/tech" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto bg-[#1a1a1a] text-[#d4d4d4]">
      <div className="container-x grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
              {col.title}
            </h3>
            <ul className="space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="transition-colors hover:text-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
            Newsletter
          </h3>
          <p className="mb-4 text-sm">
            Be first to hear about flash sales, new arrivals and exclusive
            offers.
          </p>
          <form
            action="/api/newsletter"
            method="post"
            className="flex flex-col gap-2"
          >
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="h-10 w-full rounded-md border border-[#3a3a3a] bg-[#222] px-3 text-sm text-white placeholder:text-[#888] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <button
              type="submit"
              className="h-10 w-full rounded-md bg-accent text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              Subscribe
            </button>
          </form>
          <div className="mt-6 flex gap-3 text-sm">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
              aria-label="Instagram"
            >
              Instagram
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
              aria-label="TikTok"
            >
              TikTok
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
              aria-label="YouTube"
            >
              YouTube
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#2a2a2a]">
        <div className="container-x flex flex-col items-start justify-between gap-3 py-5 text-xs text-[#999] sm:flex-row sm:items-center">
          <p>© {year} MARKET. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-accent">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-accent">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-accent">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}