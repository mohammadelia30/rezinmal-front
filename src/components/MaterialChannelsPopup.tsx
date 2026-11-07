"use client";

import { useEffect, useState } from "react";
import { BaleIcon, InstagramIcon, TelegramIcon } from "@/components/icons";
import { socialChannels } from "@/data/home";

/**
 * پیام خوش‌آمد فروشگاه، یک بار در بدو ورود.
 *
 * «یک بار» را در localStorage نگه می‌داریم: پاپ‌آپی که هر بار باز شدن
 * صفحه بپرد، خوانده نمی‌شود، بسته می‌شود. اگر مرورگر اجازهٔ ذخیره
 * ندهد (حالت ناشناس)، بدترین حالت این است که دوباره دیده شود، نه
 * اینکه صفحه بشکند — برای همین هر دسترسی داخل try است.
 *
 * state اولیه روی سرور و مرورگر یکسان است (بسته) تا هیدریشن به هم
 * نریزد؛ تصمیمِ نشان‌دادن با یک تأخیر کوتاه گرفته می‌شود تا روی اولین
 * نقاشی صفحه نپرد.
 */

const STORAGE_KEY = "resinmal:channels-popup-seen";

const ICONS = {
  telegram: TelegramIcon,
  bale: BaleIcon,
  instagram: InstagramIcon,
} as const;

export function MaterialChannelsPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      let seen = false;
      try {
        seen = window.localStorage.getItem(STORAGE_KEY) === "1";
      } catch {
        seen = false;
      }
      if (!seen) setOpen(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    // تا وقتی پاپ‌آپ باز است، صفحهٔ پشتش نباید اسکرول شود
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function close() {
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // حالت ناشناس؛ دفعهٔ بعد دوباره نشان داده می‌شود
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="channels-popup-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
    >
      {/* کلیک روی پس‌زمینه هم می‌بندد */}
      <button
        type="button"
        aria-label="بستن"
        tabIndex={-1}
        onClick={close}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(61,36,71,0.25)]">
        <div className="flex items-start justify-between gap-3 bg-gradient-to-l from-[#f0e9f4] to-[#f7f1e6] px-5 py-4">
          <button
            type="button"
            onClick={close}
            aria-label="بستن"
            className="-mt-1 shrink-0 rounded-full px-2 py-1 text-lg leading-none text-[#6b5b73] transition hover:bg-white/70"
          >
            ✕
          </button>
          <h2
            id="channels-popup-title"
            className="text-right text-base font-bold text-[#3d2447]"
          >
            لیست متریال با قیمت روز
          </h2>
        </div>

        <div className="px-5 py-4">
          <p className="text-right text-sm leading-7 text-[#5b4a63]">
            فهرست کامل وسایل و متریال با قیمت‌های به‌روز در کانال تلگرام و بله
            گذاشته می‌شود. هر کدام راحت‌ترید سر بزنید، لیست خودتان را بنویسید
            و در یک پیام به دایرکت اینستاگرام فروشگاه بفرستید.
          </p>

          <div className="mt-4 space-y-2">
            {socialChannels.map((channel) => {
              const Icon = ICONS[channel.key];

              return (
                <a
                  key={channel.key}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#e8dcef] px-4 py-2.5 text-right transition hover:border-brand hover:bg-brand-mist/40"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-mist text-brand">
                    <Icon className="size-4.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-[#3d2447]">
                      {channel.label}
                    </span>
                    <span
                      dir="ltr"
                      className="block truncate text-right text-[11px] text-muted"
                    >
                      {channel.handle}
                    </span>
                  </span>
                </a>
              );
            })}
          </div>

          <button
            type="button"
            onClick={close}
            className="mt-4 w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            بعداً می‌بینم
          </button>
        </div>
      </div>
    </div>
  );
}
