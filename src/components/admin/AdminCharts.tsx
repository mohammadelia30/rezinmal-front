"use client";

import { useEffect, useState } from "react";
import {
  orderStatusLabels,
  ordersByMonth,
  ordersByStatus,
  productSalesChart,
  salesByDay,
} from "@/data/admin";
import { AdminCard } from "@/components/admin/AdminUI";
import { formatProductPrice } from "@/lib/price";

const dayBarGradients = [
  { from: "#7c3aed", via: "#a78bfa", to: "#ddd6fe", shadow: "rgba(124,58,237,0.35)" },
  { from: "#db2777", via: "#f472b6", to: "#fbcfe8", shadow: "rgba(219,39,119,0.35)" },
  { from: "#0891b2", via: "#22d3ee", to: "#a5f3fc", shadow: "rgba(8,145,178,0.35)" },
  { from: "#ea580c", via: "#fb923c", to: "#fed7aa", shadow: "rgba(234,88,12,0.35)" },
  { from: "#059669", via: "#34d399", to: "#a7f3d0", shadow: "rgba(5,150,105,0.35)" },
  { from: "#4f46e5", via: "#818cf8", to: "#c7d2fe", shadow: "rgba(79,70,229,0.35)" },
  { from: "#c026d3", via: "#e879f9", to: "#f5d0fe", shadow: "rgba(192,38,211,0.35)" },
];

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
  showSales = true,
  showProducts = true,
}: {
  showSales?: boolean;
  showProducts?: boolean;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  const maxDay = Math.max(...salesByDay.map((item) => item.value));
  const maxMonth = Math.max(...ordersByMonth.map((item) => item.value));
  const maxProduct = Math.max(...productSalesChart.map((item) => item.value));
  const statusTotal = ordersByStatus.reduce((sum, item) => sum + item.value, 0);

  let pieOffset = 0;
  const pieSlices = ordersByStatus.map((item) => {
    const portion = item.value / statusTotal;
    const start = pieOffset;
    pieOffset += portion;
    return { ...item, start, portion };
  });

  const weekTotal = salesByDay.reduce((sum, item) => sum + item.value, 0);
  const weekPeak = salesByDay.reduce((best, item) =>
    item.value > best.value ? item : best,
  );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {showSales ? (
        <AdminCard className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-10 -top-10 size-44 rounded-full bg-[#a78bfa]/30 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-8 right-0 size-36 rounded-full bg-[#f472b6]/25 blur-3xl"
          />
          <div className="relative mb-4 flex items-start justify-between gap-3">
            <div className="rounded-xl border border-[#e8dfd0] bg-white px-3 py-2 text-left shadow-sm">
              <p className="text-[10px] font-medium text-[#6b5b73]">جمع هفته</p>
              <p className="mt-0.5 text-sm font-extrabold text-[#3d2247]">
                {formatShortMoney(weekTotal)}
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold text-foreground">
                فروش ۷ روز اخیر
              </h2>
              <p className="mt-1 text-xs text-muted">
                اوج فروش: {weekPeak.label}
              </p>
            </div>
          </div>

          <div
            className="relative flex h-56 items-end justify-between gap-2 sm:gap-3"
            dir="rtl"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-7 top-2 flex flex-col justify-between"
            >
              {[0, 1, 2, 3].map((line) => (
                <div key={line} className="border-t border-dashed border-[#eadfcd]" />
              ))}
            </div>

            {salesByDay.map((item, index) => {
              const height = Math.max(12, (item.value / maxDay) * 100);
              const palette = dayBarGradients[index % dayBarGradients.length];
              return (
                <div
                  key={item.label}
                  className="group relative z-10 flex h-full flex-1 flex-col items-center justify-end gap-1.5"
                >
                  <span className="rounded-md border border-[#e8dfd0] bg-white px-1.5 py-0.5 text-[10px] font-bold leading-none text-[#3d2247] shadow-sm sm:text-[11px]">
                    {formatShortMoney(item.value)}
                  </span>
                  <div className="relative flex w-full flex-1 items-end justify-center">
                    <div
                      className="admin-chart-bar w-[70%] max-w-12 rounded-t-2xl transition duration-300 group-hover:scale-x-110 group-hover:brightness-110"
                      style={{
                        height: ready ? `${height}%` : "0%",
                        transitionDelay: `${index * 70}ms`,
                        background: `linear-gradient(to top, ${palette.from}, ${palette.via}, ${palette.to})`,
                        boxShadow: `0 10px 22px ${palette.shadow}`,
                      }}
                      title={formatProductPrice(item.value)}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-[#5a4a60] sm:text-xs">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </AdminCard>
      ) : null}

      <AdminCard className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 top-0 size-40 rounded-full bg-[#22d3ee]/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-10 left-4 size-32 rounded-full bg-[#818cf8]/30 blur-3xl"
        />
        <div className="relative mb-2 text-right">
          <h2 className="text-lg font-bold text-foreground">سفارش‌های ماهانه</h2>
          <p className="mt-1 text-xs text-muted">روند رشد ۶ ماه اخیر</p>
        </div>

        <div className="relative h-56" dir="ltr">
          <svg
            viewBox="0 0 360 200"
            className="h-full w-full"
            role="img"
            aria-label="نمودار سفارش ماهانه"
          >
            <defs>
              <linearGradient id="ordersArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                <stop offset="55%" stopColor="#8b5cf6" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="ordersStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {[0, 1, 2, 3].map((line) => {
              const y = 28 + line * 36;
              return (
                <line
                  key={line}
                  x1="28"
                  x2="348"
                  y1={y}
                  y2={y}
                  stroke="#eadfcd"
                  strokeDasharray="4 6"
                  strokeWidth="1"
                />
              );
            })}

            <polygon
              fill="url(#ordersArea)"
              className={ready ? "admin-chart-fade" : "opacity-0"}
              points={`40,168 ${ordersByMonth
                .map((item, index) => {
                  const x = 40 + index * 55;
                  const y = 168 - (item.value / maxMonth) * 120;
                  return `${x},${y}`;
                })
                .join(" ")} ${40 + (ordersByMonth.length - 1) * 55},168`}
            />

            <polyline
              fill="none"
              stroke="url(#ordersStroke)"
              strokeWidth="4"
              strokeLinejoin="round"
              strokeLinecap="round"
              filter="url(#softGlow)"
              className={ready ? "admin-chart-draw" : "opacity-0"}
              points={ordersByMonth
                .map((item, index) => {
                  const x = 40 + index * 55;
                  const y = 168 - (item.value / maxMonth) * 120;
                  return `${x},${y}`;
                })
                .join(" ")}
            />

            {ordersByMonth.map((item, index) => {
              const x = 40 + index * 55;
              const y = 168 - (item.value / maxMonth) * 120;
              const pointColors = [
                "#0891b2",
                "#0284c7",
                "#6366f1",
                "#7c3aed",
                "#c026d3",
                "#db2777",
              ];
              const color = pointColors[index % pointColors.length];
              const label = item.value.toLocaleString("fa-IR");
              const boxWidth = Math.max(28, label.length * 8);
              return (
                <g key={item.label} className={ready ? "admin-chart-fade" : "opacity-0"}>
                  <circle cx={x} cy={y} r="8" fill={color} opacity="0.2" />
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill="#fff"
                    stroke={color}
                    strokeWidth="3"
                  />
                  <rect
                    x={x - boxWidth / 2}
                    y={y - 28}
                    width={boxWidth}
                    height="16"
                    rx="4"
                    fill="#ffffff"
                    stroke="#e8dfd0"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={y - 16}
                    textAnchor="middle"
                    fill="#3d2247"
                    fontSize="11"
                    fontWeight="700"
                  >
                    {label}
                  </text>
                  <text
                    x={x}
                    y="188"
                    textAnchor="middle"
                    fill="#5a4a60"
                    fontSize="12"
                    fontWeight="600"
                  >
                    {item.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </AdminCard>

      <AdminCard className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-6 top-4 size-28 rounded-full bg-[#34d399]/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 size-28 rounded-full bg-[#f43f5e]/20 blur-3xl"
        />
        <div className="mb-4 text-right">
          <h2 className="text-lg font-bold text-foreground">
            توزیع وضعیت سفارش‌ها
          </h2>
          <p className="mt-1 text-xs text-muted">
            مجموع {statusTotal.toLocaleString("fa-IR")} سفارش فعال در سیستم
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="relative size-48 shrink-0">
            <svg viewBox="0 0 42 42" className="size-full -rotate-90 drop-shadow-md">
              <circle
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke="#f3eadc"
                strokeWidth="8"
              />
              {pieSlices.map((slice, index) => {
                const dash = slice.portion * 100;
                return (
                  <circle
                    key={slice.status}
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth="8"
                    strokeLinecap="butt"
                    strokeDasharray={`${ready ? dash : 0} ${100 - (ready ? dash : 0)}`}
                    strokeDashoffset={-slice.start * 100}
                    className="transition-all duration-700 ease-out"
                    style={{
                      transitionDelay: `${index * 90}ms`,
                      filter: `drop-shadow(0 0 2px ${slice.color}88)`,
                    }}
                  >
                    <title>
                      {orderStatusLabels[slice.status]}:{" "}
                      {slice.value.toLocaleString("fa-IR")}
                    </title>
                  </circle>
                );
              })}
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center rounded-full">
              <span className="text-xs font-medium text-[#6b5b73]">کل سفارش</span>
              <span className="text-2xl font-extrabold text-[#3d2247]">
                {statusTotal.toLocaleString("fa-IR")}
              </span>
            </div>
          </div>

          <ul className="w-full space-y-2.5 text-right sm:max-w-[220px]">
            {ordersByStatus.map((item) => {
              const percent = Math.round((item.value / statusTotal) * 100);
              return (
                <li
                  key={item.status}
                  className="rounded-xl border border-[#efe6d4] bg-white/80 px-3 py-2.5 shadow-sm"
                >
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                    <span className="rounded-md bg-[#f6f1e7] px-2 py-0.5 text-xs font-extrabold text-[#3d2247]">
                      {item.value.toLocaleString("fa-IR")}
                      <span className="mr-1 font-medium text-[#6b5b73]">
                        ({percent.toLocaleString("fa-IR")}٪)
                      </span>
                    </span>
                    <span className="flex items-center gap-2 font-semibold text-[#3d2247]">
                      {orderStatusLabels[item.status]}
                      <span
                        className="size-3 shrink-0 rounded-full ring-2 ring-white"
                        style={{
                          backgroundColor: item.color,
                          boxShadow: `0 0 0 1px ${item.color}`,
                        }}
                      />
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#f0e8da]">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: ready ? `${percent}%` : "0%",
                        background: `linear-gradient(90deg, ${item.color}, ${item.color}cc)`,
                        boxShadow: `0 0 10px ${item.color}66`,
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </AdminCard>

      {showProducts ? (
        <AdminCard className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 size-36 rounded-full bg-[#67e8f9]/35 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-4 top-0 size-28 rounded-full bg-[#f9a8d4]/35 blur-3xl"
          />
          <div className="relative mb-5 text-right">
            <h2 className="text-lg font-bold text-foreground">
              فروش به تفکیک محصول
            </h2>
            <p className="mt-1 text-xs text-muted">رتبه‌بندی درآمد محصولات</p>
          </div>

          <div className="relative space-y-4">
            {productSalesChart.map((item, index) => {
              const width = (item.value / maxProduct) * 100;
              return (
                <div key={item.label} className="group">
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                    <span className="rounded-md border border-[#e8dfd0] bg-white px-2.5 py-1 text-xs font-extrabold text-[#3d2247] shadow-sm">
                      {formatShortMoney(item.value)}
                    </span>
                    <span className="flex items-center gap-2 font-semibold text-[#3d2247]">
                      {item.label}
                      <span
                        className="flex size-6 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm ring-2 ring-white"
                        style={{ backgroundColor: item.from }}
                      >
                        {(index + 1).toLocaleString("fa-IR")}
                      </span>
                    </span>
                  </div>
                  <div className="h-3.5 overflow-hidden rounded-full bg-[#f0e8da]">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out group-hover:brightness-110"
                      style={{
                        width: ready ? `${width}%` : "0%",
                        transitionDelay: `${index * 80}ms`,
                        background: `linear-gradient(90deg, ${item.from}, ${item.to})`,
                        boxShadow: `0 0 14px ${item.from}55`,
                      }}
                      title={formatProductPrice(item.value)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </AdminCard>
      ) : null}
    </div>
  );
}
