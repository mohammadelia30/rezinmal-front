/**
 * قانون‌های رمز عبور، همان چهار قانونی که بک‌اند (جنگو) اجرا می‌کند.
 *
 * بک‌اند قانون‌ها را موقع ثبت بررسی می‌کند و پیام انگلیسی برمی‌گرداند؛
 * قبلاً فرانت فقط طول را چک می‌کرد، پس کاربر رمزی مثل «12345678»
 * می‌نوشت و بعد از ارسال، پیامی به انگلیسی می‌گرفت. حالا همان‌جا و
 * حین تایپ معلوم است چه چیزی مانده است.
 */

export type PasswordRule = {
  id: "length" | "lower" | "upper" | "digit" | "symbol";
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

/** نشانه‌های اَسکی؛ حرف فارسی به‌جای نشانه حساب نمی‌شود */
const SYMBOL = /[!-/:-@[-`{-~]/;

export function checkPassword(password: string): PasswordRule[] {
  const value = password.trim();

  return [
    {
      id: "length",
      label: `حداقل ${MIN_PASSWORD_LENGTH.toLocaleString("fa-IR")} کاراکتر باشد`,
      ok: value.length >= MIN_PASSWORD_LENGTH,
    },
    {
      id: "lower",
      label: "یک حرف کوچک انگلیسی داشته باشد (a تا z)",
      ok: /[a-z]/.test(value),
    },
    {
      id: "upper",
      label: "یک حرف بزرگ انگلیسی داشته باشد (A تا Z)",
      ok: /[A-Z]/.test(value),
    },
    {
      id: "digit",
      label: "یک عدد داشته باشد (۰ تا ۹)",
      ok: /[0-9]/.test(value),
    },
    {
      id: "symbol",
      label: "یک نشانه داشته باشد (مثل ! یا @ یا #)",
      ok: SYMBOL.test(value),
    },
  ];
}

/**
 * اولین ایرادی که رمز دارد؛ خالی یعنی قبول است.
 *
 * دو قانون آخر در فهرست تیک‌ها نیستند (بک‌اند هم جداگانه می‌گیردشان)
 * ولی اگر رمز به آن‌ها بخورد، باید پیش از ارسال معلوم شود.
 */
export function passwordProblem(password: string, phone?: string): string {
  const failed = checkPassword(password).find((rule) => !rule.ok);

  if (failed) {
    return {
      length: `رمز عبور باید حداقل ${MIN_PASSWORD_LENGTH.toLocaleString("fa-IR")} کاراکتر باشد.`,
      lower: "رمز عبور باید دست‌کم یک حرف کوچک انگلیسی داشته باشد.",
      upper: "رمز عبور باید دست‌کم یک حرف بزرگ انگلیسی داشته باشد.",
      digit: "رمز عبور باید دست‌کم یک عدد داشته باشد.",
      symbol: "رمز عبور باید دست‌کم یک نشانه مثل ! یا @ داشته باشد.",
    }[failed.id];
  }

  const value = password.trim();

  if (looksLikeAccount(value, phone)) {
    return "رمز عبور نباید شبیه شمارهٔ موبایل شما باشد.";
  }

  if (COMMON_PASSWORDS.has(value.toLowerCase())) {
    return "این رمز عبور خیلی رایج است؛ رمز دیگری انتخاب کنید.";
  }

  return "";
}

/** پیام انگلیسی بک‌اند، به فارسی */
const BACKEND_MESSAGES: [RegExp, string][] = [
  [/too short|at least \d+ characters/i, `رمز عبور باید حداقل ${MIN_PASSWORD_LENGTH.toLocaleString("fa-IR")} کاراکتر باشد.`],
  [/too common/i, "این رمز عبور خیلی رایج است؛ رمز دیگری انتخاب کنید."],
  [/entirely numeric/i, "رمز عبور نمی‌تواند فقط عدد باشد."],
  [/must contain|not complex/i, "رمز عبور باید حرف کوچک و بزرگ انگلیسی، عدد و نشانه داشته باشد."],
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
