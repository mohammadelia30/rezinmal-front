import Image from "next/image";
import Link from "next/link";
import { articles } from "@/data/home";

export function Articles() {
  return (
    <section id="articles" className="scroll-mt-24 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-extrabold text-brand sm:mb-10 sm:text-3xl">
          آخرین مقالات آموزشی
        </h2>

        <div className="rounded-[2rem] bg-brand-mist/70 p-4 sm:p-6 lg:p-8">
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href="#articles"
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-brand-soft/25 transition duration-300 hover:-translate-y-1 hover:shadow-md"
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
                <div className="bg-card px-4 py-4 text-center">
                  <h3 className="text-sm font-bold leading-7 text-foreground sm:text-base">
                    {article.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
