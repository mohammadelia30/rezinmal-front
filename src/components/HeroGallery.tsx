"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { heroSlides } from "@/data/home";

/** مدت نمایش هر تصویر، شامل زمان محو شدن */
const SLIDE_MS = 5000;
/** مدت cross-fade بین دو تصویر */
const FADE_MS = 600;

type Slot = "next" | "third";

/**
 * تصاویر روی هم چیده می‌شوند و فقط شفافیت‌شان عوض می‌شود.
 *
 * قبلاً تصویر فعلی تا صفر محو می‌شد و بعد از پایان انیمیشن، عنصر جدید
 * mount می‌شد؛ نتیجه‌اش دیده شدن پس‌زمینهٔ خالی بین دو عکس بود. با این
 * روش تصویر بعدی از زیر ظاهر می‌شود و شکافی باقی نمی‌ماند.
 */
function SlideStack({
  activeId,
  sizes,
  priorityId,
}: {
  activeId: string;
  sizes: string;
  priorityId?: string;
}) {
  return (
    <>
      {heroSlides.map((slide) => {
        const isActive = slide.id === activeId;

        return (
          <Image
            key={slide.id}
            src={slide.src}
            alt={isActive ? slide.alt : ""}
            aria-hidden={!isActive}
            fill
            priority={slide.id === priorityId}
            sizes={sizes}
            className="hero-slide object-cover"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? "scale(1)" : "scale(1.04)",
            }}
          />
        );
      })}
    </>
  );
}

export function HeroGallery() {
  const [order, setOrder] = useState(() => heroSlides.map((_, i) => i));
  const [paused, setPaused] = useState(false);
  // با هر تعامل کاربر تایمر از نو شروع می‌شود تا بلافاصله بعد از
  // کلیک، تصویر عوض نشود.
  const [restartKey, setRestartKey] = useState(0);

  const mainSlide = heroSlides[order[0]];
  const nextSlide = heroSlides[order[1]];
  const thirdSlide = heroSlides[order[2]];

  /**
   * چرخش خودکار: کل صف یک قدم جلو می‌رود.
   *
   * قبلاً هر بار جای موقعیت ۰ و ۱ عوض می‌شد، یعنی نمایش خودکار فقط بین
   * دو تصویر اول رفت‌وبرگشت می‌کرد و دو تصویر دیگر هرگز خودشان نمی‌آمدند.
   */
  const advance = useCallback(() => {
    setOrder((current) => [...current.slice(1), current[0]]);
  }, []);

  /** کلیک روی بندانگشتی: همان تصویر به جایگاه اصلی می‌آید. */
  const handleThumbClick = (slot: Slot) => {
    setOrder((current) => {
      const position = slot === "next" ? 1 : 2;
      const next = [...current];
      [next[0], next[position]] = [next[position], next[0]];
      return next;
    });
    setRestartKey((value) => value + 1);
  };

  // وقتی تب پنهان است تایمر متوقف می‌شود؛ وگرنه مرورگر در بازگشت،
  // چند تعویض عقب‌افتاده را پشت‌سرهم اجرا می‌کند.
  useEffect(() => {
    const onVisibilityChange = () => {
      setPaused(document.visibilityState === "hidden");
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    if (paused) return;

    // وابستگی‌ها ثابت‌اند، پس فاصلهٔ تعویض دقیقاً SLIDE_MS می‌ماند.
    const timer = window.setInterval(advance, SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [paused, advance, restartKey]);

  return (
    <div
      className="relative w-full"
      style={{ "--hero-fade": `${FADE_MS}ms` } as React.CSSProperties}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative ms-0 w-full max-w-2xl lg:max-w-none">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-mist shadow-lg sm:aspect-[5/4] lg:aspect-square xl:aspect-[5/4]">
          <SlideStack
            activeId={mainSlide.id}
            sizes="(max-width: 1024px) 90vw, 50vw"
            priorityId={heroSlides[0].id}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand/15 via-transparent to-transparent"
          />
        </div>

        <div className="absolute -bottom-3 start-3 z-10 flex items-end gap-2 sm:start-6 sm:gap-3 lg:-bottom-5 lg:start-8">
          <button
            type="button"
            onClick={() => handleThumbClick("next")}
            aria-label={`نمایش تصویر: ${nextSlide.alt}`}
            className="group relative h-16 w-16 overflow-hidden rounded-lg bg-brand-mist shadow-md ring-2 ring-white outline-none transition hover:ring-brand/50 focus-visible:ring-brand sm:h-24 sm:w-24 sm:rounded-xl sm:ring-[3px] lg:h-32 lg:w-32"
          >
            <SlideStack activeId={nextSlide.id} sizes="128px" />
          </button>

          <button
            type="button"
            onClick={() => handleThumbClick("third")}
            aria-label={`نمایش تصویر: ${thirdSlide.alt}`}
            className="group relative h-12 w-12 overflow-hidden rounded-lg bg-brand-mist shadow-md ring-2 ring-white outline-none transition hover:ring-brand/50 focus-visible:ring-brand sm:h-16 sm:w-16 sm:rounded-xl sm:ring-[3px] lg:h-24 lg:w-24"
          >
            <SlideStack activeId={thirdSlide.id} sizes="96px" />
          </button>
        </div>
      </div>
    </div>
  );
}
