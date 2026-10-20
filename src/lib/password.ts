/**
 * قانون‌های رمز عبور، همان چهار قانونی که بک‌اند (جنگو) اجرا می‌کند.
 *
 * بک‌اند قانون‌ها را موقع ثبت بررسی می‌کند و پیام انگلیسی برمی‌گرداند؛
 * قبلاً فرانت فقط طول را چک می‌کرد، پس کاربر رمزی مثل «12345678»
 * می‌نوشت و بعد از ارسال، پیامی به انگلیسی می‌گرفت. حالا همان‌جا و
 * حین تایپ معلوم است چه چیزی مانده است.
 */

export type PasswordRule = {
  id: "length" | "numeric" | "similar" | "common";
  label: string;
  ok: boolean;
};

export const MIN_PASSWORD_LENGTH = 8;

/**
 * رایج‌ترین رمزها.
 *
 * جنگو فهرست بیست‌هزارتایی دارد و همان حرف آخر را می‌زند؛ این فهرست
 * کوتاه فقط برای این است که کاربر پیش از ارسال بفهمد.
 */
const COMMON_PASSWORDS = new Set([
  "password",
  "password1",
  "passw0rd",
  "12345678",
  "123456789",
  "1234567890",
  "123123123",
  "111111111",
  "qwertyui",
  "qwerty123",
  "iloveyou",
  "admin123",
  "abc12345",
  "1q2w3e4r",
  "zaq12wsx",
  "football",
  "superman",
  "trustno1",
  "baseball",
  "sunshine",
]);

/** آیا رمز شبیه شمارهٔ موبایل کاربر است */
function looksLikeAccount(password: string, phone?: string): boolean {
  const value = password.trim().toLowerCase();
  if (!value || !phone) return false;

  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return false;

  if (value.includes(digits) || digits.includes(value)) return true;

  // هفت رقم آخر شماره، چیزی است که معمولاً به‌عنوان رمز گذاشته می‌شود
  const tail = digits.slice(-7);
  return tail.length >= 7 && value.includes(tail);
}

export function checkPassword(
  password: string,
  phone?: string,
): PasswordRule[] {
  const value = password.trim();

  return [
    {
      id: "length",
      label: `حداقل ${MIN_PASSWORD_LENGTH.toLocaleString("fa-IR")} کاراکتر باشد`,
      ok: value.length >= MIN_PASSWORD_LENGTH,
    },
    {
      id: "numeric",
      label: "فقط از عدد ساخته نشده باشد",
      ok: value.length > 0 && !/^\d+$/.test(value),
    },
    {
      id: "similar",
      label: "شبیه شمارهٔ موبایل شما نباشد",
      ok: value.length > 0 && !looksLikeAccount(value, phone),
    },
    {
      id: "common",
      label: "از رمزهای خیلی رایج نباشد",
      ok: value.length > 0 && !COMMON_PASSWORDS.has(value.toLowerCase()),
    },
  ];
}

/** اولین قانونی که رعایت نشده، به زبان آدمیزاد؛ خالی یعنی رمز قبول است */
export function passwordProblem(password: string, phone?: string): string {
  const failed = checkPassword(password, phone).find((rule) => !rule.ok);
  if (!failed) return "";

  return {
    length: `رمز عبور باید حداقل ${MIN_PASSWORD_LENGTH.toLocaleString("fa-IR")} کاراکتر باشد.`,
    numeric: "رمز عبور نمی‌تواند فقط عدد باشد.",
    similar: "رمز عبور نباید شبیه شمارهٔ موبایل شما باشد.",
    common: "این رمز عبور خیلی رایج است؛ رمز دیگری انتخاب کنید.",
  }[failed.id];
}

/** پیام انگلیسی بک‌اند، به فارسی */
const BACKEND_MESSAGES: [RegExp, string][] = [
  [/too short|at least \d+ characters/i, `رمز عبور باید حداقل ${MIN_PASSWORD_LENGTH.toLocaleString("fa-IR")} کاراکتر باشد.`],
  [/too common/i, "این رمز عبور خیلی رایج است؛ رمز دیگری انتخاب کنید."],
  [/entirely numeric/i, "رمز عبور نمی‌تواند فقط عدد باشد."],
  [/too similar/i, "رمز عبور نباید شبیه شمارهٔ موبایل شما باشد."],
  [/do not match|didn't match|must match/i, "رمز عبور و تکرار آن یکسان نیستند."],
  [/different from the old password/i, "رمز تازه باید با رمز قبلی فرق داشته باشد."],
  [/incorrect|wrong password/i, "رمز عبور فعلی درست نیست."],
];

export function passwordErrorInPersian(
  message: string,
  fallback: string,
): string {
  for (const [pattern, persian] of BACKEND_MESSAGES) {
    if (pattern.test(message)) return persian;
  }
  return /[؀-ۿ]/.test(message) ? message : fallback;
}
