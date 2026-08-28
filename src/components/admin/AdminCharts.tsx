"use client";

import { useEffect, useState } from "react";
import {
  orderStatusLabels,
  type AdminOrder,
  type AdminOrderStatus,
} from "@/data/admin";
import { AdminCard } from "@/components/admin/AdminUI";

/**
 * نمودارهای پنل مدیریت.
 *
 * فقط داده‌هایی رسم می‌شوند که بک‌اند واقعاً می‌دهد: فروش ماهانه از
 * گزارش‌ها و توزیع وضعیت از خود سفارش‌ها. نمودارهای «فروش ۷ روز اخیر» و
 * «فروش هر محصول» حذف شده‌اند چون اندپوینتی برایشان وجود ندارد.
 */

type MonthlySales = {
  month: number;
  month_name: string;
  order_count: number;
  sales: number;
};

const barGradients = [
  { from: "#7c3aed", to: "#ddd6fe" },
  { from: "#db2777", to: "#fbcfe8" },
  { from: "#0891b2", to: "#a5f3fc" },
  { from: "#ea580c", to: "#fed7aa" },
  { from: "#059669", to: "#a7f3d0" },
  { from: "#4f46e5", to: "#c7d2fe" },
];

const statusColors: Record<AdminOrderStatus, string> = {
  pending: "#d1a53a",
  paid: "#2f6b45",
  shipped: "#1f5a8a",
  delivered: "#4e2a54",
  cancelled: "#9b3d3d",
};

function formatShortMoney(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString("fa-IR", {
      maximumFractionDigits: 1,
    })}م`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toLocaleString("fa-IR", {
      maximumFractionDigits: 0,
    })}ه`;
  }
  return value.toLocaleString("fa-IR");
}

export function AdminCharts({
  monthlySales,
  orders,
}: {
  monthlySales: MonthlySales[];
  orders: AdminOrder[];
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  const maxMonthSales = Math.max(1, ...monthlySales.map((item) => item.sales));
  const yearTotal = monthlySales.reduce((sum, item) => sum + item.sales, 0);

  const statusCounts = orders.reduce<Record<string, number>>((acc, order) => {
    acc[order.status] = (acc[order.status] ?? 0) + 1;
    return acc;
  }, {});

  const statusEntries = (
    Object.keys(orderStatusLabels) as AdminOrderStatus[]
  )
    .map((status) => ({ status, value: statusCounts[status] ?? 0 }))
    .filter((entry) => entry.value > 0);

  const statusTotal = statusEntries.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <AdminCard className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-10 -top-10 size-44 rounded-full bg-[#a78bfa]/30 blur-3xl"
        />
        <div className="relative mb-4 flex items-start justify-between gap-3">
          <div className="rounded-xl border border-[#e8dfd0] bg-white px-3 py-2 text-left shadow-sm">
            <p className="text-[10px] font-medium text-[#6b5b73]">جمع سال</p>
            <p className="mt-0.5 text-sm font-extrabold text-[#3d2247]">
              {formatShortMoney(yearTotal)}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold text-foreground">فروش ماهانه</h2>
            <p className="mt-1 text-xs text-muted">
              بر اساس سفارش‌های پرداخت‌شده
            </p>
          </div>
        </div>

        {monthlySales.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">
            هنوز فروشی ثبت نشده است.
          </p>
        ) : (
          <div
            className="relative flex h-56 items-end justify-between gap-1.5"
            dir="rtl"
          >
            {monthlySales.map((item, index) => {
              const height = item.sales
                ? Math.max(8, (item.sales / maxMonthSales) * 100)
                : 2;
              const palette = barGradients[index % barGradients.length];
              return (
                <div
                  key={item.month}
                  className="group relative z-10 flex h-full flex-1 flex-col items-center justify-end gap-1.5"
                  title={`${item.month_name}: ${item.sales.toLocaleString("fa-IR")}`}
                >
                  <div
                    className="w-full rounded-t-lg transition-all duration-700"
                    style={{
                      height: ready ? `${height}%` : "2%",
                      background: `linear-gradient(to top, ${palette.from}, ${palette.to})`,
                    }}
                  />
                  <span className="text-[10px] text-muted">
                    {item.month_name}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>

      <AdminCard className="relative overflow-hidden">
        <div className="mb-4 text-right">
          <h2 className="text-lg font-bold text-foreground">
            وضعیت سفارش‌ها
          </h2>
          <p className="mt-1 text-xs text-muted">
            توزیع {statusTotal.toLocaleString("fa-IR")} سفارش
          </p>
        </div>

        {statusEntries.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">
            هنوز سفارشی ثبت نشده است.
          </p>
        ) : (
          <ul className="space-y-3">
            {statusEntries.map((entry) => {
              const percent = Math.round((entry.value / statusTotal) * 100);
              return (
                <li key={entry.status}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-bold text-foreground">
                      {percent.toLocaleString("fa-IR")}٪
                    </span>
                    <span className="text-muted">
                      {orderStatusLabels[entry.status]} (
                      {entry.value.toLocaleString("fa-IR")})
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#f0e8da]">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: ready ? `${percent}%` : "0%",
                        backgroundColor: statusColors[entry.status],
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}
