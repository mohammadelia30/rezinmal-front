import type { NextConfig } from "next";

const apiInternalUrl =
  process.env.API_INTERNAL_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8080";

/**
 * سیاست امنیتی محتوا.
 *
 * چون همهٔ درخواست‌ها same-origin هستند (API از پروکسی خود Next عبور می‌کند)
 * می‌توان connect-src را به 'self' محدود کرد. 'unsafe-inline' برای استایل
 * لازم است چون Next استایل‌های inline تزریق می‌کند.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  // Next برای هیدریشن به اسکریپت inline نیاز دارد
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

const nextConfig: NextConfig = {
  output: "standalone",

  // نسخهٔ Next را در هدر پاسخ لو ندهیم
  poweredByHeader: false,

  // APIهای Django با اسلش انتهایی کار می‌کنند؛ بدون این گزینه Next مسیر
  // /api/foo/ را به /api/foo ریدایرکت می‌کند و پروکسی می‌شکند.
  skipTrailingSlashRedirect: true,

  images: {
    // تصاویر از مسیر نسبی /media سرو می‌شوند، پس میزبان بیرونی لازم نیست.
    remotePatterns: [],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // پاسخ API هرگز نباید کش یا ایندکس شود
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
    ];
  },

  /**
   * فایل‌های رسانه‌ای و استاتیک جنگو از فرانت پروکسی می‌شوند تا بک‌اند
   * هیچ پورتی بیرون از شبکهٔ داکر نداشته باشد.
   *
   * مسیر /api عمداً اینجا نیست: پروکسی آن در src/app/api/[...path]/route.ts
   * انجام می‌شود تا بتواند توکن را از کوکی httpOnly به درخواست اضافه کند.
   */
  async rewrites() {
    return [
      {
        source: "/media/:path*",
        destination: `${apiInternalUrl}/media/:path*`,
      },
      {
        source: "/static/:path*",
        destination: `${apiInternalUrl}/static/:path*`,
      },
    ];
  },
};

export default nextConfig;
