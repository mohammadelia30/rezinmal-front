"use client";

import { useMemo, useState } from "react";

/**
 * جست‌وجوی جدول‌های پنل.
 *
 * فیلتر روی داده‌ای که همان صفحه گرفته انجام می‌شود، پس نتیجه فوری است
 * و رفت‌وبرگشت به سرور ندارد. برای جدول‌هایی که روزی خیلی بزرگ شوند
 * باید به فیلتر سمت سرور تبدیل شود.
 */
export function AdminSearch({
  value,
  onChange,
  placeholder = "جست‌وجو...",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="mb-4">
      <div className="relative">
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-h-11 w-full rounded-xl border border-[#e6dcc2] bg-white px-4 py-2.5 pe-10 text-right text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden
          className="pointer-events-none absolute end-3 top-1/2 size-5 -translate-y-1/2 text-muted"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

/** ارقام فارسی و عربی را به لاتین تبدیل می‌کند تا جست‌وجوی شماره کار کند. */
function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

/**
 * فیلتر کردن ردیف‌ها بر اساس چند فیلد.
 *
 * جست‌وجو به ارقام فارسی حساس نیست، پس «۰۹۱۲» هم شماره‌ای که با
 * «0912» ذخیره شده را پیدا می‌کند.
 */
export function useSearchFilter<T>(rows: T[], fields: (keyof T)[]) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = normalizeDigits(query).trim().toLowerCase();
    if (!needle) return rows;

    return rows.filter((row) =>
      fields.some((field) => {
        const value = row[field];
        if (value === null || value === undefined) return false;
        return normalizeDigits(String(value)).toLowerCase().includes(needle);
      }),
    );
  }, [rows, fields, query]);

  return { query, setQuery, filtered };
}
