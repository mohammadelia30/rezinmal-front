import Image from "next/image";
import { BrandLogo } from "@/components/BrandLogo";
import { Container } from "@/components/Container";

export function BlogHeader() {
  return (
    <header className="border-b border-[#efe6f4] bg-white">
      <Container className="flex h-[58px] items-center justify-between sm:h-16">
        <BrandLogo
          size={40}
          imageClassName="h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10"
          textClassName="text-xl font-bold text-brand sm:text-2xl"
        />

        <div className="flex items-center gap-2 sm:gap-3.5">
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
            <span className="relative size-8 overflow-hidden rounded-full bg-brand-mist sm:size-[34px]">
              <Image
                src="/images/figma/avatar-user.png"
                alt="کاربر"
                fill
                sizes="34px"
                className="object-cover"
              />
            </span>
            <span className="hidden text-xs text-[#6b5b73] sm:inline">▾</span>
          </button>
        </div>
      </Container>
    </header>
  );
}
