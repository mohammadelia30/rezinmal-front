"use client";

import { useMemo, useState } from "react";
import { CategoryPagination } from "@/components/category/CategoryPagination";
import { CategoryProductCard } from "@/components/category/CategoryProductCard";
import { CategorySidebar } from "@/components/category/CategorySidebar";
import { Container } from "@/components/Container";
import {
  categoryProducts,
  categoryTitles,
} from "@/data/categories";

const PAGE_SIZE = 8;

export function CategoryPageContent() {
  const [activeCategory, setActiveCategory] = useState("coasters");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const totalPages = 3;

  const visibleProducts = useMemo(() => {
    const rotated = [
      ...categoryProducts.slice((page - 1) % categoryProducts.length),
      ...categoryProducts.slice(0, (page - 1) % categoryProducts.length),
    ];
    return rotated.slice(0, PAGE_SIZE);
  }, [page]);

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
              {categoryTitles[activeCategory] ?? categoryTitles.coasters}
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <CategoryProductCard
                key={`${activeCategory}-${product.id}`}
                title={product.title}
                price={product.price}
                rating={product.rating}
                image={product.image}
              />
            ))}
          </div>

          <CategoryPagination
            page={page}
            total={totalPages}
            onChange={setPage}
          />
        </section>
      </div>
    </Container>
  );
}
