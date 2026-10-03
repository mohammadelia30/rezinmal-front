"use client";

import { useState } from "react";

/**
 * کادر رمز با دکمهٔ چشم.
 *
 * رمز روی موبایل زیاد غلط تایپ می‌شود و کاربر راهی برای دیدن نوشته‌اش
 * ندارد. خودِ کادر وضعیت نمایش را نگه می‌دارد تا فرم‌ها درگیر آن نشوند.
 */
export function PasswordInput({
  value,
  onChange,
  className = "",
  id,
  placeholder,
  autoComplete,
  togglePadding = "px-3",
}: {
  value: string;
  onChange: (value: string) => void;
  /** کلاس کادر؛ هر فرم ظاهر خودش را دارد */
  className?: string;
  id?: string;
  placeholder?: string;
  autoComplete?: string;
  togglePadding?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className={className}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        // کادر رمز لاتین است؛ دکمه سمت چپ می‌نشیند تا روی متن نیفتد
        className={`absolute inset-y-0 left-0 flex items-center text-muted transition hover:text-brand ${togglePadding}`}
        aria-label={visible ? "پنهان کردن رمز" : "نمایش رمز"}
        aria-pressed={visible}
        title={visible ? "پنهان کردن رمز" : "نمایش رمز"}
        tabIndex={-1}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden
    >
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden
    >
      <path d="M4 4l16 16" />
      <path d="M9.9 5.8A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.6 3.4" />
      <path d="M6.6 7.9A16.6 16.6 0 0 0 2.5 12S6 18.5 12 18.5c1.3 0 2.5-.3 3.5-.8" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}
