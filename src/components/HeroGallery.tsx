"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { heroSlides } from "@/data/home";

const INTERVAL_MS = 4500;
const ANIMATION_MS = 550;

type Slot = "next" | "third";

export function HeroGallery() {
  const [order, setOrder] = useState(() => heroSlides.map((_, i) => i));
  const [activeSlot, setActiveSlot] = useState<Slot | null>(null);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);

  const animatingRef = useRef(false);
  const orderRef = useRef(order);

  useEffect(() => {
    orderRef.current = order;
  }, [order]);

  const mainSlide = heroSlides[order[0]];
  const nextSlide = heroSlides[order[1]];
  const thirdSlide = heroSlides[order[2]];

  const swapWith = useCallback((slot: Slot) => {
    if (animatingRef.current) return;

    animatingRef.current = true;
    setActiveSlot(slot);
    setFading(true);

    window.setTimeout(() => {
      const thumbOrderPos = slot === "next" ? 1 : 2;
      const nextOrder = [...orderRef.current];
      [nextOrder[0], nextOrder[thumbOrderPos]] = [
        nextOrder[thumbOrderPos],
        nextOrder[0],
      ];
      setOrder(nextOrder);
      setFading(false);
      setActiveSlot(null);
      animatingRef.current = false;
    }, ANIMATION_MS);
  }, []);

  useEffect(() => {
    if (paused || fading) return;

    const timer = window.setInterval(() => {
      swapWith("next");
    }, INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [paused, fading, swapWith]);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative ms-0 w-full max-w-2xl lg:max-w-none">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-mist shadow-lg sm:aspect-[5/4] lg:aspect-square xl:aspect-[5/4]">
          <Image
            key={mainSlide.id}
            src={mainSlide.src}
            alt={mainSlide.alt}
            fill
            priority
            sizes="(max-width: 1024px) 90vw, 50vw"
            className={`object-cover transition-all duration-500 ease-out ${
              fading
                ? "scale-105 opacity-0"
                : "hero-image-enter scale-100 opacity-100"
            }`}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand/15 via-transparent to-transparent"
          />
        </div>

        <div className="absolute -bottom-4 start-4 z-10 flex items-end gap-2.5 sm:start-8 sm:gap-3 lg:-bottom-5">
          <button
            type="button"
            onClick={() => swapWith("next")}
            aria-label={`نمایش تصویر: ${nextSlide.alt}`}
            className="group relative h-24 w-24 overflow-hidden rounded-xl bg-brand-mist shadow-md ring-[3px] ring-white outline-none transition hover:ring-brand/50 focus-visible:ring-brand sm:h-28 sm:w-28 lg:h-32 lg:w-32"
          >
            <Image
              key={nextSlide.id}
              src={nextSlide.src}
              alt={nextSlide.alt}
              fill
              sizes="128px"
              className={`object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
                activeSlot === "next" && fading
                  ? "scale-95 opacity-0"
                  : "opacity-100"
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => swapWith("third")}
            aria-label={`نمایش تصویر: ${thirdSlide.alt}`}
            className="group relative h-16 w-16 overflow-hidden rounded-xl bg-brand-mist shadow-md ring-[3px] ring-white outline-none transition hover:ring-brand/50 focus-visible:ring-brand sm:h-20 sm:w-20 lg:h-24 lg:w-24"
          >
            <Image
              key={thirdSlide.id}
              src={thirdSlide.src}
              alt={thirdSlide.alt}
              fill
              sizes="96px"
              className={`object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
                activeSlot === "third" && fading
                  ? "scale-95 opacity-0"
                  : "opacity-100"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
