"use client";

// src/components/animations/ScrollReveal.tsx
// Wrap any block of content to fade-up when it scrolls into view.
// Honors prefers-reduced-motion (no animation if the user has it on).

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, getGsap } from "@/lib/gsap";

interface ScrollRevealProps {
  children: ReactNode;
  /** Delay in seconds before the animation starts. Default 0. */
  delay?: number;
  /** Duration in seconds. Default 0.8. */
  duration?: number;
  /** Vertical travel distance in px. Default 24. */
  y?: number;
  /** Additional classes for the wrapper. */
  className?: string;
  /** Re-trigger animation every time it enters view. Default false. */
  repeat?: boolean;
}

export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.8,
  y = 24,
  className,
  repeat = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip animation if the user prefers reduced motion.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const { ScrollTrigger } = getGsap();

    const tween = gsap.fromTo(
      el,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: repeat
            ? "play reverse play reverse"
            : "play none none none",
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, duration, y, repeat]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
