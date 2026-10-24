import { Container } from "@/components/Container";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import type { StoreCategory } from "@/lib/api/store-categories";

/**
 * محصولات صفحهٔ اصلی، دسته‌به‌دسته.
 *
 * قبلاً یک شبکهٔ درهم از کل فروشگاه بود؛ کارفرما محصول را در
 * «قالب‌ها» ثبت می‌کرد و در صفحهٔ اصلی هیچ نشانی از آن دسته نبود.
 * حالا هر دسته ردیف خودش را دارد و «مشاهده همه» به همان دسته می‌رود.
 *
 * هر دسته داخل یک قاب جداست: روی پس‌زمینهٔ کرمی صفحه، ردیف‌ها بدون
 * قاب به هم می‌چسبیدند و معلوم نبود کدام محصول مال کدام عنوان است.
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
          className="scroll-mt-20 px-4 py-2 md:px-0 md:py-5"
        >
          <Container className="px-0 md:px-6">
            <div className="rounded-2xl bg-[#f0e9f4] p-3 ring-1 ring-[#e3d7ec] md:rounded-3xl md:bg-[#f6f2f8] md:p-6">
              <SectionHeading
                title={category.title}
                href={`/categories?category=${category.id}`}
                count={
                  category.productCount > category.products.length
                    ? category.productCount
                    : undefined
                }
              />

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
            </div>
          </Container>
        </section>
      ))}
    </div>
  );
}
