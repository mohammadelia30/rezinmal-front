import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { articles } from "@/data/home";

export function Articles() {
  return (
    <section id="articles" className="scroll-mt-20 bg-background py-12 sm:py-16 lg:py-20">
      <Container>
        <h2 className="mb-8 text-right text-2xl font-bold text-foreground sm:mb-10 sm:text-3xl">
          آخرین مقالات آموزشی
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {articles.map((article) => (
            <Link
              key={article.id}
              href="#articles"
              className="group overflow-hidden rounded-2xl bg-[#f4eee2] transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
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
