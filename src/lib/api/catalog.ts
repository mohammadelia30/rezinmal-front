import { apiFetch } from "@/lib/api/client";
import { API_PATHS } from "@/lib/api/config";
import { mapProductDetailToCard } from "@/lib/api/mappers";
import type {
  BrandList,
  CategoryDetail,
  CategoryList,
  ProductCardModel,
  ProductDetail,
  ProductList,
} from "@/lib/api/types";

const revalidate = { next: { revalidate: 60 } } as const;

export async function listProducts(): Promise<ProductList[]> {
  return apiFetch<ProductList[]>(API_PATHS.products, revalidate);
}

export async function getProduct(id: string | number): Promise<ProductDetail> {
  return apiFetch<ProductDetail>(API_PATHS.product(id), revalidate);
}

export async function listCategories(): Promise<CategoryList[]> {
  return apiFetch<CategoryList[]>(API_PATHS.categories, revalidate);
}

export async function getCategory(
  id: string | number,
): Promise<CategoryDetail> {
  return apiFetch<CategoryDetail>(API_PATHS.category(id), revalidate);
}

export async function listBrands(): Promise<BrandList[]> {
  return apiFetch<BrandList[]>(API_PATHS.brands, revalidate);
}

/** فهرست محصولات همراه با جزئیات (قیمت و تصویر) مستقیماً از بک‌اند. */
export async function getStoreProducts(options?: {
  featuredOnly?: boolean;
}): Promise<ProductCardModel[]> {
  const result = await getStoreCatalog(options);
  return result.products;
}

export async function getStoreCatalog(options?: {
  featuredOnly?: boolean;
}): Promise<{
  products: ProductCardModel[];
  productsByCategory: Record<string, string[]>;
  fromApi: boolean;
}> {
  try {
    const list = await listProducts();
    const active = list.filter((item) => item.is_active !== false);
    const scoped = options?.featuredOnly
      ? active.filter((item) => item.is_featured)
      : active;
    const source = scoped.length ? scoped : active;

    const details = await Promise.all(
      source.map(async (item) => {
        try {
          return await getProduct(item.id);
        } catch {
          return null;
        }
      }),
    );

    const valid = details.filter((item): item is ProductDetail => Boolean(item));
    const cards = valid.map(mapProductDetailToCard);
    const productsByCategory: Record<string, string[]> = {};

    for (const detail of valid) {
      for (const category of detail.categories ?? []) {
        const key = String(category.id);
        productsByCategory[key] ??= [];
        productsByCategory[key].push(String(detail.id));
      }
    }

    return { products: cards, productsByCategory, fromApi: true };
  } catch {
    // بک‌اند در دسترس نیست: حالت خالیِ واقعی، نه دادهٔ نمونه
    return { products: [], productsByCategory: {}, fromApi: false };
  }
}

export async function getStoreProduct(
  id: string,
): Promise<ProductCardModel | null> {
  if (!/^\d+$/.test(id)) return null;

  try {
    const detail = await getProduct(id);
    return mapProductDetailToCard(detail);
  } catch {
    return null;
  }
}

export async function getStoreCategories(): Promise<CategoryList[]> {
  try {
    const categories = await listCategories();
    return categories
      .filter((item) => item.is_active !== false)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  } catch {
    return [];
  }
}
