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

  // UI matches Figma pagination (1 / 2 / 3)
  const totalPages = 3;

  const visibleProducts = useMemo(() => {
    // Cycle products across pages for demo content
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
        <div dir="rtl">
          <CategorySidebar
            activeId={activeCategory}
            onSelect={(id) => {
              setActiveCategory(id);
              setPage(1);
            }}
          />
        </div>

        <section dir="rtl" className="bg-[#f4f0f6] px-4 py-4 sm:px-5 sm:py-5">
          <h1 className="mb-5 text-right text-lg font-bold text-[#3d2246] sm:text-xl lg:text-[22px]">
            {categoryTitles[activeCategory] ?? categoryTitles.coasters}
          </h1>

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
