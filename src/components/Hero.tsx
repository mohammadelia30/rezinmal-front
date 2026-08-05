import Link from "next/link";
import { Container } from "@/components/Container";
import { HeroGallery } from "@/components/HeroGallery";
import { hero } from "@/data/home";

export function Hero() {
  return (
    <section className="relative min-h-[min(85vh,760px)] overflow-x-clip bg-surface">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-[38%] bg-brand-soft sm:w-[40%] lg:w-[42%]"
      />

      <Container className="relative grid min-h-[min(85vh,760px)] items-center gap-10 py-10 pb-16 sm:py-14 sm:pb-20 lg:grid-cols-2 lg:gap-12 lg:py-16 lg:pb-20">
        <div className="order-2 space-y-7 text-right lg:order-1">
          <h1 className="animate-fade-up text-3xl font-bold leading-[1.65] text-foreground sm:text-4xl lg:text-5xl xl:text-[3.25rem]">
            <span className="block">{hero.titleLine1}</span>
            <span className="block">{hero.titleLine2}</span>
          </h1>
          <div className="animate-fade-up-delay-2">
            <Link
              href="#articles"
              className="inline-flex rounded-lg bg-brand px-7 py-3 text-base font-bold text-white transition hover:bg-brand-dark"
            >
              {hero.cta}
            </Link>
          </div>
        </div>

        <div className="animate-fade-up-delay-1 relative order-1 w-full overflow-visible lg:order-2">
          <HeroGallery />
        </div>
      </Container>
    </section>
  );
}
