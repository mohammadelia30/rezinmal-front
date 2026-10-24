import Link from "next/link";

/**
 * عنوان بخش‌های صفحهٔ اصلی.
 *
 * تا امروز هر بخش فقط یک خط متن خالی روی پس‌زمینه بود و معلوم نبود
 * کجا تمام می‌شود و بخش بعدی کجا شروع؛ کارفرما درست می‌گفت که خام
 * به نظر می‌رسد. حالا عنوان یک نوار رنگی کنارش دارد و «مشاهده همه»
 * دکمه است، نه یک لینک شناور.
 *
 * ترتیب عمدی است: در صفحهٔ راست‌به‌چپ اولین عنصرِ ردیف سمت راست
 * می‌نشیند، پس عنوان باید اول بیاید. قبلاً لینک اول نوشته شده بود و
 * «مشاهده همه» سمت راست و نام دسته سمت چپ می‌افتاد — برعکسِ هر
 * سایت فارسی دیگری.
 */
export function SectionHeading({
  title,
  href,
  count,
  linkLabel = "مشاهده همه",
  size = "md",
}: {
  title: string;
  /** مقصد «مشاهده همه»؛ ندادنش یعنی بخش لینک ندارد */
  href?: string;
  /** تعداد کل آیتم‌های بخش؛ کنار «مشاهده همه» نوشته می‌شود */
  count?: number;
  linkLabel?: string;
  size?: "md" | "lg";
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3 md:mb-5">
      <h2
        className={`flex min-w-0 items-center gap-2 font-bold text-[#3d2447] ${
          size === "lg" ? "text-base md:text-2xl" : "text-sm md:text-xl"
        }`}
      >
        <span
          aria-hidden
          className="h-4 w-1 shrink-0 rounded-full bg-brand md:h-6 md:w-1.5"
        />
        <span className="truncate">{title}</span>
      </h2>

      {href ? (
        <Link
          href={href}
          className="shrink-0 rounded-full border border-[#e2d3ea] bg-white px-3 py-1 text-[11px] font-medium text-brand transition hover:border-brand hover:bg-brand-mist md:px-4 md:py-1.5 md:text-sm"
        >
          {linkLabel}
          {typeof count === "number" && count > 0
            ? ` (${count.toLocaleString("fa-IR")})`
            : ""}
        </Link>
      ) : null}
    </div>
  );
}
