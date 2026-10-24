import type { Metadata } from "next";
import { Articles } from "@/components/Articles";
import { Categories } from "@/components/Categories";
import { CategorySections } from "@/components/CategorySections";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MobileCategories } from "@/components/MobileCategories";
import { getPublicSiteInfo, getStoreArticles } from "@/lib/api";
import { getHomeCategories } from "@/lib/api/store-categories";

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
  // یک درخواست: دسته‌ها همراه محصول‌های خودشان. بک‌اند محصول موجود را
  // جلو می‌اندازد، پس چیزی که در صفحهٔ اصلی می‌آید قابل خرید است.
  const [categories, articles] = await Promise.all([
    getHomeCategories(),
    getStoreArticles(),
  ]);

  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#f6f1e7] md:bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <MobileCategories categories={categories} />
        <Categories categories={categories} />
        <div id="gallery">
          <CategorySections categories={categories} />
        </div>
        <Articles articles={articles} />
      </main>
      <Footer />
    </div>
  );
}
