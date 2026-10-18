"use client";

import { getVariantPricing } from "@/lib/api/mappers";
import type { ProductCardModel } from "@/lib/api/types";

/**
 * گرفتن محصولات واقعی بر اساس شناسه، برای سبد خرید و علاقه‌مندی‌ها.
 *
 * هر دو فقط شناسهٔ محصول را در حافظهٔ مرورگر نگه می‌دارند و برای نمایش،
 * اطلاعات را از API می‌گیرند. قبلاً این شناسه‌ها در دادهٔ نمونهٔ قدیمی
 * جست‌وجو می‌شدند و چون شناسهٔ محصولات واقعی عددی است، هیچ‌وقت پیدا
 * نمی‌شدند و سبد و علاقه‌مندی‌ها همیشه خالی به نظر می‌رسیدند.
 */

const PLACEHOLDER_IMAGE = "/images/product-1.jpg";

type ApiVariant = {
  id: number;
  price: number;
  final_price?: number;
  is_default?: boolean;
  is_active?: boolean;
  attribute_values?: { attribute?: string; value: string }[];
};
type ApiImage = { image?: string | null; is_primary?: boolean };

type ApiProduct = {
  id: number;
  title: string;
  brand?: { title?: string } | string | null;
  variants?: ApiVariant[];
  images?: ApiImage[];
};

function toCard(product: ApiProduct, variantId?: number): ProductCardModel {
  // نسخهٔ انتخاب‌شدهٔ مشتری؛ وگرنه نسخهٔ پیش‌فرض محصول
  const variant =
    (variantId
      ? product.variants?.find((item) => item.id === variantId)
      : undefined) ??
    product.variants?.find((item) => item.is_default) ??
    product.variants?.[0];
  const image =
    product.images?.find((item) => item.is_primary) ?? product.images?.[0];
  const brand =
    typeof product.brand === "string"
      ? product.brand
      : (product.brand?.title ?? "");

  const attributes = (variant?.attribute_values ?? [])
    .map((item) => (item.attribute ? `${item.attribute}: ${item.value}` : item.value))
    .filter(Boolean)
    .join("، ");

  return {
    id: String(product.id),
    title: product.title,
    // ویژگی نسخه کنار نام برند می‌آید تا در سبد معلوم باشد کدام رنگ
    // یا سایز انتخاب شده است
    subtitle: attributes || brand || "رزین‌مال",
    variantId: variant?.id,
    // قیمت بعد از تخفیف؛ سبد خرید با همین جمع می‌زند
    ...getVariantPricing(variant),
    image: image?.image ? toPublicPath(image.image) : PLACEHOLDER_IMAGE,
  };
}

/** آدرس مطلقِ داخلی برای مرورگر قابل استفاده نیست؛ به مسیر نسبی تبدیل می‌شود. */
function toPublicPath(url: string): string {
  if (!url.startsWith("http")) return url.startsWith("/") ? url : `/${url}`;
  try {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return PLACEHOLDER_IMAGE;
  }
}

export type CartLineRef = { id: string; variantId?: number };

/**
 * محصولات سبد خرید و علاقه‌مندی‌ها.
 *
 * کلید نتیجه «شناسهٔ محصول:شناسهٔ نسخه» است، چون یک محصول با دو نسخهٔ
 * مختلف دو ردیف و دو قیمت دارد.
 */
export async function fetchProductsByIds(
  refs: (string | CartLineRef)[],
): Promise<Map<string, ProductCardModel>> {
  const lines = refs
    .map((ref) => (typeof ref === "string" ? { id: ref } : ref))
    .filter((ref) => /^\d+$/.test(ref.id));

  const unique = new Map<string, CartLineRef>();
  for (const line of lines) {
    unique.set(`${line.id}:${line.variantId ?? ""}`, line);
  }

  const found = new Map<string, ProductCardModel>();

  await Promise.all(
    Array.from(unique.entries()).map(async ([key, line]) => {
      try {
        const response = await fetch(`/api/catalog/products/${line.id}`, {
          credentials: "same-origin",
        });
        if (!response.ok) return;
        const data = (await response.json()) as ApiProduct;
        found.set(key, toCard(data, line.variantId));
      } catch {
        // محصول حذف شده یا شبکه قطع است؛ از قلم می‌افتد
      }
    }),
  );

  return found;
}
