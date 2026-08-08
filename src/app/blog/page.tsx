import type { Metadata } from "next";
import { BlogPageContent } from "@/components/blog/BlogPageContent";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "بلاگ | رزین‌مال",
  description:
    "وبلاگ تخصصی رزین‌مال: آموزش، طراحی و علم مواد برای هنر رزین.",
};

export default function BlogPage() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#f6f1e7] md:bg-background">
      <Header />
      <main className="flex-1">
        <BlogPageContent />
      </main>
    </div>
  );
}
