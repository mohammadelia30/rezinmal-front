"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  invoiceStatusLabels,
  invoiceStatusStyles,
  shippingTypeLabels,
  type AdminInvoice,
} from "@/data/admin";
import {
  AdminBadge,
  AdminCard,
  AdminPageHeader,
  AdminTable,
} from "@/components/admin/AdminUI";
import { AdminSearch, useSearchFilter } from "@/components/admin/AdminSearch";
import {
  AdminPagination,
  usePagination,
} from "@/components/admin/AdminPagination";
import { API_PATHS } from "@/lib/api/config";
import {
  AdminActionError,
  restoreInvoice,
  trashInvoice,
} from "@/lib/admin-store";
import { formatProductPrice } from "@/lib/price";

/**
 * فاکتورها، با سطل زباله.
 *
 * حذف فاکتور پاک‌کردن نیست: بک‌اند تاریخ حذف را می‌گذارد و فاکتور به
 * سطل زباله می‌رود. هفت روز وقت هست تا برگردانده شود؛ بعد از آن یک
 * تسک هفتگی واقعاً پاکش می‌کند. همین را در خود صفحه هم می‌نویسیم تا
 * مدیر نداند چرا فاکتور قدیمی از سطل غیب شده است.
 */
export function AdminInvoicesPage({
  invoices,
  trashed = [],
}: {
  invoices: AdminInvoice[];
  trashed?: AdminInvoice[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"active" | "trash">("active");
  const rows = tab === "trash" ? trashed : invoices;

  const { query, setQuery, filtered } = useSearchFilter(rows, [
    "number", "orderCode", "customer",
  ]);
  const pager = usePagination(filtered);
  const [selected, setSelected] = useState<AdminInvoice | null>(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const run = async (id: string, action: () => Promise<void>) => {
    setBusy(id);
    setError("");
    try {
      await action();
      router.refresh();
    } catch (actionError) {
      setError(
        actionError instanceof AdminActionError
          ? actionError.message
          : "انجام این کار ناموفق بود.",
      );
    } finally {
      setBusy("");
    }
  };

  const onTrash = (invoice: AdminInvoice) => {
    const ok = window.confirm(
      `فاکتور ${invoice.number} به سطل زباله می‌رود.\n\n` +
        "تا هفت روز می‌توانید برش گردانید؛ بعد از آن برای همیشه پاک می‌شود.",
    );
    if (ok) void run(invoice.id, () => trashInvoice(invoice.id));
  };

  return (
    <div>
      <AdminPageHeader
        title="فاکتورها"
        description="مشاهده فاکتورهای صادرشده و وضعیت پرداخت"
      />

      <div className="mb-4 flex flex-wrap justify-end gap-2">
        {([
          ["active", `فاکتورها (${invoices.length.toLocaleString("fa-IR")})`],
          ["trash", `سطل زباله (${trashed.length.toLocaleString("fa-IR")})`],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setTab(key);
              setQuery("");
              setError("");
            }}
            aria-pressed={tab === key}
            className={`rounded-full border px-4 py-1.5 text-xs font-bold transition ${
              tab === key
                ? "border-brand bg-brand text-white"
                : "border-[#e6dcc2] bg-white text-foreground hover:border-brand/50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "trash" ? (
        <p className="mb-3 rounded-xl bg-[#fdf3e3] px-4 py-2.5 text-right text-xs leading-6 text-[#8a5a17]">
          فاکتورهای این‌جا هفت روز بعد از حذف برای همیشه پاک می‌شوند.
        </p>
      ) : null}

      {error ? (
        <p className="mb-3 rounded-xl bg-[#fde8e8] px-4 py-2.5 text-right text-sm text-[#9b3d3d]">
          {error}
        </p>
      ) : null}

      <AdminSearch
        value={query}
        onChange={setQuery}
        placeholder="جست‌وجو بر اساس شماره فاکتور یا نام مشتری"
      />

      <AdminTable
        headers={[
          "شماره فاکتور",
          "کد سفارش",
          "مشتری",
          "تاریخ",
          "مبلغ",
          "وضعیت",
          "عملیات",
        ]}
      >
        {pager.items.map((invoice) => (
          <tr
            key={invoice.id}
            className="border-b border-[#efe6d4] text-right last:border-b-0"
          >
            <td className="px-4 py-3 font-bold">{invoice.number}</td>
            <td className="px-4 py-3">{invoice.orderCode}</td>
            <td className="px-4 py-3">{invoice.customer}</td>
            <td className="px-4 py-3 text-muted">{invoice.date}</td>
            <td className="px-4 py-3 font-bold text-brand">
              {formatProductPrice(invoice.total)}
            </td>
            <td className="px-4 py-3">
              <AdminBadge className={invoiceStatusStyles[invoice.status]}>
                {invoiceStatusLabels[invoice.status]}
              </AdminBadge>
            </td>
            <td className="px-4 py-3">
              <div className="flex flex-wrap justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelected(invoice)}
                  className="rounded-lg bg-brand-mist px-3 py-1.5 text-xs font-bold text-brand transition hover:bg-brand hover:text-white"
                >
                  جزئیات
                </button>
                <a
                  href={API_PATHS.orderPrint(invoice.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-[#e6dcc2] px-3 py-1.5 text-xs font-medium transition hover:bg-[#f6f1e7]"
                >
                  چاپ
                </a>
                {tab === "trash" ? (
                  <button
                    type="button"
                    disabled={busy === invoice.id}
                    onClick={() =>
                      void run(invoice.id, () => restoreInvoice(invoice.id))
                    }
                    className="rounded-lg border border-[#bcd9c6] px-3 py-1.5 text-xs font-medium text-[#2f6b45] transition hover:bg-[#eaf5ee] disabled:opacity-50"
                  >
                    {busy === invoice.id ? "…" : "بازگردانی"}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={busy === invoice.id}
                    onClick={() => onTrash(invoice)}
                    className="rounded-lg border border-[#e8c5c0] px-3 py-1.5 text-xs font-medium text-[#9b3d3d] transition hover:bg-[#fdeceb] disabled:opacity-50"
                  >
                    {busy === invoice.id ? "…" : "حذف"}
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>
      <AdminPagination pager={pager} />

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <AdminCard>
              <div className="mb-4 flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-lg px-2 py-1 text-sm text-muted hover:bg-[#f6f1e7]"
                >
                  بستن
                </button>
                <div className="text-right">
                  <h2 className="text-lg font-bold text-foreground">
                    {selected.number}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    سفارش {selected.orderCode} — {selected.customer}
                  </p>
                </div>
              </div>

              <ul className="space-y-2 border-b border-[#efe6d4] pb-4">
                {selected.items.map((item) => (
                  <li
                    key={`${selected.id}-${item.title}`}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="font-bold text-brand">
                      {formatProductPrice(item.price)}
                    </span>
                    <span className="text-right text-foreground">
                      {item.title} × {item.quantity.toLocaleString("fa-IR")}
                    </span>
                  </li>
                ))}
              </ul>

              {/* بدون این ردیف‌ها فقط مبلغ نهایی دیده می‌شد و معلوم نبود
                  هزینهٔ ارسال و تخفیف در آن حساب شده است */}
              <dl className="mt-4 space-y-2 text-sm">
                <Line label="جمع کالاها" value={selected.subtotal} />
                {selected.discount > 0 ? (
                  <Line
                    label="تخفیف"
                    value={-selected.discount}
                    className="text-[#2f6b45]"
                  />
                ) : null}
                <Line
                  label={`هزینهٔ بسته‌بندی (${shippingTypeLabels[selected.shippingType]})`}
                  value={selected.shippingCost}
                  free={selected.shippingCost === 0}
                />
              </dl>

              <div className="mt-4 flex items-center justify-between border-t border-[#efe6d4] pt-4">
                <AdminBadge className={invoiceStatusStyles[selected.status]}>
                  {invoiceStatusLabels[selected.status]}
                </AdminBadge>
                <div className="text-left">
                  <p className="text-xs text-muted">مبلغ نهایی</p>
                  <p className="text-base font-bold text-brand">
                    {formatProductPrice(selected.total)}
                  </p>
                </div>
              </div>
            </AdminCard>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Line({
  label,
  value,
  free = false,
  className = "",
}: {
  label: string;
  value: number;
  free?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <dd className="font-medium">
        {free ? "رایگان" : formatProductPrice(value)}
      </dd>
      <dt className="text-muted">{label}</dt>
    </div>
  );
}
