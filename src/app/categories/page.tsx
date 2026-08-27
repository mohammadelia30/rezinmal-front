import type { Metadata } from "next";
import { CategoryPageContent } from "@/components/category/CategoryPageContent";
import { Header } from "@/components/Header";
import { categoryFilters, categoryProducts } from "@/data/categories";
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

  const filters =
    apiCategories.length > 0
      ? apiCategories.map((item) => ({
          id: String(item.id),
          label: item.title,
        }))
      : categoryFilters.map((item) => ({
          id: item.id,
          label: item.label,
        }));

  const products = catalog.fromApi
    ? catalog.products
    : categoryProducts.map((item) => ({
        id: item.id,
        title: item.title,
        subtitle: "",
        price: item.price,
        image: item.image,
      }));

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
