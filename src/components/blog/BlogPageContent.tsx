"use client";

import { useMemo, useState } from "react";
import { BlogArticleCard } from "@/components/blog/BlogArticleCard";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { CategoryPagination } from "@/components/category/CategoryPagination";
import { Container } from "@/components/Container";
import { blogPosts } from "@/data/blog";

export function BlogPageContent() {
  const [categoryId, setCategoryId] = useState("tutorial");
  const [levelId, setLevelId] = useState("beginner");
  const [extraId, setExtraId] = useState("kit");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const byCategory = blogPosts.filter(
      (post) => post.categoryId === categoryId,
    );
    return byCategory.length >= 3 ? byCategory : blogPosts;
  }, [categoryId]);

  const pageSize = 6;
  const totalPages = 3;
  const visible = useMemo(() => {
    const rotated = [
      ...filtered.slice(((page - 1) * 2) % filtered.length),
      ...filtered.slice(0, ((page - 1) * 2) % filtered.length),
    ];
    return rotated.slice(0, pageSize);
  }, [filtered, page]);

  return (
    <Container className="py-0">
      <div
        className="overflow-hidden bg-[#f4f0f6] lg:grid lg:grid-cols-[220px_1fr] xl:grid-cols-[240px_1fr]"
        style={{ direction: "ltr" }}
      >
        <div
          dir="rtl"
          className={`${filtersOpen ? "block" : "hidden"} border-b border-[#efe6f4] lg:block lg:border-b-0`}
        >
          <BlogSidebar
            categoryId={categoryId}
            levelId={levelId}
            extraId={extraId}
            onCategoryChange={(id) => {
              setCategoryId(id);
              setPage(1);
              setFiltersOpen(false);
            }}
            onLevelChange={setLevelId}
            onExtraChange={setExtraId}
          />
        </div>

        <section dir="rtl" className="bg-white">
          <div className="bg-[#e8d9f0] px-3 py-2 text-center text-xs leading-5 text-[#5b2a63] sm:px-4 sm:text-[13px]">
            وبلاگ تخصصی رزین‌مال: الهام، هنر، زندگی
          </div>

          <div className="px-4 py-4 sm:px-5 sm:py-5">
            <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
              <button
                type="button"
                onClick={() => setFiltersOpen((value) => !value)}
                className="rounded-lg border border-[#d9c6e3] bg-[#f7f4f9] px-3 py-2 text-xs font-bold text-[#5b2a63] transition hover:bg-[#f0e6f6] lg:hidden"
                aria-expanded={filtersOpen}
              >
                {filtersOpen ? "بستن فیلترها" : "فیلترها"}
              </button>
              <h1 className="flex-1 text-right text-lg font-bold text-[#3d2246] sm:text-xl">
                آخرین مقالات و آموزش‌ها
              </h1>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((post) => (
                <BlogArticleCard
                  key={`${post.id}-${page}-${categoryId}`}
                  id={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  category={post.category}
                  author={post.author}
                  price={post.price}
                  image={post.image}
                />
              ))}
            </div>

            <CategoryPagination
              page={page}
              total={totalPages}
              onChange={setPage}
            />
          </div>
        </section>
      </div>
    </Container>
  );
}
