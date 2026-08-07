// src/app/category/sports-outdoors/page.tsx
import { CategoryLanding } from "@/components/CategoryLanding";
import { getAllCategories, getProductsByCategory } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function SportsPage() {
  const slug = "sports-outdoors";
  let categories: Awaited<ReturnType<typeof getAllCategories>> = [];
  try {
    categories = await getAllCategories();
  } catch {
    categories = [];
  }
  const category = categories.find((c) => c.slug === slug) ?? {
    id: `seed-${slug}`,
    slug,
    name: "Sports & Outdoors",
    image_url: null,
  };

  let featured: Awaited<ReturnType<typeof getProductsByCategory>>["items"] = [];
  try {
    const res = await getProductsByCategory(slug, { limit: 8, offset: 0 });
    featured = res.items;
  } catch (err) {
    console.error("sports featured fetch failed:", err);
  }

  return (
    <CategoryLanding
      category={category}
      intro="Move more — at home, at the gym, on the trail. Equipment that holds up to actually using it."
      heroImage="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&auto=format&fit=crop"
      usps={[
        { title: "Free shipping over $50", body: "On every sports order." },
        { title: "Tested by athletes", body: "Every product reviewed by our in-house team." },
        { title: "Real warranties", body: "Lifetime on frames, 1-year on electronics." },
        { title: "Easy returns", body: "30 days, used or not — we stand behind every product." },
      ]}
      featured={featured}
    />
  );
}
