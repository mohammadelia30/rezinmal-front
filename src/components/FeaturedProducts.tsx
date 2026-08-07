import { Container } from "@/components/Container";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/home";

type FeaturedProductsProps = {
  title?: string;
};

export function FeaturedProducts({
  title = "مجموعه محصولات ویژه",
}: FeaturedProductsProps) {
  return (
    <section id="products" className="scroll-mt-20 bg-background py-12 sm:py-16 lg:py-20">
      <Container>
        <h2 className="mb-8 text-right text-2xl font-bold text-foreground sm:mb-10 sm:text-3xl">
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
