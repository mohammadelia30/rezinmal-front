import Image from "next/image";
import { Container } from "@/components/Container";
import { products } from "@/data/home";

export function FeaturedProducts() {
  return (
    <section id="products" className="scroll-mt-20 bg-background py-12 sm:py-16 lg:py-20">
      <Container>
        <h2 className="mb-8 text-right text-2xl font-bold text-foreground sm:mb-10 sm:text-3xl">
          مجموعه محصولات ویژه
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {products.map((product) => (
            <article
              key={product.id}
              className="flex flex-col overflow-hidden rounded-2xl bg-card"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1 px-3 pb-3 pt-2.5">
                <h3 className="text-right text-sm font-bold text-foreground">
                  {product.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>{product.subtitle}</span>
                  <span>{product.price}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-4 flex-1 rounded bg-bar" />
                  <button
                    type="button"
                    className="rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-white transition hover:bg-brand-dark"
                  >
                    خرید
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
