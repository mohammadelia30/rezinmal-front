/**
 * تبدیل تاریخ فرم (yyyy-mm-dd) به زمان بک‌اند و برعکس، به وقت تهران.
 *
 * ایران از ۱۴۰۱ ساعت تابستانی ندارد، پس اختلاف همیشه +۰۳:۳۰ است. تاریخ
 * شروع از ابتدای روز و تاریخ پایان تا انتهای همان روز حساب می‌شود؛ تخفیفی
 * که «تا ۳۰ شهریور» است باید کل آن روز معتبر بماند.
 */

const TEHRAN_OFFSET = "+03:30";

export function toStartOfDay(date: string): string | null {
  return date ? `${date}T00:00:00${TEHRAN_OFFSET}` : null;
}

export function toEndOfDay(date: string): string | null {
  return date ? `${date}T23:59:59${TEHRAN_OFFSET}` : null;
}

/** زمان ISO بک‌اند → yyyy-mm-dd همان روز در تهران، برای input[type=date] */
export function toDateInput(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  // en-CA قالب yyyy-mm-dd می‌دهد
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** yyyy-mm-dd → «۳۰ شهریور ۱۴۰۵» */
export function formatJalali(date: string): string {
  if (!date) return "";
  const parsed = new Date(`${date}T12:00:00${TEHRAN_OFFSET}`);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed);
}

/** امروز در تهران، yyyy-mm-dd */
export function todayInTehran(): string {
  return toDateInput(new Date().toISOString());
}
