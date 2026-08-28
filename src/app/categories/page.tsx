import type { Metadata } from "next";
import { CategoryPageContent } from "@/components/category/CategoryPageContent";
import { Header } from "@/components/Header";
import { getStoreCatalog, getStoreCategories } from "@/lib/api";

export const metadata: Metadata = {
  title: "دسته‌بندی‌ها | رزینمال",
  description: "مرور دسته‌بندی محصولات رزینمال؛ زیرلیوانی، ساعت، زیورآلات و بیشتر.",
};

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const [apiCategories, catalog] = await Promise.all([
    getStoreCategories(),
    getStoreCatalog(),
  ]);

  const filters = apiCategories.map((item) => ({
    id: String(item.id),
    label: item.title,
  }));

  const products = catalog.products;

  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#f6f1e7] md:bg-background">
      <Header />
      <main className="flex-1 bg-[#f4f0f6]">
        <CategoryPageContent
          filters={filters}
          products={products}
          productsByCategory={catalog.productsByCategory}
        />
      </main>
    </div>
  );
}
