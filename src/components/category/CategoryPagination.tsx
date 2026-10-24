type CategoryPaginationProps = {
  page: number;
  total: number;
  onChange: (page: number) => void;
};

/**
 * صفحه‌بندی فهرست محصولات.
 *
 * قبلاً شمارهٔ همهٔ صفحه‌ها کنار هم چاپ می‌شد: دستهٔ «قالب‌ها» با ۱۴۵
 * محصول یعنی ۱۹ دکمه در یک ردیف، که در موبایل از عرض صفحه بیرون
 * می‌زد. حالا فقط چند شمارهٔ دور صفحهٔ فعلی نشان داده می‌شود.
 */
function pageWindow(page: number, total: number): number[] {
  const span = 1;
  const start = Math.max(1, Math.min(page - span, total - span * 2));
  const end = Math.min(total, Math.max(page + span, span * 2 + 1));

  const pages: number[] = [];
  for (let value = start; value <= end; value += 1) pages.push(value);
  return pages;
}

const fa = (value: number) => value.toLocaleString("fa-IR");

const STEP =
  "min-h-9 rounded-lg border border-[#e6d8ef] bg-white px-3 text-sm text-[#5b2a63] transition hover:bg-[#f8f2fb] disabled:cursor-not-allowed disabled:opacity-40";

export function CategoryPagination({
  page,
  total,
  onChange,
}: CategoryPaginationProps) {
  if (total <= 1) return null;

  const pages = pageWindow(page, total);

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className={STEP}
      >
        قبلی
      </button>

      {pages[0] > 1 ? <span className="text-sm text-[#6b5b73]">…</span> : null}

      {pages.map((item) => (
        <button
          key={item}
          type="button"
          aria-current={item === page ? "page" : undefined}
          onClick={() => onChange(item)}
          className={`flex size-9 items-center justify-center rounded-lg text-sm font-bold transition ${
            item === page
              ? "bg-brand text-white"
              : "border border-[#e6d8ef] bg-white text-[#5b2a63] hover:bg-[#f8f2fb]"
          }`}
        >
          {fa(item)}
        </button>
      ))}

      {pages[pages.length - 1] < total ? (
        <span className="text-sm text-[#6b5b73]">…</span>
      ) : null}

      <button
        type="button"
        onClick={() => onChange(Math.min(total, page + 1))}
        disabled={page >= total}
        className={STEP}
      >
        بعدی
      </button>

      <span className="w-full text-center text-xs text-[#6b5b73]">
        صفحهٔ {fa(page)} از {fa(total)}
      </span>
    </div>
  );
}
