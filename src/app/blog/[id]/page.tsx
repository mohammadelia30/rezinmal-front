import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Header } from "@/components/Header";
import { getStoreArticle } from "@/lib/api";

type BlogDetailProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: BlogDetailProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getStoreArticle(id);
  if (!post) return { title: "مقاله | رزین‌مال" };

  const title = post.metaTitle || `${post.title} | رزین‌مال`;
  const description = post.metaDescription || post.excerpt;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.id}` },
    openGraph: {
      title,
      description,
      type: "article",
      locale: "fa_IR",
      images: post.image ? [{ url: post.image }] : undefined,
    },
  };
}

function formatDate(value: string) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { id } = await params;
  const post = await getStoreArticle(id);
  if (!post) notFound();

  const publishedAt = formatDate(post.publishedAt);

  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#f6f1e7] md:bg-background">
      <Header />
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
              alt={post.imageAlt}
              fill
              priority
              unoptimized={post.image.startsWith("http")}
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>

          {publishedAt ? (
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-[#6b5b73]">
              <span className="rounded-md bg-[#f0e6f6] px-2 py-1 text-brand">
                مقاله
              </span>
              <span>{publishedAt}</span>
            </div>
          ) : null}

          <h1 className="mb-4 text-xl font-bold leading-9 text-[#3d2246] sm:text-2xl sm:leading-10 md:text-3xl">
            {post.title}
          </h1>

          {post.excerpt ? (
            <p className="text-sm leading-7 text-[#4a4050] sm:text-base sm:leading-8">
              {post.excerpt}
            </p>
          ) : null}

          {/* متن مقاله؛ هر خط خالی یک پاراگراف تازه است */}
          {post.content
            .split(/\n{2,}/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)
            .map((paragraph, index) => (
              <p
                key={index}
                className="mt-5 whitespace-pre-line text-sm leading-7 text-[#4a4050] sm:text-base sm:leading-8"
              >
                {paragraph}
              </p>
            ))}
        </Container>
      </main>
    </div>
  );
}
