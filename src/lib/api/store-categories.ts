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
  /** تصویری که در پنل برای دسته گذاشته شده؛ خالی یعنی تصویر پیش‌فرض */
  image: string | null;
  productCount: number;
};

/** وقتی دسته تصویر ندارد، از این‌ها به ترتیب استفاده می‌شود */
const FALLBACK_IMAGES = [
  "/images/cat-molds.jpg",
  "/images/cat-resin.jpg",
  "/images/cat-tools.jpg",
];

export async function getStoreCategoryTiles(): Promise<StoreCategory[]> {
  const [categories, catalog] = await Promise.all([
    getStoreCategories(),
    getStoreCatalog(),
  ]);

  return categories.map((category, index) => {
    const id = String(category.id);

    return {
      id,
      title: category.title,
      image:
        publicMediaUrl(category.image) ??
        FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
      productCount: catalog.productsByCategory[id]?.length ?? 0,
    };
  });
}
