/**
 * نماد اعتماد الکترونیکی (اینماد).
 *
 * سه نکته عمدی است و تغییرشان نشان را از کار می‌اندازد:
 *
 * - تصویر از `next/image` رد نمی‌شود. بهینه‌ساز Next آدرس را به
 *   `/_next/image?url=…` عوض می‌کند و اینماد دیگر درخواست را از آنِ
 *   سایت ما نمی‌شناسد.
 * - `referrerPolicy="origin"` همان چیزی است که در کد خود اینماد آمده؛
 *   دامنه را از روی Referer تشخیص می‌دهند، پس `noreferrer` اضافه
 *   نمی‌کنیم (ولی `noopener` بی‌خطر است و می‌ماند).
 * - دامنهٔ trustseal.enamad.ir باید در `img-src` سیاست امنیتی محتوا
 *   (next.config.ts) باز باشد، وگرنه مرورگر تصویر را دور می‌اندازد.
 */

const ENAMAD_ID = "541222";
const ENAMAD_CODE = "Df4N1TSzigPSbGxIZh38jJh49iQoZUvJ";

const query = `id=${ENAMAD_ID}&Code=${ENAMAD_CODE}`;

export function TrustSeal({ className = "" }: { className?: string }) {
  return (
    <a
      href={`https://trustseal.enamad.ir/?${query}`}
      target="_blank"
      rel="noopener"
      referrerPolicy="origin"
      aria-label="مشاهدهٔ نماد اعتماد الکترونیکی رزین‌مال"
      className={`inline-flex shrink-0 overflow-hidden rounded-lg bg-white p-1 transition hover:opacity-90 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://trustseal.enamad.ir/logo.aspx?${query}`}
        alt="نماد اعتماد الکترونیکی"
        referrerPolicy="origin"
        loading="lazy"
        // اینماد خودش این صفت را روی تصویر می‌گذارد؛ دست‌نخورده می‌ماند
        {...{ code: ENAMAD_CODE }}
        className="h-auto w-[72px] cursor-pointer md:w-[86px]"
      />
    </a>
  );
}
