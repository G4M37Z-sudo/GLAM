// src/app/category/beauty-personal-care/page.tsx
import { CategoryLanding } from "@/components/CategoryLanding";
import { getAllCategories, getProductsByCategory } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function BeautyPage() {
  const slug = "beauty-personal-care";
  let categories: Awaited<ReturnType<typeof getAllCategories>> = [];
  try {
    categories = await getAllCategories();
  } catch {
    categories = [];
  }
  const category = categories.find((c) => c.slug === slug) ?? {
    id: `seed-${slug}`,
    slug,
    name: "Beauty & Personal Care",
    image_url: null,
  };

  let featured: Awaited<ReturnType<typeof getProductsByCategory>>["items"] = [];
  try {
    const res = await getProductsByCategory(slug, { limit: 8, offset: 0 });
    featured = res.items;
  } catch (err) {
    console.error("beauty featured fetch failed:", err);
  }

  return (
    <CategoryLanding
      category={category}
      intro="Skincare, makeup, and grooming essentials without the markup. Honest ingredients, real results."
      heroImage="https://images.unsplash.com/photo-1522335789203-aaa2f1b1f0c4?w=1200&auto=format&fit=crop"
      usps={[
        { title: "Cruelty-free", body: "Never tested on animals. Always." },
        { title: "Real ingredients", body: "Full ingredient lists, no proprietary blends." },
        { title: "30-day returns", body: "Unopened items, no questions." },
        { title: "Subscribers save 15%", body: "Auto-replenish your favorites." },
      ]}
      featured={featured}
    />
  );
}
