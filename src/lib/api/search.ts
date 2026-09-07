import { API_PATHS, getApiBaseUrl } from "@/lib/api/config";
import { getStoreProducts } from "@/lib/api/catalog";
import type { ProductCardModel } from "@/lib/api/types";

/** ارقام فارسی را به لاتین تبدیل می‌کند تا جست‌وجوی عددی هم کار کند. */
function normalizeDigits(value: string): string {
  return value.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
}

type SearchHit = {
  id?: number;
  title?: string;
};

/**
 * جست‌وجوی محصولات.
 *
 * اول از سرویس جست‌وجوی بک‌اند (Elasticsearch) استفاده می‌شود و اگر در
 * دسترس نبود — که با ۵۰۳ اعلام می‌کند — روی خود کاتالوگ فیلتر می‌شود.
 * این‌طور اگر ES بالا نباشد، جست‌وجوی سایت از کار نمی‌افتد.
 */
export async function searchProducts(
  query: string,
): Promise<{ products: ProductCardModel[]; usedFallback: boolean }> {
  const needle = normalizeDigits(query).trim().toLowerCase();
  if (!needle) return { products: [], usedFallback: false };

  const catalog = await getStoreProducts();

  try {
    const response = await fetch(
      `${getApiBaseUrl()}${API_PATHS.searchProducts}?q=${encodeURIComponent(query)}`,
      { headers: { Accept: "application/json" }, cache: "no-store" },
    );

    if (response.ok) {
      const data = (await response.json()) as { results?: SearchHit[] };
      const ids = new Set(
        (data.results ?? [])
          .map((hit) => (hit.id === undefined ? null : String(hit.id)))
          .filter((id): id is string => Boolean(id)),
      );

      if (ids.size > 0) {
        return {
          products: catalog.filter((item) => ids.has(item.id)),
          usedFallback: false,
        };
      }
    }
  } catch {
    // سرویس جست‌وجو در دسترس نیست؛ پایین‌تر فیلتر می‌کنیم.
  }

  const products = catalog.filter((item) =>
    [item.title, item.subtitle, item.description]
      .filter(Boolean)
      .some((field) =>
        normalizeDigits(String(field)).toLowerCase().includes(needle),
      ),
  );

  return { products, usedFallback: true };
}
