"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { AdminDiscount, DiscountType } from "@/data/admin";
import {
  AdminBadge,
  AdminCard,
  AdminEmpty,
  AdminPageHeader,
  AdminTable,
} from "@/components/admin/AdminUI";
import {
  AdminActionError,
  createCoupon,
  deleteCoupon,
  setCouponActive,
  updateCoupon,
} from "@/lib/admin-store";
import { formatProductPrice } from "@/lib/price";

export function AdminDiscountsPage({
  discounts,
}: {
  discounts: AdminDiscount[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const items = discounts;
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [type, setType] = useState<DiscountType>("percent");
  const [value, setValue] = useState("");
  const [maxUses, setMaxUses] = useState("100");
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState("");

  const refresh = () => startTransition(() => router.refresh());

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedCode = code.trim().toUpperCase();
    const numericValue = Number(value);
    const numericMax = Number(maxUses);

    if (!trimmedCode) {
      setError("کد تخفیف را وارد کنید.");
      return;
    }
    if (!numericValue || numericValue <= 0) {
      setError("مقدار تخفیف معتبر نیست.");
      return;
    }
    if (type === "percent" && numericValue > 100) {
      setError("درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد.");
      return;
    }
    if (!numericMax || numericMax < 1) {
      setError("سقف استفاده معتبر نیست.");
      return;
    }

    try {
      const payload = {
        code: trimmedCode,
        type,
        value: numericValue,
        maxUses: numericMax,
        expiresAt: expiresAt.trim(),
      };
      if (editingId) {
        await updateCoupon(editingId, payload);
      } else {
        await createCoupon(payload);
      }
    } catch (creationError) {
      setError(
        creationError instanceof AdminActionError
          ? creationError.message
          : "ثبت کد تخفیف ناموفق بود.",
      );
      return;
    }

    refresh();
    setShowForm(false);
    setEditingId(null);
    setCode("");
    setValue("");
    setMaxUses("100");
    setExpiresAt("");
    setError("");
  };

  const toggleActive = async (id: string) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    try {
      await setCouponActive(id, !item.active);
      refresh();
    } catch (actionError) {
      setError(
        actionError instanceof AdminActionError
          ? actionError.message
          : "تغییر وضعیت ناموفق بود.",
      );
    }
  };

  const removeItem = async (id: string) => {
    try {
      await deleteCoupon(id);
      refresh();
    } catch (actionError) {
      setError(
        actionError instanceof AdminActionError
          ? actionError.message
          : "حذف کد تخفیف ناموفق بود.",
      );
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="کد تخفیف"
        description="ایجاد و مدیریت کدهای تخفیف فروشگاه"
        action={
          <button
            type="button"
            onClick={() => setShowForm((value) => !value)}
            className="rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            {showForm ? "بستن فرم" : "افزودن کد"}
          </button>
        }
      />

      {showForm ? (
        <AdminCard className="mb-5">
          <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-2">
            <div className="text-right">
              <label className="mb-1.5 block text-sm font-medium">کد</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-xl border border-[#e6dcc2] bg-[#fbf9f1] px-3 py-2.5 text-sm outline-none focus:border-brand"
                placeholder="WELCOME10"
                dir="ltr"
              />
            </div>
            <div className="text-right">
              <label className="mb-1.5 block text-sm font-medium">نوع</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as DiscountType)}
                className="w-full rounded-xl border border-[#e6dcc2] bg-[#fbf9f1] px-3 py-2.5 text-sm outline-none focus:border-brand"
              >
                <option value="percent">درصدی</option>
                <option value="fixed">مبلغ ثابت</option>
              </select>
            </div>
            <div className="text-right">
              <label className="mb-1.5 block text-sm font-medium">
                {type === "percent" ? "درصد" : "مبلغ (تومان)"}
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full rounded-xl border border-[#e6dcc2] bg-[#fbf9f1] px-3 py-2.5 text-sm outline-none focus:border-brand"
                placeholder={type === "percent" ? "10" : "50000"}
                dir="ltr"
              />
            </div>
            <div className="text-right">
              <label className="mb-1.5 block text-sm font-medium">سقف استفاده</label>
              <input
                type="number"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                className="w-full rounded-xl border border-[#e6dcc2] bg-[#fbf9f1] px-3 py-2.5 text-sm outline-none focus:border-brand"
                dir="ltr"
              />
            </div>
            <div className="text-right sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium">تاریخ انقضا</label>
              <input
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full rounded-xl border border-[#e6dcc2] bg-[#fbf9f1] px-3 py-2.5 text-sm outline-none focus:border-brand"
                placeholder="۱۴۰۴/۰۶/۳۰"
              />
            </div>
            {error ? (
              <p className="text-right text-xs text-red-500 sm:col-span-2">{error}</p>
            ) : null}
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-brand py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark sm:w-auto sm:px-6"
              >
                ذخیره کد تخفیف
              </button>
            </div>
          </form>
        </AdminCard>
      ) : null}

      {items.length === 0 ? (
        <AdminEmpty message="هنوز کد تخفیفی ثبت نشده است." />
      ) : (
        <AdminTable
          headers={[
            "کد",
            "نوع",
            "مقدار",
            "استفاده",
            "انقضا",
            "وضعیت",
            "عملیات",
          ]}
        >
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-[#efe6d4] text-right last:border-b-0"
            >
              <td className="px-4 py-3 font-bold" dir="ltr">
                {item.code}
              </td>
              <td className="px-4 py-3">
                {item.type === "percent" ? "درصدی" : "مبلغ ثابت"}
              </td>
              <td className="px-4 py-3 text-brand font-bold">
                {item.type === "percent"
                  ? `${item.value.toLocaleString("fa-IR")}٪`
                  : formatProductPrice(item.value)}
              </td>
              <td className="px-4 py-3">
                {item.used.toLocaleString("fa-IR")} /{" "}
                {item.maxUses.toLocaleString("fa-IR")}
              </td>
              <td className="px-4 py-3 text-muted">{item.expiresAt}</td>
              <td className="px-4 py-3">
                <AdminBadge
                  className={
                    item.active
                      ? "bg-[#e4f5ea] text-[#2f6b45]"
                      : "bg-[#fde8e8] text-[#9b3d3d]"
                  }
                >
                  {item.active ? "فعال" : "غیرفعال"}
                </AdminBadge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(item.id);
                      setCode(item.code);
                      setType(item.type);
                      setValue(String(item.value));
                      setMaxUses(String(item.maxUses));
                      setExpiresAt("");
                      setShowForm(true);
                      setError("");
                    }}
                    className="rounded-lg border border-[#e6dcc2] px-2.5 py-1 text-xs"
                  >
                    ویرایش
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleActive(item.id)}
                    className="rounded-lg border border-[#e6dcc2] px-2.5 py-1 text-xs"
                  >
                    {item.active ? "غیرفعال" : "فعال"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="rounded-lg border border-[#f0cfcf] px-2.5 py-1 text-xs text-[#8a3a3a]"
                  >
                    حذف
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  );
}
