import type { Metadata } from "next";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { BlogPageContent } from "@/components/blog/BlogPageContent";

export const metadata: Metadata = {
  title: "بلاگ | رزین‌مال",
  description:
    "وبلاگ تخصصی رزین‌مال: آموزش، طراحی و علم مواد برای هنر رزین.",
};

export default function BlogPage() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <BlogHeader />
      <main className="flex-1">
        <BlogPageContent />
      </main>
    </div>
  );
}
