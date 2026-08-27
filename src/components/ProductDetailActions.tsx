"use client";

import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import type { FavoriteProduct } from "@/lib/favorites";

type ProductDetailActionsProps = {
  product: FavoriteProduct;
};

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <AddToCartButton
        productId={product.id}
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
  );
}
