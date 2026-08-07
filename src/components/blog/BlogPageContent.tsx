"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { BlogArticleCard } from "@/components/blog/BlogArticleCard";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { CategoryPagination } from "@/components/category/CategoryPagination";
import { Container } from "@/components/Container";
import { blogPosts } from "@/data/blog";

const MOBILE_PAGE_SIZE = 4;
const DESKTOP_PAGE_SIZE = 6;
const TOTAL_PAGES = 3;

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

  const mobileVisible = useMemo(() => {
    const rotated = [
      ...filtered.slice(((page - 1) * 2) % filtered.length),
      ...filtered.slice(0, ((page - 1) * 2) % filtered.length),
    ];
    return rotated.slice(0, MOBILE_PAGE_SIZE);
  }, [filtered, page]);

  const desktopVisible = useMemo(() => {
    const rotated = [
      ...filtered.slice(((page - 1) * 2) % filtered.length),
      ...filtered.slice(0, ((page - 1) * 2) % filtered.length),
    ];
    return rotated.slice(0, DESKTOP_PAGE_SIZE);
  }, [filtered, page]);

  return (
    <>
      {/* Mobile — Figma 33:8 */}
      <div className="bg-white lg:hidden">
        {filtersOpen ? (
          <div className="border-b border-[#efe6f4]">
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
        ) : null}

        <section className="relative h-[185px] w-full overflow-hidden">
          <Image
            src="/images/figma/blog-banner-mobile.png"
            alt="خلاقیت رزینی"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
          />
          <p className="absolute bottom-2 end-2.5 start-2.5 text-right text-sm font-medium text-white drop-shadow-[0px_1px_4px_rgba(0,0,0,0.7)]">
            خلاقیت رزینی: الهام، هنر، زندگی
          </p>
        </section>

        <div className="grid grid-cols-2 gap-2.5 px-2.5 py-3">
          {mobileVisible.map((post) => (
            <BlogArticleCard
              key={`m-${post.id}-${page}-${categoryId}`}
              id={post.id}
              title={post.shortTitle}
              excerpt={post.excerpt}
              category={post.category}
              author={post.author}
              price={post.price}
              image={post.image}
              label={post.label}
              variant="compact"
            />
          ))}
        </div>

        <div
          className="flex flex-wrap items-center justify-center gap-1.5 px-3 pb-5 pt-1"
          dir="ltr"
        >
          <button
            type="button"
            onClick={() => setFiltersOpen((value) => !value)}
            className="flex items-center gap-1.5 rounded-md border border-[#ddd] bg-white px-2.5 py-1 text-[11px] text-black"
            aria-expanded={filtersOpen}
          >
            <Image
              src="/images/figma/icon-filter-blog-m.svg"
              alt=""
              width={11}
              height={11}
              className="size-[11px]"
            />
            <span dir="rtl">دسته‌بندی‌ها</span>
          </button>

          {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPage(item)}
              className={`min-w-6 rounded-md border px-2.5 py-1 text-[11px] shadow-[0px_1px_1.5px_rgba(0,0,0,0.08)] ${
                item === page
                  ? "border-[#6d1f63] bg-[#6d1f63] text-white"
                  : "border-[#ddd] bg-white text-[#333]"
              }`}
            >
              {item === 1 ? "۱" : item === 2 ? "۲" : "۳"}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setPage(Math.min(TOTAL_PAGES, page + 1))}
            disabled={page >= TOTAL_PAGES}
            className="rounded-md border border-[#ddd] bg-white px-2.5 py-1 text-[11px] text-[#333] shadow-[0px_1px_1.5px_rgba(0,0,0,0.08)] disabled:opacity-40"
            dir="rtl"
          >
            بعدی
          </button>
        </div>
      </div>

      {/* Desktop */}
      <Container className="hidden py-0 lg:block">
        <div
          className="overflow-hidden bg-[#f4f0f6] lg:grid lg:grid-cols-[220px_1fr] xl:grid-cols-[240px_1fr]"
          style={{ direction: "ltr" }}
        >
          <div dir="rtl">
            <BlogSidebar
              categoryId={categoryId}
              levelId={levelId}
              extraId={extraId}
              onCategoryChange={(id) => {
                setCategoryId(id);
                setPage(1);
              }}
              onLevelChange={setLevelId}
              onExtraChange={setExtraId}
            />
          </div>

          <section dir="rtl" className="bg-white">
            <div className="bg-[#e8d9f0] px-4 py-2 text-center text-[13px] text-[#5b2a63]">
              وبلاگ تخصصی رزین‌مال: الهام، هنر، زندگی
            </div>

            <div className="px-5 py-5">
              <h1 className="mb-5 text-right text-xl font-bold text-[#3d2246]">
                آخرین مقالات و آموزش‌ها
              </h1>

              <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
                {desktopVisible.map((post) => (
                  <BlogArticleCard
                    key={`d-${post.id}-${page}-${categoryId}`}
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
                total={TOTAL_PAGES}
                onChange={setPage}
              />
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}
