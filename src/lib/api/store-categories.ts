import { apiFetch } from "@/lib/api/client";
import { API_PATHS } from "@/lib/api/config";
import { mapProductDetailToCard } from "@/lib/api/mappers";
import { publicMediaUrl } from "@/lib/format";
import type { ProductCardModel, ProductDetail } from "@/lib/api/types";

/**
 * دسته‌بندی‌های فروشگاه، هرکدام با چند محصول خودش — برای صفحهٔ اصلی.
 *
 * بخش «دسته‌بندی‌های اصلی» تا چند روز پیش سه کاشی ثابت داخل کد بود و
 * هر سه به یک فهرست لینک می‌شدند؛ یعنی فروشنده محصول را در «قالب‌ها»
 * می‌گذاشت ولی روی سایت دستهٔ دیگری می‌دید. حالا همه‌چیز از همان
 * دسته‌هایی می‌آید که در پنل ساخته شده‌اند، با یک درخواست.
 */

export type StoreCategory = {
  id: string;
  title: string;
  /** تصویری که در پنل برای دسته گذاشته شده؛ خالی یعنی بدون تصویر */
  image: string | null;
  productCount: number;
  /** چند محصول از همین دسته، برای نمایش در صفحهٔ اصلی */
  products: ProductCardModel[];
};

type ApiHomeCategory = {
  id: number;
  title: string;
  slug?: string;
  image?: string | null;
  product_count?: number;
  products?: ProductDetail[];
};

export async function getHomeCategories(): Promise<StoreCategory[]> {
  try {
    const categories = await apiFetch<ApiHomeCategory[]>(
      API_PATHS.homeCategories,
      { next: { revalidate: 60 } },
    );

    if (!Array.isArray(categories)) return [];

    return categories.map((category) => ({
      id: String(category.id),
      title: category.title,
      // تصویر قرضی نمی‌گذاریم: عکس قالب روی دستهٔ «ابزارآلات» از
      // نداشتن عکس بدتر است. تصویر دسته در پنل گذاشته می‌شود.
      image: publicMediaUrl(category.image) ?? null,
      productCount: category.product_count ?? category.products?.length ?? 0,
      products: (category.products ?? []).map(mapProductDetailToCard),
    }));
  } catch {
    // بک‌اند در دسترس نیست: صفحهٔ اصلی بدون این بخش بالا می‌آید
    return [];
  }
}
