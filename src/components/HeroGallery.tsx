"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { heroSlides } from "@/data/home";

const INTERVAL_MS = 4200;
const ANIMATION_MS = 750;

type Slot = "main" | "next" | "third";

type SwapClone = {
  src: string;
  alt: string;
  fromTop: number;
  fromLeft: number;
  fromWidth: number;
  fromHeight: number;
  toTop: number;
  toLeft: number;
  toWidth: number;
  toHeight: number;
  radiusFrom: string;
  radiusTo: string;
  zIndex: number;
};

function initialOrder() {
  return heroSlides.map((_, index) => index);
}

export function HeroGallery() {
  const [order, setOrder] = useState<number[]>(initialOrder);
  const [swapping, setSwapping] = useState<{
    incoming: SwapClone;
    outgoing: SwapClone;
    hide: Slot;
  } | null>(null);
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);
  const nextThumbRef = useRef<HTMLButtonElement>(null);
  const thirdThumbRef = useRef<HTMLButtonElement>(null);
  const animatingRef = useRef(false);
  const orderRef = useRef(order);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    orderRef.current = order;
  }, [order]);

  const mainSlide = heroSlides[order[0]];
  const nextSlide = heroSlides[order[1]];
  const thirdSlide = heroSlides[order[2]];

  const swapWith = useCallback((slot: "next" | "third") => {
    if (animatingRef.current) return;

    const currentOrder = orderRef.current;
    const mainEl = mainRef.current;
    const thumbEl = slot === "next" ? nextThumbRef.current : thirdThumbRef.current;
    const thumbOrderPos = slot === "next" ? 1 : 2;
    const mainSlideData = heroSlides[currentOrder[0]];
    const thumbSlideData = heroSlides[currentOrder[thumbOrderPos]];

    const commitSwap = () => {
      const nextOrder = [...orderRef.current];
      [nextOrder[0], nextOrder[thumbOrderPos]] = [
        nextOrder[thumbOrderPos],
        nextOrder[0],
      ];
      setOrder(nextOrder);
    };

    if (!mainEl || !thumbEl || !mainSlideData || !thumbSlideData) {
      commitSwap();
      return;
    }

    const mainRect = mainEl.getBoundingClientRect();
    const thumbRect = thumbEl.getBoundingClientRect();

    if (mainRect.width < 8 || thumbRect.width < 8) {
      commitSwap();
      return;
    }

    animatingRef.current = true;

    setSwapping({
      hide: slot,
      incoming: {
        src: thumbSlideData.src,
        alt: thumbSlideData.alt,
        fromTop: thumbRect.top,
        fromLeft: thumbRect.left,
        fromWidth: thumbRect.width,
        fromHeight: thumbRect.height,
        toTop: mainRect.top,
        toLeft: mainRect.left,
        toWidth: mainRect.width,
        toHeight: mainRect.height,
        radiusFrom: "1rem",
        radiusTo: "1.5rem",
        zIndex: 10001,
      },
      outgoing: {
        src: mainSlideData.src,
        alt: mainSlideData.alt,
        fromTop: mainRect.top,
        fromLeft: mainRect.left,
        fromWidth: mainRect.width,
        fromHeight: mainRect.height,
        toTop: thumbRect.top,
        toLeft: thumbRect.left,
        toWidth: thumbRect.width,
        toHeight: thumbRect.height,
        radiusFrom: "1.5rem",
        radiusTo: "1rem",
        zIndex: 10000,
      },
    });

    window.setTimeout(() => {
      commitSwap();
      setSwapping(null);
      animatingRef.current = false;
    }, ANIMATION_MS);
  }, []);

  useEffect(() => {
    if (paused || swapping) return;

    const timer = window.setInterval(() => {
      swapWith("next");
    }, INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [paused, swapping, swapWith]);

  const swapPortal =
    swapping && mounted
      ? createPortal(
          <>
            <SwapBox clone={swapping.outgoing} />
            <SwapBox clone={swapping.incoming} />
          </>,
          document.body,
        )
      : null;

  return (
    <div
      className="relative w-full"
      dir="ltr"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative w-[calc(100%-7.5rem)] pb-[5.75rem] sm:w-[calc(100%-9.5rem)] sm:pb-[7rem] lg:w-[calc(100%-10.5rem)] lg:pb-[7.5rem]">
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-0 z-0 h-[118%] w-[52%] -translate-x-[10%] -translate-y-1/2 rounded-2xl bg-brand-soft sm:rounded-3xl"
        />

        <div
          ref={mainRef}
          className="relative z-10 aspect-square w-full overflow-hidden rounded-2xl bg-brand-mist shadow-[0_18px_40px_-24px_rgba(78,42,84,0.45)] sm:rounded-3xl"
        >
          <Image
            src={mainSlide.src}
            alt={mainSlide.alt}
            fill
            priority
            sizes="(max-width: 1024px) 70vw, 520px"
            className={`object-cover ${swapping ? "opacity-0" : ""}`}
          />
        </div>

        <div className="absolute top-full left-full z-20 flex gap-2.5 sm:gap-3">
          <button
            ref={nextThumbRef}
            type="button"
            onClick={() => swapWith("next")}
            aria-label={`جابه‌جایی با تصویر: ${nextSlide.alt}`}
            className="group relative size-[5.75rem] overflow-hidden rounded-2xl bg-brand-mist shadow-md ring-2 ring-white outline-none transition hover:ring-brand/40 focus-visible:ring-brand sm:size-[7rem] sm:rounded-[1.25rem] lg:size-[7.5rem]"
          >
            <Image
              src={nextSlide.src}
              alt={nextSlide.alt}
              fill
              sizes="176px"
              className={`object-cover transition duration-500 group-hover:scale-105 ${
                swapping?.hide === "next" ? "opacity-0" : ""
              }`}
            />
          </button>

          <button
            ref={thirdThumbRef}
            type="button"
            onClick={() => swapWith("third")}
            aria-label={`جابه‌جایی با تصویر: ${thirdSlide.alt}`}
            className="group relative size-[5.75rem] overflow-hidden rounded-2xl bg-brand-mist shadow-md ring-2 ring-white outline-none transition hover:ring-brand/40 focus-visible:ring-brand sm:size-[7rem] sm:rounded-[1.25rem] lg:size-[7.5rem]"
          >
            <Image
              src={thirdSlide.src}
              alt={thirdSlide.alt}
              fill
              sizes="176px"
              className={`object-cover transition duration-500 group-hover:scale-105 ${
                swapping?.hide === "third" ? "opacity-0" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {swapPortal}
    </div>
  );
}

function SwapBox({ clone }: { clone: SwapClone }) {
  return (
    <div
      className="hero-swap-box pointer-events-none fixed overflow-hidden shadow-xl shadow-brand/25"
      style={
        {
          zIndex: clone.zIndex,
          "--from-top": `${clone.fromTop}px`,
          "--from-left": `${clone.fromLeft}px`,
          "--from-w": `${clone.fromWidth}px`,
          "--from-h": `${clone.fromHeight}px`,
          "--to-top": `${clone.toTop}px`,
          "--to-left": `${clone.toLeft}px`,
          "--to-w": `${clone.toWidth}px`,
          "--to-h": `${clone.toHeight}px`,
          "--hero-radius-from": clone.radiusFrom,
          "--hero-radius-to": clone.radiusTo,
        } as CSSProperties
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- swap clone needs plain img */}
      <img
        src={clone.src}
        alt={clone.alt}
        className="h-full w-full object-cover"
        draggable={false}
      />
    </div>
  );
}
