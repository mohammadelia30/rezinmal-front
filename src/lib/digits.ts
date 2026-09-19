/**
 * تبدیل ارقام فارسی و عربی به لاتین.
 *
 * کاربر فارسی‌زبان عدد را با صفحه‌کلید فارسی می‌نویسد؛ بدون این تبدیل،
 * «۵۰۰۰۰» در فرم‌های عددی پاک می‌شد و صفر ذخیره می‌شد.
 */
const PERSIAN = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC = "٠١٢٣٤٥٦٧٨٩";

export function toEnglishDigits(value: string): string {
  return value.replace(/[۰-۹٠-٩]/g, (digit) => {
    const index = PERSIAN.indexOf(digit);
    return String(index >= 0 ? index : ARABIC.indexOf(digit));
  });
}

/** عددِ داخل یک ورودی متنی، با پذیرش ارقام فارسی و جداکننده‌ها. */
export function parseAmount(value: string): number {
  return Number(toEnglishDigits(value).replace(/[^\d]/g, "")) || 0;
}
