"use client";

// src/components/MobileMenuButton.tsx
// Hamburger + sliding mobile nav. The only client state lives here so
// the rest of Header can stay a Server Component.

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV = [
  { label: "Electronics", href: "/category/electronics" },
  { label: "Home & Garden", href: "/category/home-garden" },
  { label: "Fashion", href: "/category/fashion-accessories" },
  { label: "Beauty", href: "/category/beauty-personal-care" },
  { label: "Sports", href: "/category/sports-outdoors" },
  { label: "Gadgets", href: "/category/gadgets" },
];

export function MobileMenuButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        className="grid h-10 w-10 place-items-center rounded-md text-fg hover:bg-surface lg:hidden"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      {open && (
        <nav
          aria-label="Categories (mobile)"
          className="absolute left-0 right-0 top-full z-50 border-b border-border bg-bg lg:hidden"
        >
          <div className="container-x flex flex-col py-2 text-sm font-medium">
            {NAV.map((n) => (
              <Link
                key={n.label}
                href={n.href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-3 last:border-0 hover:text-accent"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </>
  );
}
