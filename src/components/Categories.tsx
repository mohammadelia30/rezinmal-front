import Image from "next/image";
import { Container } from "@/components/Container";
import { categories } from "@/data/home";

export function Categories() {
  return (
    <section id="shop" className="scroll-mt-20 bg-background py-12 sm:py-16 lg:py-20">
      <Container>
        <h2 className="mb-8 text-right text-2xl font-bold text-foreground sm:mb-10 sm:text-3xl">
          دسته‌بندی‌های اصلی
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-[1fr_1.6fr_1fr] lg:gap-5">
          {categories.map((category) => {
            if (category.variant === "product") {
              return (
                <article
                  key={category.id}
                  className="col-span-1 flex flex-col overflow-hidden rounded-2xl bg-card"
                >
                  <div className="relative aspect-[6/5] w-full overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      sizes="280px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1 px-3 pb-3 pt-2.5">
                    <h3 className="text-right text-sm font-bold text-foreground">
                      {category.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>{category.subtitle}</span>
                      <span>{category.price}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-4 flex-1 rounded bg-bar" />
                      <button
                        type="button"
                        className="rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-white"
                      >
                        خرید
                      </button>
                    </div>
                  </div>
                </article>
              );
            }

            if (category.variant === "wide") {
              return (
                <article
                  key={category.id}
                  className="col-span-2 flex flex-col overflow-hidden rounded-2xl bg-card lg:col-span-1"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[2/1] lg:aspect-[16/9]">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="px-3 py-3.5 text-center">
                    <h3 className="text-sm font-bold text-foreground sm:text-base">
                      {category.title}
                    </h3>
                  </div>
                </article>
              );
            }

            return (
              <article
                key={category.id}
                className="col-span-1 flex flex-col overflow-hidden rounded-2xl border border-[#f0e8d5] bg-white"
              >
                <div className="relative aspect-[6/5] w-full overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="280px"
                    className="object-cover"
                  />
                </div>
                <div className="px-3 py-3.5 text-center">
                  <h3 className="text-sm font-bold text-foreground">
                    {category.title}
                  </h3>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
