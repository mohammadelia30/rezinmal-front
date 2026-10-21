"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * تصویرهای یک محصول.
 *
 * صفحهٔ محصول فقط تصویر اصلی را نشان می‌داد؛ فروشنده سه عکس آپلود
 * می‌کرد و مشتری فقط یکی را می‌دید. حالا بقیه زیر تصویر اصلی‌اند و با
 * زدن روی هرکدام، همان بزرگ می‌شود.
 */
export function ProductGallery({
  images,
  title,
}: {
  images: { url: string; alt?: string }[];
  title: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  const current = images[Math.min(active, images.length - 1)];

  return (
    <div className="mx-auto w-full max-w-md lg:max-w-none">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-card">
        <Image
          src={current.url}
          alt={current.alt || title}
          fill
          priority
          unoptimized={current.url.startsWith("http")}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 ? (
        <div className="mt-3 flex flex-wrap justify-end gap-2">
          {images.map((image, index) => {
            const selected = index === Math.min(active, images.length - 1);

            return (
              <button
                key={image.url}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`تصویر ${(index + 1).toLocaleString("fa-IR")}`}
                aria-pressed={selected}
                className={`relative size-16 shrink-0 overflow-hidden rounded-xl border-2 bg-card transition sm:size-20 ${
                  selected ? "border-brand" : "border-transparent hover:border-brand/40"
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.alt || title}
                  fill
                  unoptimized={image.url.startsWith("http")}
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
