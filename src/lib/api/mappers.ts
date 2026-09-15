import type {
  ProductCardModel,
  ProductDetail,
  ProductImage,
  ProductVariantDetail,
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

export function getPrimaryImage(
  images: ProductImage[] | undefined,
): string {
  if (!images?.length) return PLACEHOLDER_IMAGE;
  const primary =
    images.find((img) => img.is_primary) ??
    [...images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0];
  const url = publicMediaUrl(primary?.image);
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

export function mapProductDetailToCard(
  product: ProductDetail,
): ProductCardModel {
  const variant = getDefaultVariant(product.variants);
  return {
    id: String(product.id),
    title: product.title,
    subtitle: getBrandTitle(product.brand) || "رزینمال",
    ...getVariantPricing(variant),
    image: getPrimaryImage(product.images),
    description: product.short_description || product.description || undefined,
    variantId: variant?.id,
  };
}

