"use client";

import { useState } from "react";
import {
  invoiceStatusLabels,
  invoiceStatusStyles,
  type AdminInvoice,
} from "@/data/admin";
import {
  AdminBadge,
  AdminCard,
  AdminPageHeader,
  AdminTable,
} from "@/components/admin/AdminUI";
import { formatProductPrice } from "@/lib/price";

export function AdminInvoicesPage({ invoices }: { invoices: AdminInvoice[] }) {
  const [selected, setSelected] = useState<AdminInvoice | null>(null);

  return (
    <div>
      <AdminPageHeader
        title="فاکتورها"
        description="مشاهده فاکتورهای صادرشده و وضعیت پرداخت"
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
        {invoices.map((invoice) => (
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
              <button
                type="button"
                onClick={() => setSelected(invoice)}
                className="rounded-lg bg-brand-mist px-3 py-1.5 text-xs font-bold text-brand transition hover:bg-brand hover:text-white"
              >
                جزئیات
              </button>
            </td>
          </tr>
        ))}
      </AdminTable>

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

              <div className="mt-4 flex items-center justify-between">
                <AdminBadge className={invoiceStatusStyles[selected.status]}>
                  {invoiceStatusLabels[selected.status]}
                </AdminBadge>
                <p className="text-base font-bold text-brand">
                  {formatProductPrice(selected.total)}
                </p>
              </div>
            </AdminCard>
          </div>
        </div>
      ) : null}
    </div>
  );
}
