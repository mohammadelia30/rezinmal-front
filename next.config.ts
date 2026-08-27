import type { NextConfig } from "next";

const apiInternalUrl =
  process.env.API_INTERNAL_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8080";

const nextConfig: NextConfig = {
  output: "standalone",

  // نسخهٔ Next را در هدر پاسخ لو ندهیم
  poweredByHeader: false,

  // APIهای Django با اسلش انتهایی کار می‌کنند؛ بدون این گزینه Next مسیر
  // /api/foo/ را به /api/foo ریدایرکت می‌کند و پروکسی می‌شکند.
  skipTrailingSlashRedirect: true,

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8080",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/**",
      },
    ],
  },

  /**
   * درخواست‌های API و فایل‌های رسانه‌ای از فرانت به کانتینر بک‌اند Rozinweb
   * پروکسی می‌شوند. روی شبکه داکر: http://nginx (نام سرویس؛ Django هاست دارای _ را رد می‌کند)
   * بک‌اند هیچ پورتی بیرون از شبکه منتشر نمی‌کند و مرورگر فقط با فرانت حرف می‌زند.
   */
  async rewrites() {
    return [
      {
        // اسلش انتهایی در مقصد لازم است: Next مسیر را بدون اسلش فوروارد می‌کند
        // و APPEND_SLASH جنگو باعث حلقهٔ ریدایرکت ۳۰۱ می‌شود.
        source: "/api/:path*",
        destination: `${apiInternalUrl}/api/:path*/`,
      },
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
