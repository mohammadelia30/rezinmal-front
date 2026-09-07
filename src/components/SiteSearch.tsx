"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * جست‌وجوی سراسری سایت.
 *
 * در هدر قرار می‌گیرد، پس در همهٔ صفحات در دسترس است و کاربر را به
 * صفحهٔ نتایج می‌برد؛ خودِ جست‌وجو سمت سرور انجام می‌شود تا نتیجه
 * قابل اشتراک‌گذاری و قابل بوکمارک باشد.
 */
export function SiteSearch({
  className = "",
  autoFocus = false,
  onDone,
}: {
  className?: string;
  autoFocus?: boolean;
  onDone?: () => void;
}) {
  const router = useRouter();
  const [value, setValue] = useState("");

  // عمداً از useSearchParams استفاده نمی‌شود: این هوک هر صفحه‌ای را که
  // هدر دارد از حالت prerender ایستا خارج می‌کند و بیلد را می‌شکند.
  // پرکردن کادر با عبارت فعلی، بعد از mount انجام می‌شود.
  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("q");
    if (query) setValue(query);
  }, []);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const query = value.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    onDone?.();
  };

  return (
    <form onSubmit={submit} role="search" className={`relative ${className}`}>
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(event) => setValue(event.target.value)}
        placeholder="جست‌وجوی محصول..."
        aria-label="جست‌وجو در محصولات"
        className="min-h-10 w-full rounded-xl border border-[#e6dcc2] bg-white px-4 py-2 pe-10 text-right text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
      />
      <button
        type="submit"
        aria-label="جست‌وجو"
        className="absolute end-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition hover:text-brand"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden
          className="size-5"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  );
}
