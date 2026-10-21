import type { Metadata } from "next";
import { CategoryPageContent } from "@/components/category/CategoryPageContent";
import { Header } from "@/components/Header";
import { getStoreCatalog, getStoreCategories } from "@/lib/api";

export const metadata: Metadata = {
  title: "دسته‌بندی‌ها | رزینمال",
  description: "مرور دسته‌بندی محصولات رزینمال؛ زیرلیوانی، ساعت، زیورآلات و بیشتر.",
};

export const dynamic = "force-dynamic";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [{ category }, apiCategories, catalog] = await Promise.all([
    searchParams,
    getStoreCategories(),
    getStoreCatalog(),
  ]);

  // «همه» اول فهرست است تا صفحه هیچ‌وقت خالی باز نشود
  const filters = [
    { id: "all", label: "همهٔ محصولات" },
    ...apiCategories.map((item) => ({
      id: String(item.id),
      label: item.title,
    })),
  ];

  const products = catalog.products;

  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#f6f1e7] md:bg-background">
      <Header />
      <main className="flex-1 bg-[#f4f0f6]">
        <CategoryPageContent
          filters={filters}
          products={products}
          productsByCategory={catalog.productsByCategory}
          initialCategory={category}
        />
      </main>
    </div>
  );
}
