import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/home";

export function Categories() {
  return (
    <section id="shop" className="scroll-mt-24 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-extrabold text-brand sm:mb-10 sm:text-3xl">
          دسته‌بندی‌های اصلی
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {categories.map((category) => (
            <article
              key={category.id}
              className="group overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-brand-soft/35 transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-square overflow-hidden bg-brand-mist/40">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-3 px-3 py-4 text-center sm:px-4">
                <h3 className="text-sm font-bold text-foreground sm:text-base">
                  {category.title}
                </h3>
                <Link
                  href="#products"
                  className="inline-flex rounded-lg bg-brand px-5 py-1.5 text-xs font-bold text-white transition hover:bg-brand-dark sm:text-sm"
                >
                  خرید
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
