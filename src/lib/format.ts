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
