import Image from "next/image";
import { products } from "@/data/home";

export function FeaturedProducts() {
  return (
    <section
      id="products"
      className="scroll-mt-24 bg-surface/80 py-12 sm:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-extrabold text-brand sm:mb-10 sm:text-3xl">
          مجموعه محصولات ویژه
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-brand-soft/30 transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-2 bg-card px-3 py-4 text-right sm:px-4">
                <div>
                  <h3 className="text-sm font-bold text-foreground sm:text-base">
                    {product.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted sm:text-sm">
                    {product.subtitle}
                  </p>
                </div>
                <div className="flex flex-row items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    className="rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-white transition hover:bg-brand-dark sm:px-4 sm:text-sm"
                  >
                    خرید
                  </button>
                  <span className="text-xs font-semibold text-foreground sm:text-sm">
                    {product.price}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
