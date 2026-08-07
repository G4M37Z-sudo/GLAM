"use client";

// src/components/ScrolledHeader.tsx
// Wraps children in a header that adds a shadow when the page is scrolled.

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ScrolledHeader({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
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
      {children}
    </header>
  );
}
