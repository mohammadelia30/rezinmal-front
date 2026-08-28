import Link from "next/link";
import { AdminCharts } from "@/components/admin/AdminCharts";
import {
  orderStatusLabels,
  orderStatusStyles,
  type AdminOrder,
} from "@/data/admin";
import {
  AdminBadge,
  AdminCard,
  AdminPageHeader,
  AdminStatCard,
} from "@/components/admin/AdminUI";
import type { ReportOverview } from "@/lib/api/admin";
import { formatProductPrice } from "@/lib/price";

/**
 * داشبورد مدیریت.
 *
 * تمام اعداد از گزارش‌های واقعی بک‌اند می‌آید؛ اگر گزارشی برنگردد
 * حالت خالی نشان داده می‌شود، نه دادهٔ نمونه.
 */
export function AdminOverview({
  overview,
  orders,
}: {
  overview: ReportOverview | null;
  orders: AdminOrder[];
}) {
  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;
  const shippingOrders = orders.filter(
    (order) => order.status === "shipped",
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered",
  ).length;

  const yearSales = overview?.summary.sales ?? 0;
  const yearOrders = overview?.summary.order_count ?? 0;

  const currentMonth = overview?.monthly_sales?.length
    ? overview.monthly_sales[overview.monthly_sales.length - 1]
    : null;

  const completionRate = orders.length
    ? Math.round((deliveredOrders / orders.length) * 100)
    : 0;

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="داشبورد"
        description={
          overview
            ? `خلاصهٔ فروش سال ${overview.year.toLocaleString("fa-IR")}`
            : "خلاصه فروش و وضعیت فروشگاه رزین‌مال"
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="فروش سال"
          value={formatProductPrice(yearSales)}
          hint={`${yearOrders.toLocaleString("fa-IR")} سفارش پرداخت‌شده`}
        />
        <AdminStatCard
          label={
            currentMonth ? `فروش ${currentMonth.month_name}` : "فروش ماه جاری"
          }
          value={formatProductPrice(currentMonth?.sales ?? 0)}
          hint={`${(currentMonth?.order_count ?? 0).toLocaleString("fa-IR")} سفارش`}
        />
        <AdminStatCard
          label="کل سفارش‌ها"
          value={orders.length.toLocaleString("fa-IR")}
          hint="ثبت‌شده در فروشگاه"
        />
        <AdminStatCard
          label="در حال ارسال"
          value={shippingOrders.toLocaleString("fa-IR")}
          hint="تحویل‌شده به پست"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AdminCard className="border border-[#efe6d4] bg-gradient-to-br from-white to-[#fff8e8]">
          <p className="text-sm text-muted">سفارش در انتظار</p>
          <p className="mt-2 text-3xl font-bold text-[#8a6a1f]">
            {pendingOrders.toLocaleString("fa-IR")}
          </p>
          <Link
            href="/admin/orders"
            className="mt-3 inline-block text-sm font-medium text-brand hover:text-brand-dark"
          >
            مشاهده سفارش‌ها
          </Link>
        </AdminCard>

        <AdminCard className="border border-[#efe6d4] bg-gradient-to-br from-white to-[#eef6ff]">
          <p className="text-sm text-muted">تحویل‌شده</p>
          <p className="mt-2 text-3xl font-bold text-[#1f5a8a]">
            {deliveredOrders.toLocaleString("fa-IR")}
          </p>
          <Link
            href="/admin/orders"
            className="mt-3 inline-block text-sm font-medium text-brand hover:text-brand-dark"
          >
            پیگیری ارسال‌ها
          </Link>
        </AdminCard>

        <AdminCard className="border border-[#efe6d4] bg-gradient-to-br from-white to-[#f4eef9]">
          <p className="text-sm text-muted">نرخ تکمیل سفارش</p>
          <p className="mt-2 text-3xl font-bold text-brand">
            {completionRate.toLocaleString("fa-IR")}٪
          </p>
          <p className="mt-3 text-sm text-muted">
            بر اساس سفارش‌های ثبت‌شده
          </p>
        </AdminCard>
      </div>

      <AdminCharts monthlySales={overview?.monthly_sales ?? []} orders={orders} />

      <AdminCard>
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-brand hover:text-brand-dark"
          >
            مشاهده همه
          </Link>
          <h2 className="text-lg font-bold text-foreground">آخرین سفارش‌ها</h2>
        </div>

        {recentOrders.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">
            هنوز سفارشی ثبت نشده است.
          </p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-3 rounded-xl border border-[#efe6d4] bg-[#fbf9f1]/70 p-4 transition hover:bg-white sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="text-right">
                  <p className="font-bold text-foreground">{order.code}</p>
                  <p className="mt-1 text-sm text-muted">
                    {order.customer} — {order.date}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <AdminBadge className={orderStatusStyles[order.status]}>
                    {orderStatusLabels[order.status]}
                  </AdminBadge>
                  <p className="text-sm font-bold text-brand">
                    {formatProductPrice(order.total)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
