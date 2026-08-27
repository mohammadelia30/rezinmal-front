const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => persianDigits[Number(d)] ?? d);
}

/** Format API price (integer, typically Rials) for display */
export function formatPrice(price?: number | null): string {
  if (price === undefined || price === null || Number.isNaN(price)) {
    return "—";
  }
  const formatted = new Intl.NumberFormat("fa-IR").format(price);
  return `${formatted} تومان`;
}

export function absoluteMediaUrl(
  url: string | null | undefined,
  baseUrl: string,
): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${baseUrl.replace(/\/$/, "")}${url}`;
  return `${baseUrl.replace(/\/$/, "")}/${url}`;
}

/** مسیرهایی که next.config.ts به بک‌اند پروکسی می‌کند */
const PROXIED_MEDIA_PREFIXES = ["/media/", "/static/"];

/**
 * آدرس فایل رسانه‌ای که در مرورگر قابل بارگذاری باشد.
 * بک‌اند داخل شبکهٔ داکر است، پس آدرس مطلقِ داخلی (مثل http://rozinmall_web:8000/media/x.jpg)
 * برای مرورگر بی‌معناست و به مسیر نسبی تبدیل می‌شود تا از rewrite فرانت عبور کند.
 */
export function publicMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  if (url.startsWith("http://") || url.startsWith("https://")) {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return null;
    }
    const path = `${parsed.pathname}${parsed.search}`;
    return PROXIED_MEDIA_PREFIXES.some((prefix) => path.startsWith(prefix))
      ? path
      : url;
  }

  return url.startsWith("/") ? url : `/${url}`;
}
