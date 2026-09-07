"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AdminBadge,
  AdminButton,
  AdminError,
  AdminPageHeader,
  AdminTable,
} from "@/components/admin/AdminUI";
import { AdminSearch, useSearchFilter } from "@/components/admin/AdminSearch";
import type { InventoryRow } from "@/lib/api/admin";
import {
  AdminActionError,
  changeStock,
  setMinimumStock,
} from "@/lib/admin-store";

/**
 * موجودی انبار.
 *
 * افزایش و کاهش از اکشن‌های خود بک‌اند استفاده می‌کند تا رزروها و
 * هشدار موجودی کم درست محاسبه شوند؛ نوشتن مستقیم عدد موجودی این
 * منطق را دور می‌زد.
 */
export function AdminInventoryPage({ rows }: { rows: InventoryRow[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
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
            ? "هنوز موجودی‌ای ثبت نشده است."
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
    </div>
  );
}
