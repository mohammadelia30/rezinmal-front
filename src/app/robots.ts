import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * robots.txt سایت.
 *
 * تا امروز این آدرس ۴۰۴ می‌داد، پس گوگل هیچ نشانی از نقشهٔ سایت
 * نداشت. مسیرهای شخصی (سبد، پرداخت، پنل) بسته‌اند، ولی /media و
 * /_next/image عمداً باز مانده‌اند؛ تصویری که خزیده نشود در «تصاویر
 * گوگل» هم ظاهر نمی‌شود.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api/",
          "/auth",
          "/cart",
          "/checkout",
          "/dashboard",
          "/login",
          "/payment",
          "/register",
          "/search",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
