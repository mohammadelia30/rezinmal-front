"use client";

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

type ApiVariant = { price?: number; is_default?: boolean };
type ApiImage = { image?: string | null; is_primary?: boolean };

type ApiProduct = {
  id: number;
  title: string;
  brand?: { title?: string } | string | null;
  variants?: ApiVariant[];
  images?: ApiImage[];
};

function formatPrice(value?: number): string {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  return `${new Intl.NumberFormat("fa-IR").format(value)} تومان`;
}

function toCard(product: ApiProduct): ProductCardModel {
  const variant =
    product.variants?.find((item) => item.is_default) ?? product.variants?.[0];
  const image =
    product.images?.find((item) => item.is_primary) ?? product.images?.[0];
  const brand =
    typeof product.brand === "string"
      ? product.brand
      : (product.brand?.title ?? "");

  return {
    id: String(product.id),
    title: product.title,
    subtitle: brand || "رزین‌مال",
    price: formatPrice(variant?.price),
    image: image?.image ? toPublicPath(image.image) : PLACEHOLDER_IMAGE,
    rawPrice: variant?.price,
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

/** چند محصول را هم‌زمان می‌گیرد؛ شناسه‌های نامعتبر نادیده گرفته می‌شوند. */
export async function fetchProductsByIds(
  ids: string[],
): Promise<Map<string, ProductCardModel>> {
  const unique = Array.from(new Set(ids.filter((id) => /^\d+$/.test(id))));
  const found = new Map<string, ProductCardModel>();

  await Promise.all(
    unique.map(async (id) => {
      try {
        const response = await fetch(`/api/catalog/products/${id}`, {
          credentials: "same-origin",
        });
        if (!response.ok) return;
        const data = (await response.json()) as ApiProduct;
        found.set(String(data.id), toCard(data));
      } catch {
        // محصول حذف شده یا شبکه قطع است؛ از قلم می‌افتد
      }
    }),
  );

  return found;
}
