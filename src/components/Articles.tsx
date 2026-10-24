import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import type { StoreArticle } from "@/lib/api/catalog";

export function Articles({ articles = [] }: { articles?: StoreArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <section
      id="articles"
      className="hidden scroll-mt-20 bg-background py-12 sm:py-16 md:block lg:py-20"
    >
      <Container>
        <SectionHeading title="آخرین مقالات آموزشی" href="/blog" size="lg" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.id}`}
              className="group overflow-hidden rounded-2xl bg-[#f4eee2] transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.imageAlt}
                  unoptimized={article.image.startsWith("http")}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="px-3 py-3 text-center sm:px-4 sm:py-3.5">
                <h3 className="text-sm font-bold text-foreground">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
