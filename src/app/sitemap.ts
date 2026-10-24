import type { MetadataRoute } from "next";
import { getStoreArticles, getStoreCategories, listProducts } from "@/lib/api";
import { publicMediaUrl } from "@/lib/format";
import { absoluteUrl, SITE_URL } from "@/lib/site";

/**
 * نقشهٔ سایت، همراه نشانی تصویرها.
 *
 * شکایت کارفرما این بود که عکس محصول‌ها در «تصاویر گوگل» نمی‌آید،
 * حتی وقتی دقیقاً متن alt را جست‌وجو می‌کند. متن alt درست بود؛ چیزی
 * که نبود همین فایل است: گوگل نه فهرستی از صفحه‌ها داشت و نه نشانی
 * مستقیم تصویرها. فیلد images همان <image:image> استاندارد را
 * می‌سازد که گوگل برای ایندکس تصویر می‌خواند.
 *
 * آدرس تصویرها همان فایل اصلی /media/... است، نه نسخهٔ بهینه‌شدهٔ
 * /_next/image؛ آن آدرس پارامتر عرض و کیفیت دارد و برای ایندکس
 * پایدار نیست.
 */

// هنگام `next build` بک‌اند در دسترس نیست و نقشهٔ سایت خالی پخته
// می‌شد — همان اشتباهی که یک بار صفحهٔ اصلی را خالی کرد. این صفحه
// وقتی ساخته می‌شود که گوگل آن را بخواهد؛ خودِ درخواستِ فهرست
// محصولات یک دقیقه کش می‌شود، پس بار اضافه‌ای ندارد.
export const dynamic = "force-dynamic";

const asImage = (url: string | null | undefined) => {
  const path = publicMediaUrl(url);
  return path ? absoluteUrl(path) : null;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, articles] = await Promise.all([
    listProducts().catch(() => []),
    getStoreCategories().catch(() => []),
    getStoreArticles().catch(() => []),
  ]);

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: absoluteUrl("/products"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/categories"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  const productPages: MetadataRoute.Sitemap = products
    .filter((product) => product.is_active !== false)
    .map((product) => {
      const images = (product.images ?? [])
        .map((image) => asImage(image.image))
        .filter((url): url is string => Boolean(url));

      return {
        url: absoluteUrl(`/products/${product.id}`),
        lastModified: product.updated_date
          ? new Date(product.updated_date)
          : now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
        images: images.length ? images : undefined,
      };
    });

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => {
    const image = asImage(category.image);
    return {
      url: absoluteUrl(`/categories?category=${category.id}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
      images: image ? [image] : undefined,
    };
  });

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => {
    const image = asImage(article.image);
    return {
      url: absoluteUrl(`/blog/${article.id}`),
      lastModified: article.publishedAt ? new Date(article.publishedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
      images: image ? [image] : undefined,
    };
  });

  return [...staticPages, ...productPages, ...categoryPages, ...articlePages];
}
