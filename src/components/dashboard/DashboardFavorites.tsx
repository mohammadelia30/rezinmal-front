"use client";

import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/lib/favorites";

export function DashboardFavorites() {
  const { favorites, remove } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-[0_4px_20px_rgba(78,42,84,0.06)] sm:p-10">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-brand-mist text-brand">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="size-7"
            aria-hidden
          >
            <path
              d="M12 20.5s-6.8-4.3-9.2-8.4C.8 8.8 2.6 5.5 6.1 5.1c2-.3 3.8.8 4.9 2.3 1.1-1.5 2.9-2.6 4.9-2.3 3.5.4 5.3 3.7 3.3 7-2.4 4.1-9.2 8.4-9.2 8.4Z"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-foreground">لیست علاقه‌مندی خالی است</h2>
        <p className="mt-2 text-sm leading-7 text-muted">
          محصولات مورد علاقه خود را از فروشگاه با آیکون قلب ذخیره کنید.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
        >
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-5 shadow-[0_4px_20px_rgba(78,42,84,0.06)] sm:p-6">
        <h2 className="text-right text-lg font-bold text-foreground">
          علاقه‌مندی‌های من
        </h2>
        <p className="mt-1 text-right text-sm text-muted">
          {favorites.length} محصول ذخیره شده
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {favorites.map((product) => (
          <article
            key={product.id}
            className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgba(78,42,84,0.06)]"
          >
            <Link
              href={`/products/${product.id}`}
              className="relative block aspect-square overflow-hidden bg-brand-mist"
            >
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="(max-width: 640px) 100vw, 320px"
                className="object-cover transition duration-500 hover:scale-105"
              />
            </Link>

            <div className="space-y-3 p-4">
              <div className="text-right">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-bold text-foreground">{product.title}</h3>
                </Link>
                <div className="mt-1 flex items-center justify-between text-sm text-muted">
                  <span>{product.price}</span>
                  <span>{product.subtitle}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => remove(product.id)}
                  className="rounded-lg border border-[#e6dcc2] px-3 py-2 text-xs font-medium text-[#8a3a3a] transition hover:bg-[#fff5f5]"
                >
                  حذف
                </button>
                <Link
                  href={`/products/${product.id}`}
                  className="flex-1 rounded-lg bg-brand py-2 text-center text-sm font-bold text-white transition hover:bg-brand-dark"
                >
                  مشاهده و خرید
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
