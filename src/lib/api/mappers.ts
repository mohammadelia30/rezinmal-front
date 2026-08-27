import type {
  ProductCardModel,
  ProductDetail,
  ProductImage,
  ProductVariantDetail,
} from "@/lib/api/types";
import { formatPrice, publicMediaUrl } from "@/lib/format";
import { products as mockProducts } from "@/data/home";

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

export function mapProductDetailToCard(
  product: ProductDetail,
): ProductCardModel {
  const variant = getDefaultVariant(product.variants);
  return {
    id: String(product.id),
    title: product.title,
    subtitle: getBrandTitle(product.brand) || "رزینمال",
    price: formatPrice(variant?.price),
    image: getPrimaryImage(product.images),
    description: product.short_description || product.description || undefined,
    rawPrice: variant?.price,
    variantId: variant?.id,
  };
}

export function mockProductsAsCards(): ProductCardModel[] {
  return mockProducts.map((product) => ({
    id: product.id,
    title: product.title,
    subtitle: product.subtitle,
    price: product.price,
    image: product.image,
  }));
}
