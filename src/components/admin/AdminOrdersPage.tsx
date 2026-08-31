"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  orderStatusLabels,
  orderStatusStyles,
  type AdminOrder,
} from "@/data/admin";
import {
  AdminBadge,
  AdminButton,
  AdminError,
  AdminPageHeader,
  AdminTable,
} from "@/components/admin/AdminUI";
import {
  AdminActionError,
  runOrderAction,
  type OrderAction,
} from "@/lib/admin-store";
import { API_PATHS } from "@/lib/api/config";
import { formatProductPrice } from "@/lib/price";

/**
 * عملیات هر سفارش بر اساس وضعیت فعلی آن.
 *
 * فقط کارهایی نشان داده می‌شوند که در آن وضعیت معنا دارند؛ مثلاً سفارش
 * تحویل‌شده دیگر «تأیید» نمی‌خواهد.
 */
const ACTIONS: {
  key: OrderAction;
  label: string;
  danger?: boolean;
  showFor: AdminOrder["status"][];
}[] = [
  { key: "confirm", label: "تأیید", showFor: ["pending"] },
  { key: "preparing", label: "آماده‌سازی", showFor: ["pending", "paid"] },
  { key: "readyForPost", label: "آمادهٔ ارسال", showFor: ["paid", "shipped"] },
  {
    key: "deliveredToPost",
    label: "تحویل به پست",
    showFor: ["paid", "shipped"],
  },
  {
    key: "cancel",
    label: "لغو",
    danger: true,
    showFor: ["pending", "paid", "shipped"],
  },
];

export function AdminOrdersPage({ orders }: { orders: AdminOrder[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const run = async (id: string, action: OrderAction, label: string) => {
    if (action === "cancel" && !window.confirm(`سفارش لغو شود؟`)) return;

    setError("");
    setBusyId(id);
    try {
      await runOrderAction(id, action);
      router.refresh();
    } catch (actionError) {
      setError(
        actionError instanceof AdminActionError
          ? `${label}: ${actionError.message}`
          : `${label} ناموفق بود.`,
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="سفارش‌ها"
        description="مدیریت فروش و وضعیت سفارش‌های فروشگاه"
      />

      <AdminError message={error} />

      {orders.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-muted shadow-[0_4px_20px_rgba(78,42,84,0.06)]">
          هنوز سفارشی ثبت نشده است.
        </p>
      ) : (
        <AdminTable
          headers={[
            "کد سفارش",
            "مشتری",
            "تاریخ",
            "مبلغ",
            "وضعیت",
            "عملیات",
          ]}
        >
          {orders.map((order) => {
            const busy = busyId === order.id;
            const actions = ACTIONS.filter((action) =>
              action.showFor.includes(order.status),
            );

            return (
              <tr
                key={order.id}
                className="border-b border-[#efe6d4] text-right last:border-b-0"
              >
                <td className="px-4 py-3 font-bold text-foreground">
                  {order.code}
                </td>
                <td className="px-4 py-3">
                  {order.customer}
                  <span className="mt-0.5 block text-xs text-muted" dir="ltr">
                    {order.phone}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{order.date}</td>
                <td className="px-4 py-3 font-bold text-brand">
                  {formatProductPrice(order.total)}
                </td>
                <td className="px-4 py-3">
                  <AdminBadge className={orderStatusStyles[order.status]}>
                    {orderStatusLabels[order.status]}
                  </AdminBadge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {actions.map((action) => (
                      <AdminButton
                        key={action.key}
                        variant={action.danger ? "danger" : "ghost"}
                        disabled={busy}
                        onClick={() => run(order.id, action.key, action.label)}
                      >
                        {action.label}
                      </AdminButton>
                    ))}
                    <a
                      href={API_PATHS.orderPrint(order.id)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-[#e6dcc2] px-4 py-2 text-sm font-medium text-foreground transition hover:bg-[#f6f1e7]"
                    >
                      چاپ
                    </a>
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
