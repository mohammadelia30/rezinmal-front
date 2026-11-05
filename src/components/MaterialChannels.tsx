import { Container } from "@/components/Container";
import {
  BaleIcon,
  InstagramIcon,
  TelegramIcon,
} from "@/components/icons";
import { socialChannels } from "@/data/home";

/**
 * راه سفارش متریال، همان‌طور که فروشگاه خودش توضیح می‌دهد.
 *
 * فهرست کامل متریال با قیمت روز در کانال‌ها به‌روز می‌شود، نه روی
 * سایت؛ مشتری لیستش را به دایرکت می‌فرستد. تا امروز هیچ‌جای سایت این
 * را نمی‌گفت و آیکون‌های فوتر هم به `#` می‌رفتند.
 */

const ICONS = {
  telegram: TelegramIcon,
  bale: BaleIcon,
  instagram: InstagramIcon,
} as const;

export function MaterialChannels() {
  return (
    <section className="bg-[#f6f1e7] px-4 py-3 md:bg-background md:px-0 md:py-10">
      <Container className="px-0 md:px-6">
        <div className="rounded-2xl bg-gradient-to-l from-[#f0e9f4] to-[#f7f1e6] p-4 ring-1 ring-[#e3d7ec] md:rounded-3xl md:p-8">
          <div className="text-right">
            <h2 className="flex items-center gap-2 text-sm font-bold text-[#3d2447] md:text-2xl">
              <span
                aria-hidden
                className="h-4 w-1 shrink-0 rounded-full bg-brand md:h-6 md:w-1.5"
              />
              لیست متریال با قیمت روز
            </h2>
            <p className="mt-2 text-xs leading-7 text-[#5b4a63] md:mt-3 md:text-sm md:leading-8">
              فهرست کامل وسایل و متریال با قیمت‌های به‌روز در کانال تلگرام و
              بله گذاشته می‌شود. هر کدام راحت‌ترید سر بزنید، لیست خودتان را
              بنویسید و در یک پیام به دایرکت اینستاگرام فروشگاه بفرستید.
            </p>
          </div>

          <div className="mt-4 grid gap-2 md:mt-6 md:grid-cols-3 md:gap-3">
            {socialChannels.map((channel) => {
              const Icon = ICONS[channel.key];

              return (
                <a
                  key={channel.key}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-right shadow-[0px_1px_4px_rgba(61,36,71,0.08)] transition hover:shadow-[0px_2px_10px_rgba(61,36,71,0.14)]"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-mist text-brand md:size-10">
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-[#3d2447] md:text-sm">
                      {channel.label}
                    </span>
                    <span
                      dir="ltr"
                      className="block truncate text-right text-[11px] text-muted md:text-xs"
                    >
                      {channel.handle}
                    </span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
