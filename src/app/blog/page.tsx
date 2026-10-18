import type { Metadata } from "next";
import { BlogPageContent } from "@/components/blog/BlogPageContent";
import { Header } from "@/components/Header";
import { getStoreArticles } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "بلاگ | رزین‌مال",
  description:
    "وبلاگ تخصصی رزین‌مال: آموزش، طراحی و علم مواد برای هنر رزین.",
};

export default async function BlogPage() {
  const articles = await getStoreArticles();

  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#f6f1e7] md:bg-background">
      <Header />
      <main className="flex-1">
        <BlogPageContent articles={articles} />
      </main>
    </div>
  );
}
