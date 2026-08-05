import Image from "next/image";
import Link from "next/link";
import { heroImages } from "@/data/home";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-[radial-gradient(ellipse_at_15%_45%,var(--brand-mist),transparent_55%)] sm:w-[65%]" />
      <div className="pointer-events-none absolute top-8 left-0 hidden h-[70%] w-24 rounded-e-3xl bg-brand-soft/45 sm:block lg:w-32" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8 lg:py-16">
        <div className="order-2 lg:order-1">
          <div className="relative animate-soft-float">
            <div className="grid grid-cols-[1.4fr_0.9fr] gap-3 sm:gap-4">
              <div className="relative overflow-hidden rounded-[1.5rem] shadow-[0_22px_50px_-24px_rgba(78,42,84,0.45)] sm:rounded-[1.75rem]">
                <Image
                  src={heroImages.main}
                  alt="ساخت هنر رزین با دست"
                  width={960}
                  height={720}
                  priority
                  className="aspect-[4/3] h-full w-full object-cover"
                />
              </div>

              <div className="grid grid-rows-2 gap-3 sm:gap-4">
                <div className="overflow-hidden rounded-2xl sm:rounded-[1.25rem]">
                  <Image
                    src={heroImages.thumb1}
                    alt="گوشواره رزینی دست‌ساز"
                    width={400}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl sm:rounded-[1.25rem]">
                  <Image
                    src={heroImages.thumb2}
                    alt="زیورآلات رزینی بنفش"
                    width={400}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 space-y-6 text-center lg:order-2 lg:text-right">
          <h1 className="animate-fade-up text-3xl font-extrabold leading-[1.45] text-brand sm:text-4xl lg:text-[2.65rem]">
            زیبایی را خودتان بسازید با کیت‌های آموزش رزین‌مال
          </h1>
          <p className="animate-fade-up-delay-1 mx-auto max-w-md text-base leading-8 text-muted lg:mx-0">
            مواد اولیه، قالب، ابزار و آموزش‌های کاربردی برای شروع و پیشرفت در هنر
            رزین.
          </p>
          <div className="animate-fade-up-delay-2 flex justify-center lg:justify-start">
            <Link
              href="#articles"
              className="inline-flex items-center justify-center rounded-xl bg-brand px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark"
            >
              شروع یادگیری
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
