import { getStoreCatalog, getStoreCategories } from "@/lib/api/catalog";
import { publicMediaUrl } from "@/lib/format";

/**
 * دسته‌بندی‌های واقعی فروشگاه برای صفحهٔ اصلی.
 *
 * بخش «دسته‌بندی‌های اصلی» صفحهٔ اصلی تا امروز سه کاشی ثابت داخل کد
 * بود و هر سه به فهرست کلی لینک می‌شدند؛ یعنی فروشنده محصول را در
 * «قالب‌ها» می‌گذاشت ولی روی سایت چیز دیگری می‌دید. حالا همان
 * دسته‌هایی نشان داده می‌شود که در پنل ساخته شده‌اند.
 */

export type StoreCategory = {
  id: string;
  title: string;
  /** تصویری که در پنل برای دسته گذاشته شده؛ خالی یعنی بدون تصویر */
  image: string | null;
  productCount: number;
};

export async function getStoreCategoryTiles(): Promise<StoreCategory[]> {
  const [categories, catalog] = await Promise.all([
    getStoreCategories(),
    getStoreCatalog(),
  ]);

  return categories.map((category) => {
    const id = String(category.id);

    return {
      id,
      title: category.title,
      // تصویر قرضی نمی‌گذاریم: عکس قالب روی دستهٔ «ابزارآلات» از
      // نداشتن عکس بدتر است. تصویر دسته در پنل گذاشته می‌شود.
      image: publicMediaUrl(category.image) ?? null,
      productCount: catalog.productsByCategory[id]?.length ?? 0,
    };
  });
}
