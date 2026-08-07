import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { Container } from "@/components/Container";
import { blogPosts } from "@/data/blog";

type BlogDetailProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ id: post.id }));
}

export async function generateMetadata({
  params,
}: BlogDetailProps): Promise<Metadata> {
  const { id } = await params;
  const post = blogPosts.find((item) => item.id === id);
  if (!post) return { title: "مقاله | رزین‌مال" };
  return {
    title: `${post.title} | رزین‌مال`,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { id } = await params;
  const post = blogPosts.find((item) => item.id === id);
  if (!post) notFound();

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <BlogHeader />
      <main className="flex-1 py-8 sm:py-12">
        <Container className="max-w-3xl">
          <Link
            href="/blog"
            className="mb-6 inline-block text-sm text-[#6b5b73] transition hover:text-brand"
          >
            ← بازگشت به بلاگ
          </Link>

          <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-2xl bg-[#f7f2fa]">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-[#6b5b73]">
            <span className="rounded-md bg-[#f0e6f6] px-2 py-1 text-brand">
              {post.category}
            </span>
            <span>{post.author}</span>
            {post.price ? <span>{post.price}</span> : null}
          </div>

          <h1 className="mb-4 text-xl font-bold leading-9 text-[#3d2246] sm:text-2xl sm:leading-10 md:text-3xl">
            {post.title}
          </h1>
          <p className="text-sm leading-7 text-[#4a4050] sm:text-base sm:leading-8">
            {post.excerpt}
          </p>
          <p className="mt-6 text-sm leading-7 text-[#4a4050] sm:text-base sm:leading-8">
            این مقاله بخشی از مجموعه آموزش‌های تخصصی رزین‌مال است. به‌زودی متن
            کامل و گام‌به‌گام این آموزش در همین صفحه منتشر می‌شود.
          </p>
        </Container>
      </main>
    </div>
  );
}
