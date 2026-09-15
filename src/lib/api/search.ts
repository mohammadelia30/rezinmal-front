import { API_PATHS, getApiBaseUrl } from "@/lib/api/config";
import { getStoreProduct, getStoreProducts } from "@/lib/api/catalog";
import type { ProductCardModel } from "@/lib/api/types";

/** ارقام فارسی را به لاتین تبدیل می‌کند تا جست‌وجوی عددی هم کار کند. */
function normalizeDigits(value: string): string {
  return value.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
}

type SearchHit = {
  product_id?: number;
  /** نسخه‌های قدیمی‌تر سند */
  id?: number;
};

/** حداکثر نتیجه‌ای که صفحهٔ جست‌وجو نشان می‌دهد */
const RESULT_LIMIT = 50;

/**
 * جست‌وجوی محصولات.
 *
 * اول از سرویس جست‌وجوی بک‌اند (Elasticsearch) استفاده می‌شود و فقط
 * محصولات پیداشده، به همان ترتیب مرتبط بودن، گرفته می‌شوند. اگر سرویس
 * در دسترس نبود (۵۰۳) یا نتیجه‌ای نداد، روی خود کاتالوگ فیلتر می‌شود تا
 * جست‌وجوی سایت از کار نیفتد.
 *
 * قبلاً شناسه از فیلد id خوانده می‌شد، در حالی که سند ES آن را
 * product_id می‌نامد؛ پس نتیجهٔ ES همیشه دور ریخته می‌شد و هر جست‌وجو
 * کل کاتالوگ را با جزئیات تک‌تک محصولات می‌گرفت — که با بزرگ شدن
 * کاتالوگ روزبه‌روز کندتر می‌شد.
 */
export async function searchProducts(
  query: string,
): Promise<{ products: ProductCardModel[]; usedFallback: boolean }> {
  const needle = normalizeDigits(query).trim().toLowerCase();
  if (!needle) return { products: [], usedFallback: false };

  try {
    const response = await fetch(
      `${getApiBaseUrl()}${API_PATHS.searchProducts}?q=${encodeURIComponent(query)}&page_size=${RESULT_LIMIT}`,
      { headers: { Accept: "application/json" }, cache: "no-store" },
    );

    if (response.ok) {
      const data = (await response.json()) as { results?: SearchHit[] };
      const ids = Array.from(
        new Set(
          (data.results ?? [])
            .map((hit) => hit.product_id ?? hit.id)
            .filter((id): id is number => typeof id === "number")
            .map(String),
        ),
      );

      if (ids.length > 0) {
        const products = (await Promise.all(ids.map(getStoreProduct))).filter(
          (item): item is ProductCardModel => Boolean(item),
        );
        // سندی که محصولش دیگر وجود ندارد نادیده گرفته می‌شود
        if (products.length > 0) return { products, usedFallback: false };
      }
    }
  } catch {
    // سرویس جست‌وجو در دسترس نیست؛ پایین‌تر فیلتر می‌کنیم.
  }

  const catalog = await getStoreProducts();
  const products = catalog.filter((item) =>
    [item.title, item.subtitle, item.description]
      .filter(Boolean)
      .some((field) =>
        normalizeDigits(String(field)).toLowerCase().includes(needle),
      ),
  );

  return { products, usedFallback: true };
}
