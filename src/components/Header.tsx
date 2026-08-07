// src/components/Header.tsx
// Site header — Server Component that renders Logo, navigation, search,
// CartButton (client), and UserMenu (server). Client-only bits live
// in their own sub-components.

import Link from "next/link";
import { Search } from "lucide-react";
import { Logo } from "@/components/Logo";
import { CartButton } from "@/components/CartButton";
import { UserMenu } from "@/components/UserMenu";
import { MobileMenuButton } from "@/components/MobileMenuButton";
import { ScrolledHeader } from "@/components/ScrolledHeader";

const NAV = [
  { label: "Electronics", href: "/category/electronics" },
  { label: "Home & Garden", href: "/category/home-garden" },
  { label: "Fashion", href: "/category/fashion-accessories" },
  { label: "Beauty", href: "/category/beauty-personal-care" },
  { label: "Sports", href: "/category/sports-outdoors" },
  { label: "Gadgets", href: "/category/gadgets" },
];

export function Header() {
  return (
    <ScrolledHeader>
      {/* Row 1: logo / search / actions */}
      <div className="relative border-b border-border">
        <div className="container-x flex h-16 items-center gap-3 sm:gap-6">
          {/* Mobile menu toggle */}
          <MobileMenuButton />

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Logo height={32} ariaLabel="GLAM — home" />
          </Link>

          {/* Search (desktop) */}
          <form
            role="search"
            action="/search"
            method="get"
            className="hidden flex-1 lg:flex"
          >
            <div className="relative w-full max-w-2xl">
              <Search
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="search"
                name="q"
                placeholder="Search products, brands and categories…"
                aria-label="Search"
                className="h-10 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm text-fg placeholder:text-text-muted focus:border-accent focus:bg-bg focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
          </form>

          {/* Spacer on mobile */}
          <div className="flex-1 lg:hidden" />

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <UserMenu />
            <CartButton />
          </div>
        </div>

        {/* Mobile search */}
        <div className="container-x pb-3 lg:hidden">
          <form role="search" action="/search" method="get">
            <div className="relative w-full">
              <Search
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="search"
                name="q"
                placeholder="Search…"
                aria-label="Search"
                className="h-10 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm focus:border-accent focus:bg-bg focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Row 2: category nav (desktop) */}
      <nav
        aria-label="Categories"
        className="hidden border-b border-border lg:block"
      >
        <div className="container-x flex h-11 items-center gap-6 overflow-x-auto text-sm font-medium text-fg no-scrollbar">
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className="whitespace-nowrap py-1 transition-colors hover:text-accent"
            >
              {n.label}
            </Link>
          ))}
        </div>
      </nav>
    </ScrolledHeader>
  );
}
