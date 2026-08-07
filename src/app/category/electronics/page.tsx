// src/app/category/electronics/page.tsx
import { CategoryLanding } from "@/components/CategoryLanding";
import { getAllCategories, getProductsByCategory } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ElectronicsPage() {
  const slug = "electronics";
  let categories: Awaited<ReturnType<typeof getAllCategories>> = [];
  try {
    categories = await getAllCategories();
  } catch {
    categories = [];
  }
  const category = categories.find((c) => c.slug === slug) ?? {
    id: `seed-${slug}`,
    slug,
    name: "Electronics",
    image_url: null,
  };

  let featured: Awaited<ReturnType<typeof getProductsByCategory>>["items"] = [];
  try {
    const res = await getProductsByCategory(slug, { limit: 8, offset: 0 });
    featured = res.items;
  } catch (err) {
    console.error("electronics featured fetch failed:", err);
  }

  return (
    <CategoryLanding
      category={category}
      intro="Audio, smart home, and the gear that keeps you connected. From wireless earbuds to desk lamps — built for daily use, priced honestly."
      heroImage="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop"
      usps={[
        { title: "Free shipping over $50", body: "On every electronics order, no exceptions." },
        { title: "30-day returns", body: "Try it. If it doesn't fit your setup, send it back." },
        { title: "Real warranties", body: "1-year manufacturer warranty on all electronics." },
        { title: "Honest specs", body: "No marketing fluff — the specs you actually need." },
      ]}
      featured={featured}
    />
  );
}
