import Image from "next/image";
import Link from "next/link";
import {
  dashboardOrders,
  dashboardStats,
  orderStatusLabels,
  orderStatusStyles,
} from "@/data/dashboard";

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_4px_20px_rgba(78,42,84,0.06)]">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold text-brand">{value}</p>
      <p className="mt-2 text-xs text-muted">{hint}</p>
    </div>
  );
}

export function DashboardOverview() {
  const recentOrders = dashboardOrders.slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="کل سفارش‌ها"
          value={dashboardStats.totalOrders}
          hint="تمام سفارش‌های ثبت‌شده"
        />
        <StatCard
          label="سفارش فعال"
          value={dashboardStats.activeOrders}
          hint="در حال پردازش یا ارسال"
        />
        <StatCard
          label="تحویل‌شده"
          value={dashboardStats.deliveredOrders}
          hint="سفارش‌های تکمیل‌شده"
        />
        <StatCard
          label="علاقه‌مندی‌ها"
          value={dashboardStats.favorites}
          hint="محصولات ذخیره‌شده"
        />
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-[0_4px_20px_rgba(78,42,84,0.06)] sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <Link
            href="/dashboard/orders"
            className="text-sm font-medium text-brand transition hover:text-brand-dark"
          >
            مشاهده همه
          </Link>
          <h2 className="text-lg font-bold text-foreground">آخرین سفارش‌ها</h2>
        </div>

        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-[#efe6d4] p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-right">
                  <p className="font-bold text-foreground">{order.code}</p>
                  <p className="mt-1 text-sm text-muted">{order.date}</p>
                </div>
                <span
                  className={`self-start rounded-full px-3 py-1 text-xs font-bold sm:self-auto ${orderStatusStyles[order.status]}`}
                >
                  {orderStatusLabels[order.status]}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-brand">{order.total}</p>
                <div className="flex -space-x-2 space-x-reverse">
                  {order.items.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="relative size-10 overflow-hidden rounded-lg border-2 border-white"
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/products"
          className="rounded-2xl bg-brand px-5 py-5 text-right text-white shadow-[0_8px_24px_rgba(91,42,99,0.18)] transition hover:bg-brand-dark"
        >
          <p className="text-lg font-bold">ادامه خرید</p>
          <p className="mt-2 text-sm text-white/85">
            محصولات جدید و کیت‌های آموزشی را ببینید.
          </p>
        </Link>

        <Link
          href="/blog"
          className="rounded-2xl bg-white px-5 py-5 text-right shadow-[0_4px_20px_rgba(78,42,84,0.06)] transition hover:bg-brand-mist/40"
        >
          <p className="text-lg font-bold text-foreground">آموزش‌های رزین</p>
          <p className="mt-2 text-sm text-muted">
            مقالات آموزشی و تکنیک‌های جدید را دنبال کنید.
          </p>
        </Link>
      </div>
    </div>
  );
}
