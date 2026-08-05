import Link from "next/link";
import { HeroGallery } from "@/components/HeroGallery";

export function Hero() {
  return (
    <section className="relative overflow-x-clip">
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.9fr_1.2fr] lg:gap-10 lg:px-8 lg:py-16">
        <div className="space-y-6 text-right">
          <h1 className="animate-fade-up text-3xl font-extrabold leading-[1.45] text-brand sm:text-4xl lg:text-[2.65rem]">
            زیبایی را خودتان بسازید با کیت‌های آموزش رزین‌مال
          </h1>
          <div className="animate-fade-up-delay-2 flex justify-start">
            <Link
              href="#articles"
              className="inline-flex items-center justify-center rounded-xl bg-brand px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark"
            >
              شروع یادگیری
            </Link>
          </div>
        </div>

        <div className="min-w-0 overflow-visible">
          <HeroGallery />
        </div>
      </div>
    </section>
  );
}
