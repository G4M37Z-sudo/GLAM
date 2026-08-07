// src/app/trending/page.tsx
// Trending page — redirects to home for v1. The home page already
// renders the trending grid.

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function TrendingPage() {
  redirect("/");
}
