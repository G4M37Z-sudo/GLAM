// src/app/category/gadgets/page.tsx
import { CategoryLanding } from "@/components/CategoryLanding";
import { getAllCategories, getProductsByCategory } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function GadgetsPage() {
  const slug = "gadgets";
  let categories: Awaited<ReturnType<typeof getAllCategories>> = [];
  try {
    categories = await getAllCategories();
  } catch {
    categories = [];
  }
  const category = categories.find((c) => c.slug === slug) ?? {
    id: `seed-${slug}`,
    slug,
    name: "Gadgets",
    image_url: null,
  };

  let featured: Awaited<ReturnType<typeof getProductsByCategory>>["items"] = [];
  try {
    const res = await getProductsByCategory(slug, { limit: 8, offset: 0 });
    featured = res.items;
  } catch (err) {
    console.error("gadgets featured fetch failed:", err);
  }

  return (
    <CategoryLanding
      category={category}
      intro="Smart, fun, surprisingly useful. The desk drawer essentials that earn their place."
      heroImage="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&auto=format&fit=crop"
      usps={[
        { title: "Free shipping over $50", body: "On every order." },
        { title: "Sourced from makers", body: "Direct from small brands where possible." },
        { title: "Real warranties", body: "Manufacturer warranty on all gadgets." },
        { title: "30-day returns", body: "If it doesn't delight, send it back." },
      ]}
      featured={featured}
    />
  );
}
