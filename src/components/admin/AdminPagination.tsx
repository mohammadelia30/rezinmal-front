"use client";

import { useMemo, useState } from "react";

/**
 * صفحه‌بندی جدول‌های پنل.
 *
 * تعداد ردیف‌ها با همان ۲۵ تایی است که پنل جنگو استفاده می‌کند. برش
 * روی داده‌ای انجام می‌شود که همان صفحه قبلاً گرفته است، پس حرکت بین
 * صفحه‌ها رفت‌وبرگشت به سرور ندارد؛ اگر روزی فهرست‌ها خیلی بزرگ شوند
 * باید به صفحه‌بندی سمت سرور تبدیل شود.
 */

export const ADMIN_PAGE_SIZE = 25;

export function usePagination<T>(rows: T[], perPage = ADMIN_PAGE_SIZE) {
  const [page, setPage] = useState(1);
  const [knownCount, setKnownCount] = useState(rows.length);

  // با عوض شدن نتیجهٔ جست‌وجو یا حذف یک ردیف، ماندن روی صفحهٔ قبلی
  // یعنی جدول خالی دیده شود. این تنظیم حین رندر انجام می‌شود، نه در
  // useEffect، تا یک رندر اضافه با جدول اشتباه نمایش داده نشود.
  if (knownCount !== rows.length) {
    setKnownCount(rows.length);
    setPage(1);
  }

  const pageCount = Math.max(1, Math.ceil(rows.length / perPage));
  const current = Math.min(page, pageCount);

  const items = useMemo(
    () => rows.slice((current - 1) * perPage, current * perPage),
    [rows, current, perPage],
  );

  return {
    items,
    page: current,
    pageCount,
    setPage,
    total: rows.length,
    from: rows.length === 0 ? 0 : (current - 1) * perPage + 1,
    to: Math.min(current * perPage, rows.length),
  };
}

const fa = (value: number) => value.toLocaleString("fa-IR");

/** شماره‌های دور صفحهٔ فعلی؛ برای فهرست‌های بلند همه را نشان نمی‌دهیم */
function pageWindow(page: number, pageCount: number): number[] {
  const span = 2;
  const start = Math.max(1, Math.min(page - span, pageCount - span * 2));
  const end = Math.min(pageCount, Math.max(page + span, span * 2 + 1));

  const pages: number[] = [];
  for (let value = start; value <= end; value += 1) pages.push(value);
  return pages;
}

const BUTTON =
  "min-h-9 min-w-9 rounded-lg border px-3 text-sm transition disabled:cursor-not-allowed disabled:opacity-40";

/** همان چیزی که usePagination برمی‌گرداند، بدون ردیف‌ها */
export type Pager = {
  page: number;
  pageCount: number;
  total: number;
  from: number;
  to: number;
  setPage: (page: number) => void;
};

export function AdminPagination({ pager }: { pager: Pager }) {
  const { page, pageCount, total, from, to, setPage: onChange } = pager;

  // یک صفحه که بیشتر نیست، نواری هم لازم نیست
  if (pageCount <= 1) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          className={`${BUTTON} border-[#e6dcc2] bg-white hover:border-brand/50`}
        >
          قبلی
        </button>

        {pageWindow(page, pageCount).map((value) => (
          <button
            key={value}
            type="button"
            aria-current={value === page ? "page" : undefined}
            onClick={() => onChange(value)}
            className={`${BUTTON} ${
              value === page
                ? "border-brand bg-brand text-white"
                : "border-[#e6dcc2] bg-white hover:border-brand/50"
            }`}
          >
            {fa(value)}
          </button>
        ))}

        <button
          type="button"
          disabled={page === pageCount}
          onClick={() => onChange(page + 1)}
          className={`${BUTTON} border-[#e6dcc2] bg-white hover:border-brand/50`}
        >
          بعدی
        </button>
      </div>

      <p className="text-xs text-muted">
        نمایش {fa(from)} تا {fa(to)} از {fa(total)}
      </p>
    </div>
  );
}
