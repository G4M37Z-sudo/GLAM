// src/app/featured/page.tsx
// Featured products page — kept short for v1; just delegates to /
// by redirecting. The home page already renders the featured grid.

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function FeaturedPage() {
  redirect("/");
}
