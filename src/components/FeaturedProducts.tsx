import { Container } from "@/components/Container";
import { ProductCard } from "@/components/ProductCard";
import type { ProductCardModel } from "@/lib/api/types";
import { products as mockProducts } from "@/data/home";

type FeaturedProductsProps = {
  title?: string;
  mobileTitle?: string;
  /** home = Figma 25:5 educational pair; all = full 2-col grid */
  mobileMode?: "home" | "all";
  items?: ProductCardModel[];
};

function toCards(
  items?: ProductCardModel[],
): ProductCardModel[] {
  if (items?.length) return items;
  return mockProducts.map((product) => ({
    id: product.id,
    title: product.title,
    subtitle: product.subtitle,
    price: product.price,
    image: product.image,
  }));
}

export function FeaturedProducts({
  title = "مجموعه محصولات ویژه",
  mobileTitle = "مجموعه محصولات آموزشی",
  mobileMode = "all",
  items,
}: FeaturedProductsProps) {
  const products = toCards(items);
  const mobileItems =
    mobileMode === "home"
      ? products.slice(2, 4).length
        ? products.slice(2, 4)
        : products.slice(0, 2)
      : products;

  return (
    <section
      id="products"
      className="scroll-mt-20 bg-[#f6f1e7] py-4 md:bg-background md:py-12 lg:py-20"
    >
      <div className="px-4 md:hidden">
        <h2 className="mb-3 text-right text-sm font-bold text-[#3d2447]">
          {mobileMode === "home" ? mobileTitle : title}
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {mobileItems.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              subtitle={product.subtitle}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>
      </div>

      <Container className="hidden md:block">
        <h2 className="mb-8 text-right text-xl font-bold text-foreground sm:mb-10 sm:text-2xl md:text-3xl">
          {title}
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              subtitle={product.subtitle}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
