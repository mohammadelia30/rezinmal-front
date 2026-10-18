"use client";

import { useState } from "react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import Link from "next/link";
import type { ProductCardModel } from "@/lib/api/types";

/**
 * انتخاب نسخهٔ محصول (رنگ، سایز و …) همراه قیمت همان نسخه.
 *
 * هر نسخه در بک‌اند قیمت خودش را دارد؛ با انتخاب گزینه، قیمت نمایشی
 * عوض می‌شود و همان نسخه به سبد خرید می‌رود. محصولی که فقط یک نسخه
 * دارد، مثل قبل فقط قیمتش را نشان می‌دهد.
 */
export function ProductVariantPicker({
  product,
}: {
  product: ProductCardModel;
}) {
  const options = (product.variants ?? []).filter((item) => item.id);
  const [selectedId, setSelectedId] = useState<number | undefined>(
    options[0]?.id,
  );

  const selected = options.find((item) => item.id === selectedId) ?? options[0];
  const price = selected?.price ?? product.price;
  const oldPrice = selected?.oldPrice ?? product.oldPrice;
  const discountPercent = selected?.discountPercent ?? product.discountPercent;

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-wrap items-center justify-start gap-x-3 gap-y-1">
        <p className="text-xl font-bold text-brand sm:text-2xl">{price}</p>
        {oldPrice ? (
          <>
            <del className="text-base text-muted sm:text-lg">{oldPrice}</del>
            <span className="rounded-full bg-[#c0392b] px-2.5 py-0.5 text-xs font-bold text-white sm:text-sm">
              {discountPercent?.toLocaleString("fa-IR")}٪ تخفیف
            </span>
          </>
        ) : null}
      </div>

      {options.length > 1 ? (
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">
            انتخاب نوع محصول
          </p>
          <div className="flex flex-wrap justify-start gap-2">
            {options.map((option) => {
              const active = option.id === selected?.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedId(option.id)}
                  aria-pressed={active}
                  className={`min-h-10 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "border-brand bg-brand-mist text-brand"
                      : "border-[#e6dcc2] bg-white text-foreground hover:border-brand/50"
                  }`}
                >
                  <span className="block">{option.label}</span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {option.price}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <AddToCartButton
          productId={product.id}
          variantId={selected?.id}
          label="افزودن به سبد خرید"
          redirectToCart
          className="inline-flex w-full rounded-lg bg-brand px-8 py-3 text-base font-bold text-white transition hover:bg-brand-dark sm:w-auto"
        />

        <div className="flex items-center gap-3">
          <FavoriteButton product={product} className="size-11 bg-brand-mist" />
          <Link
            href="/cart"
            className="text-sm font-medium text-brand transition hover:text-brand-dark"
          >
            مشاهده سبد خرید
          </Link>
        </div>
      </div>
    </div>
  );
}
