import type {
  ProductCardModel,
  ProductDetail,
  ProductImage,
  ProductVariantDetail,
  VariantOption,
} from "@/lib/api/types";
import { formatPrice, publicMediaUrl } from "@/lib/format";

const PLACEHOLDER_IMAGE = "/images/product-1.jpg";

export function getBrandTitle(
  brand: ProductDetail["brand"],
): string {
  if (!brand) return "";
  if (typeof brand === "string") return brand;
  return brand.title ?? "";
}

export function getPrimaryImageRecord(
  images: ProductImage[] | undefined,
): ProductImage | undefined {
  if (!images?.length) return undefined;
  return (
    images.find((img) => img.is_primary) ??
    [...images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0]
  );
}

export function getPrimaryImage(
  images: ProductImage[] | undefined,
): string {
  const url = publicMediaUrl(getPrimaryImageRecord(images)?.image);
  return url ?? PLACEHOLDER_IMAGE;
}

export function getDefaultVariant(
  variants: ProductVariantDetail[] | undefined,
): ProductVariantDetail | undefined {
  if (!variants?.length) return undefined;
  return (
    variants.find((v) => v.is_default && v.is_active !== false) ??
    variants.find((v) => v.is_active !== false) ??
    variants[0]
  );
}

/**
 * قیمت نمایشی یک نسخه: قیمت نهایی، و اگر تخفیف دارد قیمت قبلی و درصد.
 *
 * درصد برای تخفیف مبلغ ثابت هم محاسبه می‌شود تا برچسب همیشه یکسان باشد.
 */
export function getVariantPricing(
  variant: Pick<ProductVariantDetail, "price" | "final_price"> | undefined,
): Pick<ProductCardModel, "price" | "rawPrice" | "oldPrice" | "discountPercent"> {
  const base = variant?.price;
  const final = variant?.final_price ?? base;
  const discounted =
    base !== undefined && final !== undefined && final < base && base > 0;

  return {
    price: formatPrice(final),
    rawPrice: final,
    oldPrice: discounted ? formatPrice(base) : undefined,
    discountPercent: discounted
      ? Math.max(1, Math.round(((base - final) / base) * 100))
      : undefined,
  };
}

/** «رنگ: قرمز، سایز: بزرگ» از ویژگی‌های نسخه */
export function variantLabel(
  variant: ProductVariantDetail,
  fallback: string,
): string {
  const parts = (variant.attribute_values ?? [])
    .map((item) =>
      item.attribute ? `${item.attribute}: ${item.value}` : item.value,
    )
    .filter(Boolean);

  return parts.length ? parts.join("، ") : fallback;
}

/**
 * نسخه‌های قابل خرید محصول.
 *
 * هر رنگ یا سایز در بک‌اند یک نسخهٔ جداست و قیمت خودش را دارد؛ فقط
 * نسخه‌های فعال به مشتری نشان داده می‌شود.
 */
export function getVariantOptions(
  product: ProductDetail,
): VariantOption[] {
  return (product.variants ?? [])
    .filter((variant) => variant.is_active !== false)
    .map((variant, index) => ({
      id: variant.id,
      label: variantLabel(variant, `نسخهٔ ${index + 1}`),
      ...getVariantPricing(variant),
      rawPrice: variant.final_price ?? variant.price,
      // بک‌اند قدیمی این فیلد را نمی‌فرستد؛ آن‌وقت مثل قبل همه‌چیز
      // قابل خرید فرض می‌شود
      inStock: variant.in_stock !== false,
    }));
}

export function mapProductDetailToCard(
  product: ProductDetail,
): ProductCardModel {
  const variant = getDefaultVariant(product.variants);
  const options = getVariantOptions(product);
  return {
    id: String(product.id),
    title: product.title,
    subtitle: getBrandTitle(product.brand) || "رزینمال",
    ...getVariantPricing(variant),
    image: getPrimaryImage(product.images),
    description: product.short_description || product.description || undefined,
    metaTitle: product.meta_title || undefined,
    metaDescription: product.meta_description || undefined,
    imageAlt: getPrimaryImageRecord(product.images)?.alt || undefined,
    variants: options,
    variantId: variant?.id,
    // هیچ نسخه‌ای موجودی ندارد: محصول را «ناموجود» نشان می‌دهیم به‌جای
    // اینکه مشتری تا مرحلهٔ پرداخت برود و آنجا خطا بگیرد
    soldOut: options.length > 0 && options.every((item) => !item.inStock),
  };
}

