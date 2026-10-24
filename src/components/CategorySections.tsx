import Link from "next/link";
import { Container } from "@/components/Container";
import { ProductCard } from "@/components/ProductCard";
import type { StoreCategory } from "@/lib/api/store-categories";

/**
 * محصولات صفحهٔ اصلی، دسته‌به‌دسته.
 *
 * قبلاً یک شبکهٔ درهم از کل فروشگاه بود؛ کارفرما محصول را در
 * «قالب‌ها» ثبت می‌کرد و در صفحهٔ اصلی هیچ نشانی از آن دسته نبود.
 * حالا هر دسته ردیف خودش را دارد و «مشاهده همه» به همان دسته می‌رود.
 */
export function CategorySections({
  categories,
}: {
  categories: StoreCategory[];
}) {
  const sections = categories.filter(
    (category) => category.products.length > 0,
  );

  if (sections.length === 0) return null;

  return (
    <div className="bg-[#f6f1e7] md:bg-background">
      {sections.map((category) => (
        <section
          key={category.id}
          className="scroll-mt-20 px-4 py-4 md:px-0 md:py-10"
        >
          <Container className="px-0 md:px-6">
            <div className="mb-3 flex items-center justify-between gap-3 md:mb-6">
              <Link
                href={`/categories?category=${category.id}`}
                className="shrink-0 text-xs font-medium text-brand transition hover:text-brand-dark md:text-sm"
              >
                مشاهده همه
                {category.productCount > category.products.length
                  ? ` (${category.productCount.toLocaleString("fa-IR")})`
                  : ""}
              </Link>
              <h2 className="text-right text-sm font-bold text-[#3d2447] md:text-2xl md:text-foreground">
                {category.title}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-2 md:gap-4 lg:grid-cols-4 lg:gap-5">
              {category.products.slice(0, 4).map((product) => (
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
      ))}
    </div>
  );
}
