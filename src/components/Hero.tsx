import Link from "next/link";
import { Container } from "@/components/Container";
import { HeroGallery } from "@/components/HeroGallery";
import { hero } from "@/data/home";

export function Hero() {
  return (
    <section className="relative overflow-x-clip bg-surface">
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
  );
}
