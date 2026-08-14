"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CategoryPagination } from "@/components/category/CategoryPagination";
import { CategoryProductCard } from "@/components/category/CategoryProductCard";
import {
  CategorySidebar,
  type CategoryFilterItem,
} from "@/components/category/CategorySidebar";
import { Container } from "@/components/Container";
import type { ProductCardModel } from "@/lib/api/types";

const PAGE_SIZE = 8;

type CategoryPageContentProps = {
  filters: CategoryFilterItem[];
  products: ProductCardModel[];
  /** Map category id -> product ids belonging to it (from API). Empty = show all. */
  productsByCategory?: Record<string, string[]>;
};

export function CategoryPageContent({
  filters,
  products,
  productsByCategory = {},
}: CategoryPageContentProps) {
  const initialId = filters[0]?.id ?? "all";
  const [activeCategory, setActiveCategory] = useState(initialId);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const ids = productsByCategory[activeCategory];
    if (!ids || ids.length === 0) return products;
    const idSet = new Set(ids);
    const matched = products.filter((item) => idSet.has(item.id));
    return matched.length ? matched : products;
  }, [activeCategory, products, productsByCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));

  const visibleProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, page]);

  const activeLabel =
    filters.find((item) => item.id === activeCategory)?.label ?? "محصولات";

  return (
    <Container className="py-0">
      <div
        className="overflow-hidden rounded-none bg-[#f4f0f6] lg:grid lg:grid-cols-[240px_1fr] xl:grid-cols-[260px_1fr]"
        style={{ direction: "ltr" }}
      >
        <div
          dir="rtl"
          className={`${filtersOpen ? "block" : "hidden"} border-b border-[#efe6f4] lg:block lg:border-b-0`}
        >
          <CategorySidebar
            filters={filters}
            activeId={activeCategory}
            onSelect={(id) => {
              setActiveCategory(id);
              setPage(1);
              setFiltersOpen(false);
            }}
          />
        </div>

        <section dir="rtl" className="bg-[#f4f0f6] px-4 py-4 sm:px-5 sm:py-5">
          <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
            <button
              type="button"
              onClick={() => setFiltersOpen((value) => !value)}
              className="rounded-lg border border-[#d9c6e3] bg-white px-3 py-2 text-xs font-bold text-[#5b2a63] transition hover:bg-[#f8f2fb] lg:hidden"
              aria-expanded={filtersOpen}
            >
              {filtersOpen ? "بستن فیلترها" : "فیلترها"}
            </button>
            <h1 className="flex-1 text-right text-lg font-bold text-[#3d2246] sm:text-xl lg:text-[22px]">
              دسته‌بندی: {activeLabel}
            </h1>
          </div>

          {visibleProducts.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#6b5b73]">
              محصولی در این دسته‌بندی یافت نشد.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((product) => (
                <Link
                  key={`${activeCategory}-${product.id}`}
                  href={`/products/${product.id}`}
                  className="block"
                >
                  <CategoryProductCard
                    title={product.title}
                    price={product.price}
                    rating="۴.۸"
                    image={product.image}
                  />
                </Link>
              ))}
            </div>
          )}

          <CategoryPagination
            page={Math.min(page, totalPages)}
            total={totalPages}
            onChange={setPage}
          />
        </section>
      </div>
    </Container>
  );
}
