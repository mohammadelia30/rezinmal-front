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
  // نسخهٔ ناموجود نباید از اول انتخاب باشد، وگرنه دکمهٔ خرید بی‌دلیل
  // خاموش به نظر می‌رسد
  const [selectedId, setSelectedId] = useState<number | undefined>(
    (options.find((item) => item.inStock) ?? options[0])?.id,
  );

  const selected = options.find((item) => item.id === selectedId) ?? options[0];
  // وقتی تفاوت نسخه‌ها فقط رنگ است، پالت رنگ از فهرست نوشته‌ها
  // گویاتر است؛ نسخه‌ای که سایز هم دارد همان دکمه‌های قبلی را می‌گیرد
  const palette =
    options.length > 1 &&
    options.every((item) => item.color && item.attributeCount === 1);
  const soldOut = selected ? !selected.inStock : Boolean(product.soldOut);
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
            {palette ? "انتخاب رنگ" : "انتخاب نوع محصول"}
          </p>

          {palette ? (
            <>
              <div className="flex flex-wrap justify-start gap-3">
                {options.map((option) => {
                  const active = option.id === selected?.id;
                  const color = option.color as { name: string; hex: string };

                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={!option.inStock}
                      onClick={() => setSelectedId(option.id)}
                      aria-pressed={active}
                      aria-label={
                        option.inStock
                          ? `${color.name} — ${option.price}`
                          : `${color.name} — ناموجود`
                      }
                      title={
                        option.inStock
                          ? `${color.name} — ${option.price}`
                          : `${color.name} — ناموجود`
                      }
                      className={`relative size-10 rounded-full border-2 transition ${
                        active
                          ? "border-brand ring-2 ring-brand/30"
                          : "border-[#e6dcc2] hover:border-brand/50"
                      } ${option.inStock ? "" : "cursor-not-allowed opacity-50"}`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {/* رنگ ناموجود خط خورده نشان داده می‌شود؛ وگرنه
                          مشتری رویش کلیک می‌کند و دلیلش را نمی‌فهمد */}
                      {option.inStock ? null : (
                        <span
                          aria-hidden
                          className="absolute inset-0 m-auto h-0.5 w-9 rotate-45 rounded-full bg-[#6b5b73]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="mt-2 text-sm text-muted">
                {selected?.color?.name}
                {selected && !selected.inStock ? " — ناموجود" : ""}
              </p>
            </>
          ) : (
            // عرض کمینهٔ یکسان: با «کد: ۱» کنار «سیلیکون داتینگ»،
            // دکمه‌ها هر کدام یک اندازه می‌شدند و ردیف ناهموار به نظر
            // می‌رسید
            <div className="flex flex-wrap justify-start gap-2">
              {options.map((option) => {
                const active = option.id === selected?.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={!option.inStock}
                    onClick={() => setSelectedId(option.id)}
                    aria-pressed={active}
                    className={`min-h-[3.25rem] min-w-[5.5rem] rounded-xl border px-3 py-2 text-center text-sm font-medium transition ${
                      !option.inStock
                        ? "cursor-not-allowed border-[#e6dcc2] bg-[#f4f1ea] text-muted"
                        : active
                          ? "border-brand bg-brand-mist text-brand"
                          : "border-[#e6dcc2] bg-white text-foreground hover:border-brand/50"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {/* نسخه‌ای که هم رنگ دارد و هم سایز، رنگش را
                          این‌جا به‌شکل یک نقطه نشان می‌دهد */}
                      {option.color ? (
                        <span
                          aria-hidden
                          className="size-4 shrink-0 rounded-full border border-[#d9cfbb]"
                          style={{ backgroundColor: option.color.hex }}
                        />
                      ) : null}
                      {option.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">
                      {option.inStock ? option.price : "ناموجود"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* خریدِ چیزی که موجودی ندارد در بک‌اند رد می‌شود؛ بهتر است
            همین‌جا معلوم باشد تا مشتری تا درگاه پرداخت نرود */}
        {soldOut ? (
          <span className="inline-flex w-full items-center justify-center rounded-lg bg-[#f4f1ea] px-8 py-3 text-base font-bold text-muted sm:w-auto">
            ناموجود
          </span>
        ) : (
          <AddToCartButton
            productId={product.id}
            variantId={selected?.id}
            label="افزودن به سبد خرید"
            redirectToCart
            className="inline-flex w-full rounded-lg bg-brand px-8 py-3 text-base font-bold text-white transition hover:bg-brand-dark sm:w-auto"
          />
        )}

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
