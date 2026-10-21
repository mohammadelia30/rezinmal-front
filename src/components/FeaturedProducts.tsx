import { Container } from "@/components/Container";
import { ProductCard } from "@/components/ProductCard";
import type { ProductCardModel } from "@/lib/api/types";

type FeaturedProductsProps = {
  title?: string;
  items?: ProductCardModel[];
};

function toCards(items?: ProductCardModel[]): ProductCardModel[] {
  return items ?? [];
}

/**
 * شبکهٔ محصولات.
 *
 * نسخهٔ موبایل صفحهٔ اصلی قبلاً فقط دو محصول را زیر عنوان «مجموعه
 * محصولات آموزشی» نشان می‌داد؛ فروشگاه قالب می‌فروشد، نه دورهٔ
 * آموزشی، و مشتری بقیهٔ محصول‌ها را اصلاً نمی‌دید.
 */
export function FeaturedProducts({
  title = "مجموعه محصولات ویژه",
  items,
}: FeaturedProductsProps) {
  const products = toCards(items);
  const mobileItems = products;

  return (
    <section
      id="products"
      className="scroll-mt-20 bg-[#f6f1e7] py-4 md:bg-background md:py-12 lg:py-20"
    >
      <div className="px-4 md:hidden">
        <h2 className="mb-3 text-right text-sm font-bold text-[#3d2447]">
          {title}
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {mobileItems.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              subtitle={product.subtitle}
              price={product.price}
              oldPrice={product.oldPrice}
              discountPercent={product.discountPercent}
              image={product.image}
              imageAlt={product.imageAlt}
              soldOut={product.soldOut}
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
              oldPrice={product.oldPrice}
              discountPercent={product.discountPercent}
              image={product.image}
              imageAlt={product.imageAlt}
              soldOut={product.soldOut}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
