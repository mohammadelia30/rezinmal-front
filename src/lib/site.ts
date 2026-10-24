/**
 * آدرس عمومی سایت.
 *
 * بدون این، Next آدرس پایه را `http://localhost:3000` فرض می‌کرد و
 * هر تگ og:image روی سایت به localhost اشاره می‌کرد؛ یعنی گوگل و
 * تلگرام تصویری را که دنبالش می‌رفتند اصلاً پیدا نمی‌کردند.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://resinmal.ir"
).replace(/\/$/, "");

/** مسیر نسبی را به آدرس کامل تبدیل می‌کند؛ آدرس کامل دست‌نخورده می‌ماند */
export function absoluteUrl(path: string): string {
  if (!path) return SITE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return new URL(path, `${SITE_URL}/`).toString();
}
