import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { HeroGallery } from "@/components/HeroGallery";
import { hero, heroSlides } from "@/data/home";

export function Hero() {
  return (
    <>
      {/* Mobile — Figma 25:93 */}
      <section className="bg-[#f6f1e7] px-4 pb-4 pt-2 md:hidden">
        <h1 className="mb-3 text-right text-lg font-bold leading-[1.6] text-[#33203c]">
          <span className="block">زیبایی را خودتان بسازید با</span>
          <span className="block">کیت‌های آموزش رزینمال</span>
        </h1>

        <div className="relative mb-3">
          <div
            aria-hidden
            className="absolute -bottom-2 left-0 h-[72%] w-[18px] rounded-s-md bg-[#c6a9d8]"
          />
          <div
            aria-hidden
            className="absolute -bottom-2.5 left-3 right-10 h-2.5 rounded-md bg-[#dcc8ea]/80"
          />

          <div className="relative aspect-[237/192] overflow-hidden rounded-[10px] bg-brand-mist shadow-sm">
            <Image
              src={heroSlides[0].src}
              alt={heroSlides[0].alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div className="absolute bottom-2 right-1.5 z-10 flex flex-col gap-1.5">
            <div className="relative size-10 overflow-hidden rounded-md shadow-md ring-2 ring-white">
              <Image
                src={heroSlides[1].src}
                alt={heroSlides[1].alt}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="relative size-10 overflow-hidden rounded-md shadow-md ring-2 ring-white">
              <Image
                src={heroSlides[2].src}
                alt={heroSlides[2].alt}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <Link
          href="/blog"
          className="flex w-full items-center justify-center rounded-md bg-[#5f4270] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark"
        >
          {hero.cta}
        </Link>
      </section>

      {/* Desktop / tablet */}
      <section className="relative hidden overflow-x-clip bg-surface md:block">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[34%] bg-brand-soft sm:w-[38%] lg:w-[42%]"
        />

        <Container className="relative grid items-center gap-8 py-8 pb-16 sm:gap-10 sm:py-12 sm:pb-20 lg:min-h-[min(80vh,720px)] lg:grid-cols-2 lg:gap-12 lg:py-16 lg:pb-24">
          <div className="order-2 space-y-5 text-right sm:space-y-7 lg:order-1">
            <h1 className="animate-fade-up text-[1.65rem] font-bold leading-[1.7] text-foreground sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.25rem]">
              <span className="block">{hero.titleLine1}</span>
              <span className="block">{hero.titleLine2}</span>
            </h1>
            <div className="animate-fade-up-delay-2">
              <Link
                href="/blog"
                className="inline-flex rounded-lg bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark sm:px-7 sm:py-3 sm:text-base"
              >
                {hero.cta}
              </Link>
            </div>
          </div>

          <div className="animate-fade-up-delay-1 relative order-1 mx-auto w-full max-w-md overflow-visible pb-6 sm:max-w-lg sm:pb-8 lg:order-2 lg:mx-0 lg:max-w-none lg:pb-10">
            <HeroGallery />
          </div>
        </Container>
      </section>
    </>
  );
}
