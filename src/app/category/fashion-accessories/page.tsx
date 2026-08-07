// src/app/category/fashion-accessories/page.tsx
import { CategoryLanding } from "@/components/CategoryLanding";
import { getAllCategories, getProductsByCategory } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function FashionAccessoriesPage() {
  const slug = "fashion-accessories";
  let categories: Awaited<ReturnType<typeof getAllCategories>> = [];
  try {
    categories = await getAllCategories();
  } catch {
    categories = [];
  }
  const category = categories.find((c) => c.slug === slug) ?? {
    id: `seed-${slug}`,
    slug,
    name: "Fashion & Accessories",
    image_url: null,
  };

  let featured: Awaited<ReturnType<typeof getProductsByCategory>>["items"] = [];
  try {
    const res = await getProductsByCategory(slug, { limit: 8, offset: 0 });
    featured = res.items;
  } catch (err) {
    console.error("fashion-accessories featured fetch failed:", err);
  }

  return (
    <CategoryLanding
      category={category}
      intro="Everyday pieces, statement accents. Bags, sunglasses, scarves, and the small details that pull an outfit together."
      heroImage="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop"
      usps={[
        { title: "Try before you commit", body: "30-day returns on all accessories." },
        { title: "Pairs with everything", body: "Neutral palettes and timeless silhouettes." },
        { title: "Affordable without cheaping out", body: "Real leather and solid metals, fair pricing." },
        { title: "Fast shipping", body: "Most orders ship within 24 hours." },
      ]}
      featured={featured}
    />
  );
}
