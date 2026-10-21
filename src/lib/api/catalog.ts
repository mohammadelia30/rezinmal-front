import { apiFetch } from "@/lib/api/client";
import { API_PATHS } from "@/lib/api/config";
import { mapProductDetailToCard } from "@/lib/api/mappers";
import { publicMediaUrl } from "@/lib/format";
import type {
  BrandList,
  CategoryDetail,
  CategoryList,
  ProductCardModel,
  ProductDetail,
} from "@/lib/api/types";

const revalidate = { next: { revalidate: 60 } } as const;

/**
 * فهرست محصولات، با همان جزئیاتی که صفحهٔ محصول دارد.
 *
 * بک‌اند تصویر، قیمت و نسخه‌های هر محصول را داخل همین فهرست می‌دهد؛
 * قبلاً برای هر محصول یک درخواست جدا فرستاده می‌شد که روی صد محصول
 * یعنی صد رفت‌وبرگشت و چند ثانیه انتظار.
 */
export async function listProducts(): Promise<ProductDetail[]> {
  return apiFetch<ProductDetail[]>(API_PATHS.products, revalidate);
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
    const valid = scoped.length ? scoped : active;

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
    // ترتیب پنل، و برای دسته‌هایی که ترتیبشان یکی است، قدیمی‌تر جلوتر؛
    // بدون این، ترتیب روی صفحهٔ اصلی هر بار می‌توانست عوض شود
    return categories
      .filter((item) => item.is_active !== false)
      .sort(
        (a, b) =>
          (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id - b.id,
      );
  } catch {
    return [];
  }
}


export type PublicSiteInfo = {
  shopName: string;
  metaDescription: string;
};

/**
 * اطلاعات عمومی فروشگاه برای سئوی صفحهٔ اصلی.
 *
 * اندپوینت تنظیمات فقط برای مدیر است، پس سایت از نسخهٔ عمومی می‌خواند.
 */
export async function getPublicSiteInfo(): Promise<PublicSiteInfo | null> {
  try {
    const data = await apiFetch<{
      shop_name?: string;
      meta_description?: string;
    }>(API_PATHS.publicSiteSettings, revalidate);

    return {
      shopName: data.shop_name ?? "",
      metaDescription: data.meta_description ?? "",
    };
  } catch {
    return null;
  }
}


export type StoreArticle = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  imageAlt: string;
  publishedAt: string;
  metaTitle?: string;
  metaDescription?: string;
};

type ApiArticle = {
  id: number;
  title: string;
  cover?: string | null;
  cover_alt?: string;
  summary?: string;
  content?: string;
  published_at?: string | null;
  meta_title?: string;
  meta_description?: string;
};

const ARTICLE_PLACEHOLDER = "/images/article-1.jpg";

function toStoreArticle(item: ApiArticle): StoreArticle {
  return {
    id: String(item.id),
    title: item.title,
    excerpt: item.summary ?? "",
    content: item.content ?? "",
    image: publicMediaUrl(item.cover) ?? ARTICLE_PLACEHOLDER,
    imageAlt: item.cover_alt || item.title,
    publishedAt: item.published_at ?? "",
    metaTitle: item.meta_title || undefined,
    metaDescription: item.meta_description || undefined,
  };
}

/** مقالات منتشرشده؛ پیش‌نویس‌ها از بک‌اند برنمی‌گردند. */
export async function getStoreArticles(): Promise<StoreArticle[]> {
  try {
    const items = await apiFetch<ApiArticle[]>(API_PATHS.articles, revalidate);
    return Array.isArray(items) ? items.map(toStoreArticle) : [];
  } catch {
    return [];
  }
}

export async function getStoreArticle(
  id: string,
): Promise<StoreArticle | null> {
  if (!/^\d+$/.test(id)) return null;

  try {
    return toStoreArticle(
      await apiFetch<ApiArticle>(API_PATHS.article(id), revalidate),
    );
  } catch {
    return null;
  }
}

