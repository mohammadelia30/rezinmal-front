import Image from "next/image";
import { BrandLogo } from "@/components/BrandLogo";
import { Container } from "@/components/Container";

export function CategoryHeader() {
  return (
    <header className="border-b border-[#efe6f4] bg-white">
      <Container className="flex h-16 items-center justify-between sm:h-[64px]">
        <BrandLogo
          size={40}
          imageClassName="h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10"
          textClassName="text-xl font-bold text-brand sm:text-[26px]"
        />

        <div className="flex items-center gap-2 sm:gap-3.5">
          <button
            type="button"
            aria-label="اعلان‌ها"
            className="relative size-[26px]"
          >
            <span className="relative mx-auto block size-[22px]">
              <Image
                src="/images/figma/icon-bell.svg"
                alt=""
                width={22}
                height={22}
                className="size-[22px]"
              />
            </span>
            <span className="absolute -top-1 -end-1 flex size-[13px] items-center justify-center rounded-full bg-[#7b3b86] text-[8px] text-white">
              ۵
            </span>
          </button>

          <button
            type="button"
            aria-label="علاقه‌مندی‌ها"
            className="relative size-[26px]"
          >
            <span className="relative mx-auto block size-[22px]">
              <Image
                src="/images/figma/icon-heart.svg"
                alt=""
                width={22}
                height={22}
                className="size-[22px]"
              />
            </span>
            <span className="absolute -top-1 -end-1 flex size-[13px] items-center justify-center rounded-full bg-[#7b3b86] text-[8px] text-white">
              ۳
            </span>
          </button>

          <button
            type="button"
            aria-label="پروفایل کاربر"
            className="relative size-9 overflow-hidden rounded-full bg-brand-mist sm:size-[34px]"
          >
            <Image
              src="/images/figma/avatar-user.png"
              alt="کاربر"
              fill
              sizes="34px"
              className="object-cover"
            />
          </button>
        </div>
      </Container>
    </header>
  );
}
