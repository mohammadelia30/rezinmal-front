"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  AdminButton,
  AdminCard,
  AdminError,
  AdminField,
} from "@/components/admin/AdminUI";
import type { AdminCategoryRow, AdminProductDetail } from "@/lib/api/admin";
import { changeVariantPrices } from "@/lib/admin-store";
import { toEnglishDigits } from "@/lib/digits";

/**
 * افزایش گروهی قیمت بر اساس دسته.
 *
 * همان کاری که آقای کمال در پنل جنگو گذاشته، این‌جا هم هست. تفاوت
 * مهمش را پنهان نمی‌کنیم: آن‌جا یک دستور اتمیک است و این‌جا برای هر
 * نسخه یک درخواست می‌رود، پس قطع‌شدن وسط کار یعنی نیمی از قیمت‌ها
 * عوض شده‌اند. به همین خاطر پیش از اجرا دقیقاً نوشته می‌شود چند نسخه
 * تغییر می‌کند و بعدش هم تعداد موفق و ناموفق.
 */

const fa = (value: number) => value.toLocaleString("fa-IR");

export function AdminBulkPrice({
  categories,
  products,
}: {
  categories: AdminCategoryRow[];
  products: AdminProductDetail[];
}) {
  const router = useRouter();
  const [picked, setPicked] = useState<string[]>([]);
  const [percent, setPercent] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  const percentValue = Number(toEnglishDigits(percent).replace(/[^\d.]/g, ""));

  /** نسخه‌هایی که با انتخاب فعلی قیمتشان عوض می‌شود */
  const targets = useMemo(() => {
    if (picked.length === 0) return [];
    const wanted = new Set(picked);

    return products
      .filter((product) =>
        product.categoryIds.some((id) => wanted.has(id)),
      )
      .flatMap((product) =>
        product.variants
          .filter((variant) => variant.price > 0)
          .map((variant) => ({ id: variant.id, price: variant.price })),
      );
  }, [picked, products]);

  const productCount = useMemo(() => {
    if (picked.length === 0) return 0;
    const wanted = new Set(picked);
    return products.filter((product) =>
      product.categoryIds.some((id) => wanted.has(id)),
    ).length;
  }, [picked, products]);

  const toggle = (id: string) =>
    setPicked((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );

  const apply = async () => {
    setError("");
    setResult("");

    if (targets.length === 0) {
      setError("هیچ محصولی در دسته‌های انتخاب‌شده نیست.");
      return;
    }
    if (!percentValue || percentValue <= 0) {
      setError("درصد افزایش را وارد کنید، مثلاً ۱۰.");
      return;
    }

    const sample = targets[0];
    const confirmed = window.confirm(
      `قیمت ${fa(targets.length)} نسخه از ${fa(productCount)} محصول ` +
        `${fa(percentValue)}٪ افزایش پیدا می‌کند.\n\n` +
        `مثال: ${fa(sample.price)} تومان ← ` +
        `${fa(Math.round(sample.price * (1 + percentValue / 100)))} تومان\n\n` +
        "این کار برگشت‌پذیر نیست. ادامه می‌دهید؟",
    );
    if (!confirmed) return;

    setBusy(true);
    setProgress({ done: 0, total: targets.length });

    const outcome = await changeVariantPrices(
      targets,
      percentValue,
      (done, total) => setProgress({ done, total }),
    );

    setBusy(false);
    setResult(
      outcome.failed === 0
        ? `قیمت ${fa(outcome.updated)} نسخه با موفقیت تغییر کرد.`
        : `${fa(outcome.updated)} نسخه تغییر کرد و ${fa(outcome.failed)} نسخه ناموفق ماند. دوباره تلاش کنید؛ نسخه‌های موفق دوباره افزایش پیدا می‌کنند، پس بهتر است اول فهرست را بررسی کنید.`,
    );
    setPercent("");
    setPicked([]);
    router.refresh();
  };

  return (
    <AdminCard className="mt-5">
      <div className="mb-3 text-right">
        <h2 className="text-sm font-bold text-foreground">
          افزایش گروهی قیمت
        </h2>
        <p className="mt-1 text-xs leading-6 text-muted">
          دسته‌ها را انتخاب کنید و درصد افزایش را بنویسید؛ قیمت همهٔ
          نسخه‌های محصول‌های آن دسته‌ها با هم زیاد می‌شود. قیمت‌های حراج
          دست‌نخورده می‌مانند.
        </p>
      </div>

      <div className="mb-3 flex flex-wrap justify-end gap-2">
        {categories.map((category) => {
          const active = picked.includes(category.id);

          return (
            <button
              key={category.id}
              type="button"
              disabled={busy}
              onClick={() => toggle(category.id)}
              aria-pressed={active}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? "border-brand bg-brand text-white"
                  : "border-[#e6dcc2] bg-white text-foreground hover:border-brand/50"
              }`}
            >
              {category.title}
            </button>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-[160px_1fr] sm:items-end">
        <AdminField
          label="درصد افزایش"
          value={percent}
          dir="ltr"
          placeholder="۱۰"
          onChange={setPercent}
        />

        <div className="flex flex-wrap items-center justify-end gap-3">
          {picked.length > 0 ? (
            <span className="text-xs text-muted">
              {targets.length > 0
                ? `${fa(productCount)} محصول، ${fa(targets.length)} نسخه`
                : "محصولی در این دسته‌ها نیست"}
            </span>
          ) : null}

          <AdminButton
            disabled={busy || picked.length === 0}
            onClick={apply}
          >
            {busy
              ? `در حال تغییر… ${fa(progress.done)} از ${fa(progress.total)}`
              : "اعمال افزایش"}
          </AdminButton>
        </div>
      </div>

      {error ? <AdminError message={error} /> : null}

      {result ? (
        <p className="mt-3 rounded-xl bg-[#eaf5ee] px-4 py-2.5 text-right text-xs leading-6 text-[#2f6b45]">
          {result}
        </p>
      ) : null}
    </AdminCard>
  );
}
