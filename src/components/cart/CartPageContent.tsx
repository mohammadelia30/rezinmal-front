"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/Container";
import { formatProductPrice, parseProductPrice } from "@/lib/price";
import { useCart } from "@/lib/cart";

export function CartPageContent() {
  const { items, total, totalLabel, setQuantity, remove, clear } = useCart();
  const [checkedOut, setCheckedOut] = useState(false);

  const handleCheckout = () => {
    setCheckedOut(true);
    clear();
  };

  if (checkedOut) {
    return (
      <Container className="py-10 sm:py-14">
        <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-[0_8px_30px_rgba(78,42,84,0.08)]">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[#e4f5ea] text-[#2f6b45]">
            ✓
          </div>
          <h1 className="text-xl font-bold text-foreground">سفارش ثبت شد</h1>
          <p className="mt-2 text-sm leading-7 text-muted">
            سفارش شما با موفقیت ثبت شد. به‌زودی با شما تماس می‌گیریم.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            ادامه خرید
          </Link>
        </div>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-10 sm:py-14">
        <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-[0_8px_30px_rgba(78,42,84,0.08)]">
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
                d="M3.5 5h1.8l1.4 10.2a1.5 1.5 0 0 0 1.5 1.3h8.7a1.5 1.5 0 0 0 1.5-1.2L20 8.2H7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-foreground">سبد خرید خالی است</h1>
          <p className="mt-2 text-sm leading-7 text-muted">
            هنوز محصولی به سبد خرید اضافه نکرده‌اید.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            مشاهده محصولات
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      <div className="mb-6 text-right">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">سبد خرید</h1>
        <p className="mt-1 text-sm text-muted">{items.length} محصول در سبد شما</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="space-y-4">
          {items.map((item) => {
            const lineTotal = parseProductPrice(item.price) * item.quantity;

            return (
              <article
                key={item.id}
                className="rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(78,42,84,0.06)] sm:p-5"
              >
                <div className="flex gap-4">
                  <Link
                    href={`/products/${item.id}`}
                    className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-brand-mist sm:size-28"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="min-w-0 flex-1 text-right">
                    <Link href={`/products/${item.id}`}>
                      <h2 className="font-bold text-foreground">{item.title}</h2>
                    </Link>
                    <p className="mt-1 text-sm text-muted">{item.subtitle}</p>
                    <p className="mt-2 text-sm font-bold text-brand">{item.price}</p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        className="text-xs font-medium text-[#8a3a3a] transition hover:text-[#6f2f2f]"
                      >
                        حذف
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="کاهش تعداد"
                          onClick={() => setQuantity(item.id, item.quantity - 1)}
                          className="flex size-8 items-center justify-center rounded-lg border border-[#e6dcc2] bg-[#fbf9f1] text-brand transition hover:bg-brand-mist"
                        >
                          −
                        </button>
                        <span className="min-w-8 text-center text-sm font-bold">
                          {item.quantity.toLocaleString("fa-IR")}
                        </span>
                        <button
                          type="button"
                          aria-label="افزایش تعداد"
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                          className="flex size-8 items-center justify-center rounded-lg border border-[#e6dcc2] bg-[#fbf9f1] text-brand transition hover:bg-brand-mist"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#efe6d4] pt-4 text-sm">
                  <span className="font-bold text-brand">
                    {formatProductPrice(lineTotal)}
                  </span>
                  <span className="text-muted">جمع این محصول</span>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="rounded-2xl bg-white p-5 shadow-[0_4px_20px_rgba(78,42,84,0.06)] sm:p-6">
          <h2 className="text-right text-lg font-bold text-foreground">خلاصه سفارش</h2>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between text-muted">
              <span>{items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString("fa-IR")} قلم</span>
              <span>تعداد کل</span>
            </div>
            <div className="flex items-center justify-between font-bold text-foreground">
              <span>{totalLabel}</span>
              <span>مبلغ قابل پرداخت</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            className="mt-6 w-full rounded-xl bg-brand py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            ثبت سفارش
          </button>

          <Link
            href="/products"
            className="mt-3 block text-center text-sm font-medium text-brand transition hover:text-brand-dark"
          >
            ادامه خرید
          </Link>
        </aside>
      </div>
    </Container>
  );
}
