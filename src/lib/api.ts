/**
 * پایهٔ آدرس API.
 * در مرورگر: مسیر نسبی /api (از طریق rewrite به بک‌اند)
 * در صورت تنظیم NEXT_PUBLIC_API_URL: مستقیم به همان آدرس
 */
export function getApiBaseUrl() {
  if (typeof window === "undefined") {
    return (
      process.env.API_INTERNAL_URL?.replace(/\/$/, "") ||
      "http://rozinmall_web:8000"
    );
  }

  const publicUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  return publicUrl || "";
}

export function apiUrl(path: string) {
  const base = getApiBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!base) return normalized.startsWith("/api") ? normalized : `/api${normalized}`;
  if (normalized.startsWith("/api")) return `${base}${normalized}`;
  return `${base}/api${normalized}`;
}
