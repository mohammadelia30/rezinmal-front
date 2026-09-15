"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type {
  AdminCoupon,
  AdminProductDiscount,
  DiscountType,
} from "@/data/admin";
import {
  AdminBadge,
  AdminButton,
  AdminEmpty,
  AdminError,
  AdminModal,
  AdminPageHeader,
  AdminSelect,
  AdminTable,
} from "@/components/admin/AdminUI";
import { AdminSearch, useSearchFilter } from "@/components/admin/AdminSearch";
import {
  AdminActionError,
  createCoupon,
  createProductDiscount,
  deleteCoupon,
  deleteProductDiscount,
  setCouponActive,
  setProductDiscountActive,
  updateCoupon,
  updateProductDiscount,
} from "@/lib/admin-store";
import { formatProductPrice } from "@/lib/price";
import { formatJalali, todayInTehran } from "@/lib/tehran-date";

type Option = { id: string; title: string };
type Level = { id: string; name: string };
type Tab = "coupons" | "products";

const INPUT =
  "min-h-11 w-full rounded-xl border border-[#e6dcc2] bg-[#fbf9f1] px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15";

function errorText(error: unknown, fallback: string) {
  return error instanceof AdminActionError ? error.message : fallback;
}

function amountLabel(type: DiscountType, value: number) {
  return type === "percentage"
    ? `${value.toLocaleString("fa-IR")}٪`
    : formatProductPrice(value);
}

/** بازهٔ اعتبار برای جدول: «از … تا …» */
function periodLabel(startsAt: string, expiresAt: string) {
  if (!startsAt && !expiresAt) return "بدون محدودیت";
  if (!startsAt) return `تا ${formatJalali(expiresAt)}`;
  if (!expiresAt) return `از ${formatJalali(startsAt)}`;
  return `${formatJalali(startsAt)} تا ${formatJalali(expiresAt)}`;
}

type State = "active" | "scheduled" | "expired" | "inactive";

function stateOf(active: boolean, startsAt: string, expiresAt: string): State {
  if (!active) return "inactive";
  const today = todayInTehran();
  if (expiresAt && expiresAt < today) return "expired";
  if (startsAt && startsAt > today) return "scheduled";
  return "active";
}

const STATE_BADGE: Record<State, { label: string; className: string }> = {
  active: { label: "فعال", className: "bg-[#e4f5ea] text-[#2f6b45]" },
  scheduled: { label: "زمان‌بندی‌شده", className: "bg-[#e0eefc] text-[#1f5a8a]" },
  expired: { label: "منقضی", className: "bg-[#f1ede4] text-[#6b6358]" },
  inactive: { label: "غیرفعال", className: "bg-[#fde8e8] text-[#9b3d3d]" },
};

/**
 * تخفیف‌ها دو چیز متفاوت‌اند و در بک‌اند هم دو مدل جدا دارند:
 *
 * - کد تخفیف: مشتری کد را در تسویه‌حساب وارد می‌کند؛ برای همهٔ کاربران
 *   یا اعضای سطح‌هایی از باشگاه مشتریان.
 * - تخفیف محصول: کد ندارد و خودکار قیمت یک محصول یا دسته را کم می‌کند.
 *
 * قبلاً هر دو در یک فرم بودند و انتخاب محصول در فرم کد، به‌جای تخفیف
 * محصول یک کد تخفیفِ محدود به محصول می‌ساخت.
 */
export function AdminDiscountsPage({
  initialTab,
  coupons,
  productDiscounts,
  categories,
  products,
  levels,
}: {
  initialTab: Tab;
  coupons: AdminCoupon[];
  productDiscounts: AdminProductDiscount[];
  categories: Option[];
  products: Option[];
  levels: Level[];
}) {
  const [tab, setTab] = useState<Tab>(initialTab);

  const selectTab = (next: Tab) => {
    setTab(next);
    // بعد از refresh یا اشتراک لینک، همان زبانه باز بماند
    const url = new URL(window.location.href);
    url.searchParams.set("tab", next);
    window.history.replaceState(null, "", url);
  };

  return (
    <div>
      <AdminPageHeader
        title="تخفیف‌ها"
        description="کدهای تخفیف مشتریان و تخفیف مستقیم روی محصولات"
      />

      <div
        role="tablist"
        className="mb-5 inline-flex rounded-xl border border-[#e6dcc2] bg-white p-1"
      >
        {(
          [
            ["coupons", "کدهای تخفیف", coupons.length],
            ["products", "تخفیف محصولات", productDiscounts.length],
          ] as const
        ).map(([key, label, count]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => selectTab(key)}
            className={`min-h-10 rounded-lg px-4 text-sm font-bold transition ${
              tab === key
                ? "bg-brand text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            {label}
            <span className="ms-1.5 text-xs opacity-75">
              ({count.toLocaleString("fa-IR")})
            </span>
          </button>
        ))}
      </div>

      {tab === "coupons" ? (
        <CouponsSection coupons={coupons} levels={levels} />
      ) : (
        <ProductDiscountsSection
          discounts={productDiscounts}
          products={products}
          categories={categories}
        />
      )}
    </div>
  );
}

// ==========================================================
// کدهای تخفیف
// ==========================================================

type CouponForm = {
  code: string;
  type: DiscountType;
  value: string;
  usageLimit: string;
  startsAt: string;
  expiresAt: string;
  audience: "all" | "levels";
  levelIds: string[];
};

const EMPTY_COUPON: CouponForm = {
  code: "",
  type: "percentage",
  value: "",
  usageLimit: "",
  startsAt: "",
  expiresAt: "",
  audience: "all",
  levelIds: [],
};

function CouponsSection({
  coupons,
  levels,
}: {
  coupons: AdminCoupon[];
  levels: Level[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<AdminCoupon | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CouponForm>(EMPTY_COUPON);
  const [error, setError] = useState("");
  const [listError, setListError] = useState("");
  const [busy, setBusy] = useState(false);
  const { query, setQuery, filtered } = useSearchFilter(coupons, ["code"]);

  const levelName = new Map(levels.map((level) => [level.id, level.name]));
  const lockedLevels = editing?.levelIds ?? [];

  const set = <K extends keyof CouponForm>(key: K, value: CouponForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_COUPON);
    setError("");
    setOpen(true);
  };

  const openEdit = (coupon: AdminCoupon) => {
    setEditing(coupon);
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: String(coupon.value),
      usageLimit: coupon.usageLimit === null ? "" : String(coupon.usageLimit),
      startsAt: coupon.startsAt,
      expiresAt: coupon.expiresAt,
      audience: coupon.levelIds.length > 0 ? "levels" : "all",
      levelIds: coupon.levelIds,
    });
    setError("");
    setOpen(true);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    const code = form.code.trim().toUpperCase();
    const value = Number(form.value);
    const usageLimit = form.usageLimit.trim() ? Number(form.usageLimit) : null;

    if (!/^[A-Z0-9_-]{3,50}$/.test(code)) {
      setError("کد باید ۳ تا ۵۰ حرف انگلیسی، عدد، خط تیره یا زیرخط باشد.");
      return;
    }
    if (!Number.isInteger(value) || value <= 0) {
      setError("مقدار تخفیف معتبر نیست.");
      return;
    }
    if (form.type === "percentage" && value > 100) {
      setError("درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد.");
      return;
    }
    if (usageLimit !== null && (!Number.isInteger(usageLimit) || usageLimit < 1)) {
      setError("سقف استفاده باید عددی بزرگ‌تر از صفر باشد، یا خالی بماند.");
      return;
    }
    if (form.startsAt && form.expiresAt && form.expiresAt < form.startsAt) {
      setError("تاریخ پایان باید بعد از تاریخ شروع باشد.");
      return;
    }
    if (form.audience === "levels" && form.levelIds.length === 0) {
      setError("حداقل یک سطح باشگاه انتخاب کنید.");
      return;
    }

    const input = {
      code,
      type: form.type,
      value,
      usageLimit,
      startsAt: form.startsAt,
      expiresAt: form.expiresAt,
      levelIds: form.audience === "levels" ? form.levelIds : [],
    };

    setBusy(true);
    setError("");
    try {
      if (editing) {
        await updateCoupon(editing.id, input, editing.levelIds);
      } else {
        await createCoupon(input);
      }
      setOpen(false);
      router.refresh();
    } catch (submitError) {
      setError(errorText(submitError, "ذخیرهٔ کد تخفیف ناموفق بود."));
    } finally {
      setBusy(false);
    }
  };

  const run = async (action: () => Promise<void>, fallback: string) => {
    setListError("");
    try {
      await action();
      router.refresh();
    } catch (actionError) {
      setListError(errorText(actionError, fallback));
    }
  };

  return (
    <>
      <div className="mb-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-start sm:justify-between">
        <AdminButton onClick={openCreate}>افزودن کد تخفیف</AdminButton>
        <p className="max-w-xl text-right text-sm leading-6 text-muted">
          مشتری کد را هنگام پرداخت وارد می‌کند. کد روی محصولاتی که خودشان
          تخفیف محصول دارند اعمال نمی‌شود.
        </p>
      </div>

      {coupons.length > 0 ? (
        <AdminSearch value={query} onChange={setQuery} placeholder="جست‌وجوی کد تخفیف" />
      ) : null}

      <AdminError message={listError} />

      {filtered.length === 0 ? (
        <AdminEmpty
          message={coupons.length ? "کدی با این مشخصات پیدا نشد." : "هنوز کد تخفیفی ثبت نشده است."}
        />
      ) : (
        <AdminTable
          minWidth={900}
          headers={["کد", "مقدار", "مخاطب", "استفاده", "اعتبار", "وضعیت", "عملیات"]}
        >
          {filtered.map((coupon) => {
            const state = STATE_BADGE[stateOf(coupon.active, coupon.startsAt, coupon.expiresAt)];
            const audience = coupon.levelIds.length
              ? coupon.levelIds.map((id) => levelName.get(id) ?? "سطح حذف‌شده").join("، ")
              : coupon.userAssignments
                ? ""
                : "همهٔ کاربران";

            return (
              <tr key={coupon.id} className="border-b border-[#efe6d4] text-right last:border-b-0">
                <td className="px-4 py-3 font-bold" dir="ltr">
                  {coupon.code}
                </td>
                <td className="px-4 py-3 font-bold text-brand">
                  {amountLabel(coupon.type, coupon.value)}
                </td>
                <td className="px-4 py-3">
                  {audience}
                  {coupon.userAssignments ? (
                    <span className="block text-xs text-muted">
                      {coupon.userAssignments.toLocaleString("fa-IR")} کاربر مشخص
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {coupon.used.toLocaleString("fa-IR")}
                  {" / "}
                  {coupon.usageLimit === null ? "∞" : coupon.usageLimit.toLocaleString("fa-IR")}
                </td>
                <td className="px-4 py-3 text-muted">
                  {periodLabel(coupon.startsAt, coupon.expiresAt)}
                </td>
                <td className="px-4 py-3">
                  <AdminBadge className={state.className}>{state.label}</AdminBadge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <AdminButton size="sm" variant="ghost" onClick={() => openEdit(coupon)}>
                      ویرایش
                    </AdminButton>
                    <AdminButton
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        run(
                          () => setCouponActive(coupon.id, !coupon.active),
                          "تغییر وضعیت ناموفق بود.",
                        )
                      }
                    >
                      {coupon.active ? "غیرفعال" : "فعال"}
                    </AdminButton>
                    <AdminButton
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        if (!window.confirm(`کد ${coupon.code} حذف شود؟`)) return;
                        void run(() => deleteCoupon(coupon.id), "حذف کد تخفیف ناموفق بود.");
                      }}
                    >
                      حذف
                    </AdminButton>
                  </div>
                </td>
              </tr>
            );
          })}
        </AdminTable>
      )}

      {open ? (
        <AdminModal
          title={editing ? `ویرایش کد ${editing.code}` : "کد تخفیف جدید"}
          onClose={() => setOpen(false)}
        >
          <form onSubmit={submit} className="space-y-4">
            <AdminError message={error} />

            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput
                label="کد"
                value={form.code}
                onChange={(value) => set("code", value.toUpperCase())}
                placeholder="WELCOME10"
                dir="ltr"
              />
              <AmountInputs
                type={form.type}
                value={form.value}
                onType={(value) => set("type", value)}
                onValue={(value) => set("value", value)}
              />
              <TextInput
                label="سقف تعداد استفاده"
                hint="خالی = بدون سقف"
                value={form.usageLimit}
                onChange={(value) => set("usageLimit", value.replace(/\D/g, ""))}
                dir="ltr"
                inputMode="numeric"
              />
              <DateRange
                startsAt={form.startsAt}
                expiresAt={form.expiresAt}
                onStarts={(value) => set("startsAt", value)}
                onExpires={(value) => set("expiresAt", value)}
              />
            </div>

            <fieldset className="rounded-xl border border-[#efe6d4] p-4 text-right">
              <legend className="px-1 text-sm font-bold text-foreground">
                این کد برای چه کسانی است؟
              </legend>

              <div className="flex flex-wrap justify-end gap-2">
                {(
                  [
                    ["all", "همهٔ کاربران"],
                    ["levels", "سطح‌های باشگاه مشتریان"],
                  ] as const
                ).map(([key, label]) => {
                  // تخصیص سطح‌ها از پنل برداشته نمی‌شود؛ پس کدی که سطح دارد
                  // به «همهٔ کاربران» برنمی‌گردد
                  const disabled = key === "all" && lockedLevels.length > 0;
                  return (
                    <label
                      key={key}
                      className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm transition ${
                        form.audience === key
                          ? "border-brand bg-brand-mist/40 font-bold"
                          : "border-[#e6dcc2]"
                      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      <input
                        type="radio"
                        name="audience"
                        checked={form.audience === key}
                        disabled={disabled}
                        onChange={() => set("audience", key)}
                        className="accent-brand"
                      />
                      {label}
                    </label>
                  );
                })}
              </div>

              {form.audience === "levels" ? (
                levels.length === 0 ? (
                  <p className="mt-3 text-sm text-muted">
                    هنوز سطحی در باشگاه مشتریان تعریف نشده است.
                  </p>
                ) : (
                  <div className="mt-3 flex flex-wrap justify-end gap-2">
                    {levels.map((level) => {
                      const locked = lockedLevels.includes(level.id);
                      const checked = form.levelIds.includes(level.id);
                      return (
                        <label
                          key={level.id}
                          title={locked ? "کد برای اعضای این سطح صادر شده و قابل برداشتن نیست" : undefined}
                          className={`flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm ${
                            checked ? "border-brand bg-brand-mist/40" : "border-[#e6dcc2]"
                          } ${locked ? "opacity-70" : "cursor-pointer"}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={locked}
                            onChange={() =>
                              set(
                                "levelIds",
                                checked
                                  ? form.levelIds.filter((id) => id !== level.id)
                                  : [...form.levelIds, level.id],
                              )
                            }
                            className="accent-brand"
                          />
                          {level.name}
                        </label>
                      );
                    })}
                  </div>
                )
              ) : null}

              <p className="mt-3 text-xs leading-5 text-muted">
                {form.audience === "levels"
                  ? "کد به اعضای فعلی سطح‌های انتخاب‌شده داده می‌شود و در صندوق پیام‌شان اعلان می‌گیرند. فقط همین افراد می‌توانند از آن استفاده کنند."
                  : "هر کاربری که کد را داشته باشد، یک بار می‌تواند از آن استفاده کند."}
              </p>
            </fieldset>

            <div className="flex justify-end gap-2">
              <AdminButton variant="ghost" onClick={() => setOpen(false)} disabled={busy}>
                انصراف
              </AdminButton>
              <AdminButton type="submit" disabled={busy}>
                {busy ? "در حال ذخیره..." : "ذخیره"}
              </AdminButton>
            </div>
          </form>
        </AdminModal>
      ) : null}
    </>
  );
}

// ==========================================================
// تخفیف محصولات
// ==========================================================

type ProductDiscountForm = {
  targetKind: "product" | "category";
  targetId: string;
  type: DiscountType;
  value: string;
  startsAt: string;
  expiresAt: string;
};

const EMPTY_PRODUCT_DISCOUNT: ProductDiscountForm = {
  targetKind: "product",
  targetId: "",
  type: "percentage",
  value: "",
  startsAt: "",
  expiresAt: "",
};

function ProductDiscountsSection({
  discounts,
  products,
  categories,
}: {
  discounts: AdminProductDiscount[];
  products: Option[];
  categories: Option[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ProductDiscountForm>(EMPTY_PRODUCT_DISCOUNT);
  const [error, setError] = useState("");
  const [listError, setListError] = useState("");
  const [busy, setBusy] = useState(false);
  const { query, setQuery, filtered } = useSearchFilter(discounts, ["targetTitle"]);

  const set = <K extends keyof ProductDiscountForm>(key: K, value: ProductDiscountForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_PRODUCT_DISCOUNT);
    setError("");
    setOpen(true);
  };

  const openEdit = (discount: AdminProductDiscount) => {
    setEditingId(discount.id);
    setForm({
      targetKind: discount.targetKind,
      targetId: discount.targetId,
      type: discount.type,
      value: String(discount.value),
      startsAt: discount.startsAt,
      expiresAt: discount.expiresAt,
    });
    setError("");
    setOpen(true);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const value = Number(form.value);

    if (!form.targetId) {
      setError(form.targetKind === "product" ? "محصول را انتخاب کنید." : "دسته‌بندی را انتخاب کنید.");
      return;
    }
    if (!Number.isInteger(value) || value <= 0) {
      setError("مقدار تخفیف معتبر نیست.");
      return;
    }
    if (form.type === "percentage" && value > 100) {
      setError("درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد.");
      return;
    }
    if (form.startsAt && form.expiresAt && form.expiresAt < form.startsAt) {
      setError("تاریخ پایان باید بعد از تاریخ شروع باشد.");
      return;
    }

    const input = { ...form, value };

    setBusy(true);
    setError("");
    try {
      if (editingId) {
        await updateProductDiscount(editingId, input);
      } else {
        await createProductDiscount(input);
      }
      setOpen(false);
      router.refresh();
    } catch (submitError) {
      setError(errorText(submitError, "ذخیرهٔ تخفیف ناموفق بود."));
    } finally {
      setBusy(false);
    }
  };

  const run = async (action: () => Promise<void>, fallback: string) => {
    setListError("");
    try {
      await action();
      router.refresh();
    } catch (actionError) {
      setListError(errorText(actionError, fallback));
    }
  };

  const options = (form.targetKind === "product" ? products : categories).map((item) => ({
    value: item.id,
    label: item.title,
  }));

  return (
    <>
      <div className="mb-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-start sm:justify-between">
        <AdminButton onClick={openCreate}>افزودن تخفیف محصول</AdminButton>
        <p className="max-w-xl text-right text-sm leading-6 text-muted">
          بدون کد و خودکار روی قیمت اعمال می‌شود و مشتری قیمت قبل و بعد از
          تخفیف را روی سایت می‌بیند. اگر یک محصول چند تخفیف فعال داشته
          باشد، جدیدترین اعمال می‌شود.
        </p>
      </div>

      {discounts.length > 0 ? (
        <AdminSearch value={query} onChange={setQuery} placeholder="جست‌وجوی نام محصول یا دسته‌بندی" />
      ) : null}

      <AdminError message={listError} />

      {filtered.length === 0 ? (
        <AdminEmpty
          message={discounts.length ? "تخفیفی با این مشخصات پیدا نشد." : "هنوز تخفیفی روی محصولات ثبت نشده است."}
        />
      ) : (
        <AdminTable minWidth={820} headers={["روی", "مقدار", "اعتبار", "وضعیت", "عملیات"]}>
          {filtered.map((discount) => {
            const state = STATE_BADGE[stateOf(discount.active, discount.startsAt, discount.expiresAt)];
            return (
              <tr key={discount.id} className="border-b border-[#efe6d4] text-right last:border-b-0">
                <td className="px-4 py-3">
                  <span className="font-bold text-foreground">{discount.targetTitle}</span>
                  <span className="block text-xs text-muted">
                    {discount.targetKind === "product" ? "محصول" : "همهٔ محصولات دسته"}
                  </span>
                </td>
                <td className="px-4 py-3 font-bold text-brand">
                  {amountLabel(discount.type, discount.value)}
                </td>
                <td className="px-4 py-3 text-muted">
                  {periodLabel(discount.startsAt, discount.expiresAt)}
                </td>
                <td className="px-4 py-3">
                  <AdminBadge className={state.className}>{state.label}</AdminBadge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <AdminButton size="sm" variant="ghost" onClick={() => openEdit(discount)}>
                      ویرایش
                    </AdminButton>
                    <AdminButton
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        run(
                          () => setProductDiscountActive(discount.id, !discount.active),
                          "تغییر وضعیت ناموفق بود.",
                        )
                      }
                    >
                      {discount.active ? "غیرفعال" : "فعال"}
                    </AdminButton>
                    <AdminButton
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        if (!window.confirm(`تخفیف «${discount.targetTitle}» حذف شود؟`)) return;
                        void run(() => deleteProductDiscount(discount.id), "حذف تخفیف ناموفق بود.");
                      }}
                    >
                      حذف
                    </AdminButton>
                  </div>
                </td>
              </tr>
            );
          })}
        </AdminTable>
      )}

      {open ? (
        <AdminModal
          title={editingId ? "ویرایش تخفیف محصول" : "تخفیف محصول جدید"}
          onClose={() => setOpen(false)}
        >
          <form onSubmit={submit} className="space-y-4">
            <AdminError message={error} />

            <div className="flex flex-wrap justify-end gap-2">
              {(
                [
                  ["product", "یک محصول"],
                  ["category", "همهٔ محصولات یک دسته"],
                ] as const
              ).map(([key, label]) => (
                <label
                  key={key}
                  className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm transition ${
                    form.targetKind === key ? "border-brand bg-brand-mist/40 font-bold" : "border-[#e6dcc2]"
                  }`}
                >
                  <input
                    type="radio"
                    name="target-kind"
                    checked={form.targetKind === key}
                    onChange={() => setForm((current) => ({ ...current, targetKind: key, targetId: "" }))}
                    className="accent-brand"
                  />
                  {label}
                </label>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <AdminSelect
                  label={form.targetKind === "product" ? "محصول" : "دسته‌بندی"}
                  value={form.targetId}
                  onChange={(value) => set("targetId", value)}
                  placeholder="انتخاب کنید"
                  options={options}
                />
              </div>
              <AmountInputs
                type={form.type}
                value={form.value}
                onType={(value) => set("type", value)}
                onValue={(value) => set("value", value)}
              />
              <DateRange
                startsAt={form.startsAt}
                expiresAt={form.expiresAt}
                onStarts={(value) => set("startsAt", value)}
                onExpires={(value) => set("expiresAt", value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <AdminButton variant="ghost" onClick={() => setOpen(false)} disabled={busy}>
                انصراف
              </AdminButton>
              <AdminButton type="submit" disabled={busy}>
                {busy ? "در حال ذخیره..." : "ذخیره"}
              </AdminButton>
            </div>
          </form>
        </AdminModal>
      ) : null}
    </>
  );
}

// ==========================================================
// فیلدهای مشترک
// ==========================================================

function TextInput({
  label,
  hint,
  value,
  onChange,
  placeholder,
  dir,
  inputMode,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dir?: "ltr" | "rtl";
  inputMode?: "numeric";
}) {
  return (
    <label className="block text-right">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        dir={dir}
        inputMode={inputMode}
        className={INPUT}
      />
      {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

function AmountInputs({
  type,
  value,
  onType,
  onValue,
}: {
  type: DiscountType;
  value: string;
  onType: (value: DiscountType) => void;
  onValue: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_7.5rem] gap-2 text-right">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">
          {type === "percentage" ? "درصد تخفیف" : "مبلغ تخفیف (تومان)"}
        </span>
        <input
          value={value}
          onChange={(event) => onValue(event.target.value.replace(/\D/g, ""))}
          placeholder={type === "percentage" ? "10" : "50000"}
          dir="ltr"
          inputMode="numeric"
          className={INPUT}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">نوع</span>
        <select
          value={type}
          onChange={(event) => onType(event.target.value as DiscountType)}
          className={INPUT}
        >
          <option value="percentage">درصدی</option>
          <option value="fixed">مبلغ ثابت</option>
        </select>
      </label>
    </div>
  );
}

/**
 * input[type=date] تقویم میلادی نشان می‌دهد؛ معادل شمسی زیر هر فیلد
 * نوشته می‌شود تا مدیر مطمئن باشد چه روزی را انتخاب کرده.
 */
function DateRange({
  startsAt,
  expiresAt,
  onStarts,
  onExpires,
}: {
  startsAt: string;
  expiresAt: string;
  onStarts: (value: string) => void;
  onExpires: (value: string) => void;
}) {
  const field = (label: string, value: string, onChange: (value: string) => void, empty: string) => (
    <label className="block text-right">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <div className="flex gap-2">
        <input
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          dir="ltr"
          className={INPUT}
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label={`پاک کردن ${label}`}
            className="shrink-0 rounded-xl border border-[#e6dcc2] px-3 text-sm text-muted transition hover:bg-[#f6f1e7]"
          >
            ✕
          </button>
        ) : null}
      </div>
      <span className="mt-1 block text-xs text-muted">{value ? formatJalali(value) : empty}</span>
    </label>
  );

  return (
    <>
      {field("تاریخ شروع", startsAt, onStarts, "خالی = از همین حالا")}
      {field("تاریخ پایان", expiresAt, onExpires, "خالی = بدون تاریخ انقضا")}
    </>
  );
}
