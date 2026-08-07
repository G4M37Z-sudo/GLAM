"use client";

// src/components/animations/StaggerOnScroll.tsx
// Wraps a list of children and staggers them in when scrolled into view.
// Each direct child gets a short fade-up with an incrementing delay.

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, getGsap } from "@/lib/gsap";

interface StaggerOnScrollProps {
  children: ReactNode;
  /** Time between each child's animation in seconds. Default 0.08. */
  stagger?: number;
  /** Per-child duration in seconds. Default 0.6. */
  duration?: number;
  /** Y-axis travel in px. Default 20. */
  y?: number;
  className?: string;
}

export function StaggerOnScroll({
  children,
  stagger = 0.08,
  duration = 0.6,
  y = 20,
  className,
}: StaggerOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const kids = Array.from(el.children) as HTMLElement[];
    if (reduced) {
      gsap.set(kids, { opacity: 1, y: 0 });
      return;
    }

    const { ScrollTrigger } = getGsap();

    const tween = gsap.fromTo(
      kids,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [stagger, duration, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
