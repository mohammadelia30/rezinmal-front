"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/Container";
import { ProductCard } from "@/components/ProductCard";
import type { ProductCardModel } from "@/lib/api/types";

/**
 * جست‌وجوی محصولات فروشگاه.
 *
 * فیلتر روی همان فهرستی که صفحه گرفته انجام می‌شود، پس نتیجه بدون
 * رفت‌وبرگشت به سرور و بدون وابستگی به Elasticsearch نمایش داده می‌شود.
 */
function normalizeDigits(value: string): string {
  return value.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
}

export function ProductSearch({ items }: { items: ProductCardModel[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const needle = normalizeDigits(query).trim().toLowerCase();
    if (!needle) return items;

    return items.filter((item) =>
      [item.title, item.subtitle, item.description]
        .filter(Boolean)
        .some((field) =>
          normalizeDigits(String(field)).toLowerCase().includes(needle),
        ),
    );
  }, [items, query]);

  return (
    <section className="py-6">
      <Container>
        <div className="relative mx-auto max-w-xl">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جست‌وجوی محصول..."
            aria-label="جست‌وجوی محصول"
            className="min-h-12 w-full rounded-2xl border border-[#e6dcc2] bg-white px-5 py-3 pe-12 text-right text-sm shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
          />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden
            className="pointer-events-none absolute end-4 top-1/2 size-5 -translate-y-1/2 text-muted"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
        </div>

        {query && results.length === 0 ? (
          <p className="mt-6 text-center text-sm text-muted">
            محصولی با «{query}» پیدا نشد.
          </p>
        ) : null}

        {query && results.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {results.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                subtitle={product.subtitle}
                price={product.price}
                image={product.image}
              />
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
