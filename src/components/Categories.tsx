import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { categories, products } from "@/data/home";

export function Categories() {
  const mobileProducts = products.slice(0, 2);

  return (
    <>
      {/* Mobile — Figma 25:5 product grid */}
      <section className="bg-[#f6f1e7] px-4 py-4 md:hidden">
        <h2 className="mb-3 text-right text-sm font-bold text-[#3d2447]">
          دسته‌بندی‌های اصلی
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {mobileProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="flex flex-col overflow-hidden rounded-lg bg-white shadow-[0px_1px_4px_rgba(0,0,0,0.08)]"
            >
              <div className="relative aspect-[111/88] w-full overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col px-1.5 pb-2 pt-1.5">
                <h3 className="line-clamp-1 text-right text-[11px] font-bold text-[#3d2447]">
                  {product.title}
                </h3>
                <div className="mt-1 flex items-center justify-between text-[10px] text-[#7a6a80]">
                  <span>{product.price}</span>
                  <span>{product.subtitle}</span>
                </div>
                <span className="mt-1.5 block rounded bg-[#e8dcc4] py-1 text-center text-[10px] font-bold text-[#4a2a55]">
                  خرید
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Desktop */}
      <section
        id="shop"
        className="hidden scroll-mt-20 bg-background py-12 sm:py-16 md:block lg:py-20"
      >
        <Container>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-2 sm:mb-10">
            <Link
              href="/categories"
              className="text-sm font-medium text-brand transition hover:text-brand-dark"
            >
              مشاهده همه
            </Link>
            <h2 className="text-right text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
              دسته‌بندی‌های اصلی
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-[1fr_1.6fr_1fr] lg:gap-5">
            {categories.map((category) => {
              if (category.variant === "product") {
                return (
                  <Link
                    key={category.id}
                    href="/categories"
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
                        <span className="rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-white">
                          خرید
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              }

              if (category.variant === "wide") {
                return (
                  <Link
                    key={category.id}
                    href="/categories"
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
                  </Link>
                );
              }

              return (
                <Link
                  key={category.id}
                  href="/categories"
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
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
