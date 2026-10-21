import Image from "next/image";
import Link from "next/link";
import type { StoreCategory } from "@/lib/api/store-categories";

/**
 * میان‌بر دسته‌بندی‌ها در بالای صفحهٔ اصلی موبایل.
 *
 * قبلاً چند کاشی ثابت داخل کد بود («ساعت»، «زیورآلات» و ...) که هیچ
 * ربطی به دسته‌های واقعی فروشگاه نداشت و مشتری را به جای دیگری
 * می‌برد.
 */
export function MobileCategories({
  categories = [],
}: {
  categories?: StoreCategory[];
}) {
  if (categories.length === 0) return null;

  return (
    <section className="bg-[#f6f1e7] px-4 pb-5 md:hidden" id="shop-mobile">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories?category=${category.id}`}
            className="flex w-[88px] shrink-0 flex-col items-center gap-1.5 rounded-[10px] bg-white px-2 py-2.5 shadow-[0px_1px_2px_rgba(0,0,0,0.07)]"
          >
            <span className="relative flex size-12 items-center justify-center overflow-hidden rounded-full bg-brand-mist">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  unoptimized={category.image.startsWith("http")}
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <span className="text-base font-bold text-brand">
                  {category.title.trim().charAt(0)}
                </span>
              )}
            </span>
            <span className="line-clamp-2 text-center text-[11px] font-bold leading-4 text-[#33203c]">
              {category.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
