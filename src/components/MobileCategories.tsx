import Image from "next/image";
import Link from "next/link";
import { mobileCategories } from "@/data/home";

export function MobileCategories() {
  const rows = mobileCategories.filter((item) => item.layout === "row");
  const tiles = mobileCategories.filter((item) => item.layout === "tile");

  return (
    <section className="bg-[#f6f1e7] px-4 pb-5 md:hidden" id="shop-mobile">
      <div className="flex flex-col gap-2">
        {rows[0] ? (
          <Link
            href={rows[0].href}
            dir="ltr"
            className="flex items-center gap-2.5 rounded-[10px] bg-white px-2.5 py-2 shadow-[0px_1px_2px_rgba(0,0,0,0.07)]"
          >
            <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-brand-mist">
              <Image
                src={rows[0].image}
                alt={rows[0].title}
                fill
                sizes="48px"
                className="object-cover"
              />
            </span>
            <span className="flex min-w-0 flex-1 flex-col items-end gap-1" dir="rtl">
              <span className="text-[15px] font-bold text-[#33203c]">
                {rows[0].title}
              </span>
              {rows[0].subtitle ? (
                <span className="text-[11px] text-[#8a7a90]">
                  {rows[0].subtitle}
                </span>
              ) : null}
            </span>
          </Link>
        ) : null}

        <div className="grid grid-cols-2 gap-2">
          {tiles.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex flex-col items-center gap-1.5 rounded-[10px] bg-white px-2.5 py-2 shadow-[0px_1px_2px_rgba(0,0,0,0.07)]"
            >
              <span className="relative size-12 overflow-hidden rounded-full bg-brand-mist">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </span>
              <span className="text-center text-xs font-bold text-[#33203c]">
                {item.title}
              </span>
            </Link>
          ))}
        </div>

        {rows[1] ? (
          <Link
            href={rows[1].href}
            dir="ltr"
            className="flex items-center gap-2.5 rounded-[10px] bg-white px-2.5 py-2 shadow-[0px_1px_2px_rgba(0,0,0,0.07)]"
          >
            <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-brand-mist">
              <Image
                src={rows[1].image}
                alt={rows[1].title}
                fill
                sizes="48px"
                className="object-cover"
              />
            </span>
            <span className="flex min-w-0 flex-1 flex-col items-end gap-1" dir="rtl">
              <span className="text-[15px] font-bold text-[#33203c]">
                {rows[1].title}
              </span>
              {rows[1].subtitle ? (
                <span className="text-[11px] text-[#8a7a90]">
                  {rows[1].subtitle}
                </span>
              ) : null}
            </span>
          </Link>
        ) : null}
      </div>
    </section>
  );
}
