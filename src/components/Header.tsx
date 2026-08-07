"use client";

import Link from "next/link";
import { ShoppingBag, User, Search, Menu } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { useEffect, useState } from "react";

const NAV = [
  { label: "Electronics", href: "/category/electronics" },
  { label: "Home & Garden", href: "/category/home-garden" },
  { label: "Fashion", href: "/category/fashion-accessories" },
  { label: "Beauty", href: "/category/beauty-personal-care" },
  { label: "Sports", href: "/category/sports-outdoors" },
  { label: "Gadgets", href: "/category/gadgets" },
];

/**
 * Sticky site header. Subscribes to the cart count from the
 * Zustand store so the badge updates on any add/remove.
 */
export function Header() {
  // Selector keeps this component from re-rendering on every
  // unrelated cart change (e.g. qty edits we don't care about).
  const count = useCartStore((s) => s.getCount());
  const openCart = useCartStore((s) => s.openCart);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full bg-bg transition-shadow",
        scrolled && "shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
      )}
    >
      {/* Row 1: logo / search / actions */}
      <div className="border-b border-border">
        <div className="container-x flex h-16 items-center gap-3 sm:gap-6">
          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-md text-fg hover:bg-surface lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Logo height={32} ariaLabel="GLAM — home" />
          </Link>

          {/* Search */}
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

          {/* Spacer on mobile so icons hug the right */}
          <div className="flex-1 lg:hidden" />

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/account"
              aria-label="Account"
              className="hidden h-10 items-center gap-1 rounded-md px-2 text-sm text-fg hover:bg-surface sm:inline-flex"
            >
              <User size={20} />
              <span className="hidden md:inline">Account</span>
            </Link>

            <button
              type="button"
              aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
              onClick={openCart}
              className="relative grid h-10 w-10 place-items-center rounded-md text-fg hover:bg-surface"
            >
              <ShoppingBag size={22} />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid min-h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-white">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </button>
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
              className={cn(
                "whitespace-nowrap py-1 transition-colors hover:text-accent",
                n.label === "Sale" && "text-accent font-semibold"
              )}
            >
              {n.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile nav drawer (collapsing) */}
      {mobileOpen && (
        <nav
          aria-label="Categories (mobile)"
          className="border-b border-border bg-bg lg:hidden"
        >
          <div className="container-x flex flex-col py-2 text-sm font-medium">
            {NAV.map((n) => (
              <Link
                key={n.label}
                href={n.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-border py-3 last:border-0 hover:text-accent"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}