import type { Metadata } from "next";
import { Articles } from "@/components/Articles";
import { Categories } from "@/components/Categories";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MobileCategories } from "@/components/MobileCategories";
import {
  getPublicSiteInfo,
  getStoreArticles,
  getStoreProducts,
} from "@/lib/api";

/**
 * عنوان و توضیح صفحهٔ اصلی از تنظیمات پنل می‌آید تا مدیر بدون تغییر کد
 * بتواند متنِ دیده‌شده در گوگل را عوض کند.
 */
export async function generateMetadata(): Promise<Metadata> {
  const info = await getPublicSiteInfo();
  const title = info?.shopName
    ? `${info.shopName} | فروشگاه و آموزش هنر رزین`
    : "رزین‌مال | فروشگاه و آموزش هنر رزین";
  const description =
    info?.metaDescription ||
    "زیبایی را خودتان بسازید با کیت‌های آموزش، مواد اولیه و ابزارآلات تخصصی رزین‌مال.";

  return {
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: { title, description, type: "website", locale: "fa_IR" },
  };
}

export default async function Home() {
  const [products, articles] = await Promise.all([
    getStoreProducts({ featuredOnly: true }),
    getStoreArticles(),
  ]);

  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#f6f1e7] md:bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <MobileCategories />
        <Categories products={products} />
        <div id="gallery">
          <FeaturedProducts mobileMode="home" items={products} />
        </div>
        <Articles articles={articles} />
      </main>
      <Footer />
    </div>
  );
}
