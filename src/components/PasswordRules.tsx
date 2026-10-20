"use client";

import { checkPassword } from "@/lib/password";

/**
 * قانون‌های رمز عبور، با تیک خوردن همزمان با تایپ.
 *
 * تا وقتی چیزی تایپ نشده خاکستری‌اند؛ این‌طور کاربر از اول می‌داند چه
 * چیزی لازم است، نه اینکه بعد از زدن دکمه پیام خطا بگیرد.
 */
export function PasswordRules({
  password,
  className = "",
}: {
  password: string;
  className?: string;
}) {
  const rules = checkPassword(password);
  const touched = password.length > 0;

  return (
    <ul className={`space-y-1 text-right text-xs ${className}`}>
      {rules.map((rule) => (
        <li
          key={rule.id}
          className={`flex items-center justify-end gap-1.5 ${
            !touched ? "text-muted" : rule.ok ? "text-[#2f6b45]" : "text-[#9b3d3d]"
          }`}
        >
          <span>{rule.label}</span>
          <span aria-hidden className="w-3.5 shrink-0 text-center">
            {!touched ? "•" : rule.ok ? "✓" : "✕"}
          </span>
        </li>
      ))}
    </ul>
  );
}
