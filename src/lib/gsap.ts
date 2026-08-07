// src/lib/gsap.ts
// GSAP singleton with ScrollTrigger registered once per process.
// Imported from 'use client' components only — GSAP touches window/DOM.

"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function getGsap() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

export { gsap, ScrollTrigger };
