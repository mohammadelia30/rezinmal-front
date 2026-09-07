"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AdminBadge,
  AdminButton,
  AdminError,
  AdminField,
  AdminModal,
  AdminPageHeader,
  AdminSelect,
  AdminTable,
} from "@/components/admin/AdminUI";
import { AdminSearch, useSearchFilter } from "@/components/admin/AdminSearch";
import type { InventoryRow, VariantOption } from "@/lib/api/admin";
import {
  AdminActionError,
  changeStock,
  createInventory,
  setMinimumStock,
} from "@/lib/admin-store";

/**
 * موجودی انبار.
 *
 * افزایش و کاهش از اکشن‌های خود بک‌اند استفاده می‌کند تا رزروها و
 * هشدار موجودی کم درست محاسبه شوند؛ نوشتن مستقیم عدد موجودی این
 * منطق را دور می‌زد.
 */
export function AdminInventoryPage({
  rows,
  variants,
}: {
  rows: InventoryRow[];
  variants: VariantOption[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ variantId: "", stock: "0", minimum: "0" });

  // فقط واریانت‌هایی که هنوز رکورد موجودی ندارند؛ هر واریانت بیش از
  // یک موجودی نمی‌تواند داشته باشد (رابطه یک‌به‌یک است).
  const withInventory = new Set(rows.map((row) => row.variantId));
  const available = variants.filter((item) => !withInventory.has(item.id));

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.variantId) {
      setError("محصول را انتخاب کنید.");
      return;
    }

    setError("");
    setBusyId("new");
    try {
      await createInventory(
        form.variantId,
        Number(form.stock) || 0,
        Number(form.minimum) || 0,
      );
      setOpen(false);
      setForm({ variantId: "", stock: "0", minimum: "0" });
      router.refresh();
    } catch (actionError) {
      setError(
        actionError instanceof AdminActionError
          ? actionError.message
          : "ثبت موجودی ناموفق بود.",
      );
    } finally {
      setBusyId(null);
    }
  };
  const { query, setQuery, filtered } = useSearchFilter(rows, [
    "productTitle",
    "sku",
  ]);

  const lowCount = rows.filter((row) => row.isLow).length;

  const run = async (id: string, action: () => Promise<void>) => {
    setError("");
    setBusyId(id);
    try {
      await action();
      router.refresh();
    } catch (actionError) {
      setError(
        actionError instanceof AdminActionError
          ? actionError.message
          : "انجام عملیات ناموفق بود.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const ask = (title: string, initial = "1") => {
    const value = window.prompt(title, initial);
    if (value === null) return null;
    const numeric = Number(value.replace(/\D/g, ""));
    return numeric > 0 ? numeric : null;
  };

  return (
    <div>
      <AdminPageHeader
        title="موجودی انبار"
        description={
          lowCount > 0
            ? `${lowCount.toLocaleString("fa-IR")} قلم زیر حد نصاب موجودی است`
            : "موجودی و حد نصاب هر کالا"
        }
        action={
          available.length > 0 ? (
            <AdminButton
              onClick={() => {
                setForm({ variantId: "", stock: "0", minimum: "0" });
                setError("");
                setOpen(true);
              }}
            >
              ثبت موجودی محصول
            </AdminButton>
          ) : undefined
        }
      />

      <AdminError message={error} />

      <AdminSearch
        value={query}
        onChange={setQuery}
        placeholder="جست‌وجو بر اساس نام محصول یا کد کالا"
      />

      {filtered.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-muted shadow-[0_4px_20px_rgba(78,42,84,0.06)]">
          {rows.length === 0
            ? available.length > 0
              ? "هنوز برای هیچ محصولی موجودی ثبت نشده است. با دکمهٔ «ثبت موجودی محصول» شروع کنید."
              : "ابتدا یک محصول بسازید تا بتوانید برایش موجودی ثبت کنید."
            : "موردی با این جست‌وجو پیدا نشد."}
        </p>
      ) : (
        <AdminTable
          minWidth={880}
          headers={[
            "محصول",
            "کد کالا",
            "موجودی",
            "رزرو",
            "قابل فروش",
            "حد نصاب",
            "عملیات",
          ]}
        >
          {filtered.map((row) => {
            const busy = busyId === row.id;

            return (
              <tr
                key={row.id}
                className="border-b border-[#efe6d4] text-right last:border-b-0"
              >
                <td className="px-4 py-3 font-bold text-foreground">
                  {row.productTitle}
                </td>
                <td className="px-4 py-3 text-muted" dir="ltr">
                  {row.sku}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {row.isLow ? (
                      <AdminBadge className="bg-[#fde8e8] text-[#9b3d3d]">
                        کم
                      </AdminBadge>
                    ) : null}
                    <span className="font-bold">
                      {row.stock.toLocaleString("fa-IR")}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">
                  {row.reserved.toLocaleString("fa-IR")}
                </td>
                <td className="px-4 py-3 font-bold text-brand">
                  {row.available.toLocaleString("fa-IR")}
                </td>
                <td className="px-4 py-3 text-muted">
                  {row.minimum.toLocaleString("fa-IR")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-end gap-1.5">
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      disabled={busy}
                      onClick={() => {
                        const qty = ask("چه تعداد اضافه شود؟");
                        if (qty) run(row.id, () => changeStock(row.id, qty, "increase"));
                      }}
                    >
                      افزایش
                    </AdminButton>
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      disabled={busy}
                      onClick={() => {
                        const qty = ask("چه تعداد کم شود؟");
                        if (qty) run(row.id, () => changeStock(row.id, qty, "decrease"));
                      }}
                    >
                      کاهش
                    </AdminButton>
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      disabled={busy}
                      onClick={() => {
                        const min = ask("حد نصاب جدید:", String(row.minimum));
                        if (min !== null) {
                          run(row.id, () => setMinimumStock(row.id, min));
                        }
                      }}
                    >
                      حد نصاب
                    </AdminButton>
                  </div>
                </td>
              </tr>
            );
          })}
        </AdminTable>
      )}

      {open ? (
        <AdminModal title="ثبت موجودی محصول" onClose={() => setOpen(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <AdminError message={error} />

            <AdminSelect
              label="محصول"
              value={form.variantId}
              onChange={(value) => setForm({ ...form, variantId: value })}
              placeholder="انتخاب کنید"
              options={available.map((item) => ({
                value: item.id,
                label: item.label,
              }))}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField
                label="موجودی اولیه"
                value={form.stock}
                onChange={(value) =>
                  setForm({ ...form, stock: value.replace(/\D/g, "") })
                }
                dir="ltr"
              />
              <AdminField
                label="حد نصاب هشدار"
                value={form.minimum}
                onChange={(value) =>
                  setForm({ ...form, minimum: value.replace(/\D/g, "") })
                }
                dir="ltr"
              />
            </div>

            <p className="text-right text-xs text-muted">
              وقتی موجودی به حد نصاب برسد، هشدارش در صندوق پیام مدیر ثبت
              می‌شود.
            </p>

            <div className="flex justify-end gap-2">
              <AdminButton
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={busyId === "new"}
              >
                انصراف
              </AdminButton>
              <AdminButton type="submit" disabled={busyId === "new"}>
                {busyId === "new" ? "در حال ثبت..." : "ثبت"}
              </AdminButton>
            </div>
          </form>
        </AdminModal>
      ) : null}
    </div>
  );
}
