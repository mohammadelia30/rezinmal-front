import {
  orderStatusLabels,
  ordersByMonth,
  ordersByStatus,
  productSalesChart,
  salesByDay,
} from "@/data/admin";
import { AdminCard } from "@/components/admin/AdminUI";
import { formatProductPrice } from "@/lib/price";

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

export function AdminCharts() {
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

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <AdminCard>
        <h2 className="mb-1 text-right text-lg font-bold text-foreground">
          فروش ۷ روز اخیر
        </h2>
        <p className="mb-5 text-right text-xs text-muted">مبالغ به تومان</p>

        <div className="flex h-52 items-end justify-between gap-2 sm:gap-3" dir="rtl">
          {salesByDay.map((item) => {
            const height = Math.max(8, (item.value / maxDay) * 100);
            return (
              <div
                key={item.label}
                className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-[10px] font-medium text-brand opacity-0 transition group-hover:opacity-100 sm:text-xs">
                  {formatShortMoney(item.value)}
                </span>
                <div className="relative flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-brand to-brand-soft transition duration-500 hover:from-brand-dark"
                    style={{ height: `${height}%` }}
                    title={formatProductPrice(item.value)}
                  />
                </div>
                <span className="text-[10px] text-muted sm:text-xs">{item.label}</span>
              </div>
            );
          })}
        </div>
      </AdminCard>

      <AdminCard>
        <h2 className="mb-1 text-right text-lg font-bold text-foreground">
          سفارش‌های ماهانه
        </h2>
        <p className="mb-5 text-right text-xs text-muted">تعداد سفارش در ۶ ماه اخیر</p>

        <div className="relative h-52" dir="ltr">
          <svg viewBox="0 0 360 180" className="h-full w-full" role="img" aria-label="نمودار سفارش ماهانه">
            {[0, 1, 2, 3].map((line) => {
              const y = 20 + line * 40;
              return (
                <line
                  key={line}
                  x1="24"
                  x2="350"
                  y1={y}
                  y2={y}
                  stroke="#efe6d4"
                  strokeWidth="1"
                />
              );
            })}
            <polyline
              fill="none"
              stroke="#5b2a63"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={ordersByMonth
                .map((item, index) => {
                  const x = 40 + index * 55;
                  const y = 160 - (item.value / maxMonth) * 130;
                  return `${x},${y}`;
                })
                .join(" ")}
            />
            <polygon
              fill="rgba(91,42,99,0.12)"
              points={`40,160 ${ordersByMonth
                .map((item, index) => {
                  const x = 40 + index * 55;
                  const y = 160 - (item.value / maxMonth) * 130;
                  return `${x},${y}`;
                })
                .join(" ")} ${40 + (ordersByMonth.length - 1) * 55},160`}
            />
            {ordersByMonth.map((item, index) => {
              const x = 40 + index * 55;
              const y = 160 - (item.value / maxMonth) * 130;
              return (
                <g key={item.label}>
                  <circle cx={x} cy={y} r="5" fill="#5b2a63" />
                  <text
                    x={x}
                    y="175"
                    textAnchor="middle"
                    className="fill-[#7a6a55]"
                    fontSize="11"
                  >
                    {item.label}
                  </text>
                  <title>
                    {item.label}: {item.value.toLocaleString("fa-IR")} سفارش
                  </title>
                </g>
              );
            })}
          </svg>
        </div>
      </AdminCard>

      <AdminCard>
        <h2 className="mb-1 text-right text-lg font-bold text-foreground">
          توزیع وضعیت سفارش‌ها
        </h2>
        <p className="mb-5 text-right text-xs text-muted">
          مجموع {statusTotal.toLocaleString("fa-IR")} سفارش
        </p>

        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="relative size-44 shrink-0">
            <svg viewBox="0 0 42 42" className="size-full -rotate-90">
              <circle
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke="#f0e8da"
                strokeWidth="6"
              />
              {pieSlices.map((slice) => {
                const dash = slice.portion * 100;
                return (
                  <circle
                    key={slice.status}
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth="6"
                    strokeDasharray={`${dash} ${100 - dash}`}
                    strokeDashoffset={-slice.start * 100}
                  >
                    <title>
                      {orderStatusLabels[slice.status]}:{" "}
                      {slice.value.toLocaleString("fa-IR")}
                    </title>
                  </circle>
                );
              })}
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-muted">کل</span>
              <span className="text-lg font-bold text-brand">
                {statusTotal.toLocaleString("fa-IR")}
              </span>
            </div>
          </div>

          <ul className="w-full space-y-2.5 text-right sm:max-w-[200px]">
            {ordersByStatus.map((item) => (
              <li
                key={item.status}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="font-bold text-foreground">
                  {item.value.toLocaleString("fa-IR")}
                </span>
                <span className="flex items-center gap-2 text-muted">
                  {orderStatusLabels[item.status]}
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </AdminCard>

      <AdminCard>
        <h2 className="mb-1 text-right text-lg font-bold text-foreground">
          فروش به تفکیک محصول
        </h2>
        <p className="mb-5 text-right text-xs text-muted">مقایسه درآمد محصولات پرفروش</p>

        <div className="space-y-4">
          {productSalesChart.map((item) => {
            const width = (item.value / maxProduct) * 100;
            return (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                  <span className="font-bold text-brand">
                    {formatShortMoney(item.value)}
                  </span>
                  <span className="text-foreground">{item.label}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-[#f0e8da]">
                  <div
                    className="h-full rounded-full bg-brand transition-all duration-700"
                    style={{ width: `${width}%` }}
                    title={formatProductPrice(item.value)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </AdminCard>
    </div>
  );
}
