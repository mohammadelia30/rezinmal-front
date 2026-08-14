import { apiFetch, ApiError } from "@/lib/api/client";
import { API_PATHS } from "@/lib/api/config";
import { mapProductDetailToCard, mockProductsAsCards } from "@/lib/api/mappers";
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

/** List products enriched with detail (price/images). Falls back to mock if API empty/unreachable. */
export async function getStoreProducts(options?: {
  featuredOnly?: boolean;
  fallbackToMock?: boolean;
}): Promise<ProductCardModel[]> {
  const result = await getStoreCatalog(options);
  return result.products;
}

export async function getStoreCatalog(options?: {
  featuredOnly?: boolean;
  fallbackToMock?: boolean;
}): Promise<{
  products: ProductCardModel[];
  productsByCategory: Record<string, string[]>;
  fromApi: boolean;
}> {
  const useFallback = options?.fallbackToMock !== false;

  try {
    const list = await listProducts();
    const active = list.filter((item) => item.is_active !== false);
    const scoped = options?.featuredOnly
      ? active.filter((item) => item.is_featured)
      : active;
    const source = scoped.length ? scoped : active;

    if (!source.length) {
      return {
        products: useFallback ? mockProductsAsCards() : [],
        productsByCategory: {},
        fromApi: false,
      };
    }

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

    if (!cards.length && useFallback) {
      return {
        products: mockProductsAsCards(),
        productsByCategory: {},
        fromApi: false,
      };
    }

    return { products: cards, productsByCategory, fromApi: true };
  } catch (error) {
    if (error instanceof ApiError || error instanceof TypeError) {
      if (useFallback) {
        return {
          products: mockProductsAsCards(),
          productsByCategory: {},
          fromApi: false,
        };
      }
    }
    throw error;
  }
}

export async function getStoreProduct(
  id: string,
  options?: { fallbackToMock?: boolean },
): Promise<ProductCardModel | null> {
  const useFallback = options?.fallbackToMock !== false;

  // numeric API id
  if (/^\d+$/.test(id)) {
    try {
      const detail = await getProduct(id);
      return mapProductDetailToCard(detail);
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 404) {
        if (!useFallback) throw error;
      }
    }
  }

  if (useFallback) {
    return mockProductsAsCards().find((item) => item.id === id) ?? null;
  }
  return null;
}

export async function getStoreCategories(options?: {
  fallbackToMock?: boolean;
}): Promise<CategoryList[]> {
  const useFallback = options?.fallbackToMock !== false;
  try {
    const categories = await listCategories();
    const active = categories
      .filter((item) => item.is_active !== false)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    if (active.length) return active;
    return useFallback ? [] : [];
  } catch {
    return useFallback ? [] : [];
  }
}
