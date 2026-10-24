import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import type { StoreCategory } from "@/lib/api/store-categories";

/**
 * بخش «دسته‌بندی‌های اصلی» صفحهٔ اصلی.
 *
 * قبلاً سه کاشی ثابت داخل کد بود و هر سه، صرف‌نظر از اینکه روی کدام
 * کلیک می‌شد، به فهرست کلی محصولات می‌رفت؛ فروشنده محصول را در
 * «قالب‌ها» می‌گذاشت ولی روی سایت دستهٔ دیگری می‌دید. حالا همان
 * دسته‌های پنل نشان داده می‌شود و هر کدام به محصول‌های خودش می‌رود.
 */
export function Categories({
  categories = [],
}: {
  categories?: StoreCategory[];
}) {
  if (categories.length === 0) return null;

  const count = (category: StoreCategory) =>
    category.productCount > 0
      ? `${category.productCount.toLocaleString("fa-IR")} محصول`
      : "به‌زودی";

  return (
    <>
      {/* موبایل */}
      <section className="bg-[#f6f1e7] px-4 py-2 md:hidden">
        <div className="rounded-2xl bg-[#f0e9f4] p-3 ring-1 ring-[#e3d7ec]">
          <SectionHeading
            title="دسته‌بندی‌های اصلی"
            href="/categories"
            size="lg"
          />
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories?category=${category.id}`}
                className="flex flex-col overflow-hidden rounded-lg bg-white shadow-[0px_1px_4px_rgba(0,0,0,0.08)]"
              >
                <div className="relative flex aspect-[111/88] w-full items-center justify-center overflow-hidden bg-[#faf6ee]">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      unoptimized={category.image.startsWith("http")}
                      sizes="50vw"
                      className="object-cover"
                    />
                  ) : (
                    // دسته‌ای که هنوز در پنل تصویر نگرفته: به‌جای یک
                    // مستطیل خالی، حرف اول دسته در یک دایره
                    <span className="flex flex-col items-center justify-center gap-1 px-2 text-center">
                      <span className="flex size-8 items-center justify-center rounded-full bg-brand-mist text-sm font-bold text-brand">
                        {category.title.trim().charAt(0)}
                      </span>
                      <span className="line-clamp-1 text-[10px] font-medium text-[#7a6a80]">
                        {category.title}
                      </span>
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col px-1.5 pb-2 pt-1.5">
                  <h3 className="line-clamp-1 text-right text-[11px] font-bold text-[#3d2447]">
                    {category.title}
                  </h3>
                  <span className="mt-0.5 text-right text-[10px] text-[#7a6a80]">
                    {count(category)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* دسکتاپ */}
      <section
        id="shop"
        className="hidden scroll-mt-20 bg-background py-12 sm:py-16 md:block lg:py-20"
      >
        <Container>
          <SectionHeading
            title="دسته‌بندی‌های اصلی"
            href="/categories"
            size="lg"
          />

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories?category=${category.id}`}
                className="flex flex-col overflow-hidden rounded-2xl bg-card transition hover:shadow-[0_6px_24px_rgba(78,42,84,0.12)]"
              >
                <div className="relative flex aspect-[6/5] w-full items-center justify-center overflow-hidden bg-[#faf6ee]">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      unoptimized={category.image.startsWith("http")}
                      sizes="(max-width: 1024px) 50vw, 360px"
                      className="object-cover transition duration-500 hover:scale-105"
                    />
                  ) : (
                    <span className="flex flex-col items-center justify-center gap-2 px-3 text-center">
                      <span className="flex size-14 items-center justify-center rounded-full bg-brand-mist text-xl font-bold text-brand">
                        {category.title.trim().charAt(0)}
                      </span>
                      <span className="text-sm font-medium text-muted">
                        {category.title}
                      </span>
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 px-4 py-3.5">
                  <span className="text-xs text-muted">{count(category)}</span>
                  <h3 className="text-right text-sm font-bold text-foreground sm:text-base">
                    {category.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
