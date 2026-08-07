import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { Container } from "@/components/Container";

export function BlogHeader() {
  return (
    <header className="border-b border-[#efe6f4] bg-white">
      {/* Mobile — Figma 33:8 */}
      <div
        className="flex h-[58px] items-center justify-between px-3.5 lg:hidden"
        dir="ltr"
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            aria-label="پروفایل کاربر"
            className="relative size-8 overflow-hidden rounded-full bg-brand-mist"
          >
            <Image
              src="/images/figma/avatar-user.png"
              alt="کاربر"
              fill
              sizes="32px"
              className="object-cover"
            />
          </button>

          <button type="button" aria-label="جستجو" className="size-5">
            <Image
              src="/images/figma/icon-search-blog-m.svg"
              alt=""
              width={20}
              height={20}
              className="size-5"
            />
          </button>

          <button type="button" aria-label="سبد خرید" className="relative size-5">
            <Image
              src="/images/figma/icon-cart-blog-m.svg"
              alt=""
              width={20}
              height={20}
              className="size-5"
            />
            <span className="absolute -end-1.5 -top-1.5 flex size-[15px] items-center justify-center rounded-full bg-[#d32f2f] text-[9px] text-white">
              ۲
            </span>
          </button>
        </div>

        <Link
          href="/"
          className="text-xl font-bold text-[#6d1f63]"
          dir="rtl"
        >
          رزینمال
        </Link>
      </div>

      {/* Desktop */}
      <Container className="hidden h-16 items-center justify-between lg:flex">
        <BrandLogo
          size={40}
          imageClassName="h-10 w-10 rounded-full object-cover"
          textClassName="text-2xl font-bold text-brand"
        />

        <div className="flex items-center gap-3.5">
          <button type="button" aria-label="جستجو" className="size-[26px]">
            <Image
              src="/images/figma/icon-search.svg"
              alt=""
              width={20}
              height={20}
              className="mx-auto size-5"
            />
          </button>

          <button
            type="button"
            aria-label="اعلان‌ها"
            className="relative size-[26px]"
          >
            <Image
              src="/images/figma/icon-bell-blog.svg"
              alt=""
              width={20}
              height={20}
              className="mx-auto size-5"
            />
            <span className="absolute -top-1 -end-1 flex size-[13px] items-center justify-center rounded-full bg-[#7b3b86] text-[8px] text-white">
              0
            </span>
          </button>

          <button
            type="button"
            aria-label="علاقه‌مندی‌ها"
            className="relative size-[26px]"
          >
            <Image
              src="/images/figma/icon-heart-blog.svg"
              alt=""
              width={20}
              height={20}
              className="mx-auto size-5"
            />
            <span className="absolute -top-1 -end-1 flex size-[13px] items-center justify-center rounded-full bg-[#7b3b86] text-[8px] text-white">
              0
            </span>
          </button>

          <button
            type="button"
            aria-label="پروفایل کاربر"
            className="flex items-center gap-1"
          >
            <span className="relative size-[34px] overflow-hidden rounded-full bg-brand-mist">
              <Image
                src="/images/figma/avatar-user.png"
                alt="کاربر"
                fill
                sizes="34px"
                className="object-cover"
              />
            </span>
            <span className="text-xs text-[#6b5b73]">▾</span>
          </button>
        </div>
      </Container>
    </header>
  );
}
