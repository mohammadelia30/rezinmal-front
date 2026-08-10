import Link from "next/link";
import { AdminCharts } from "@/components/admin/AdminCharts";
import {
  adminOrders,
  adminStats,
  orderStatusLabels,
  orderStatusStyles,
} from "@/data/admin";
import {
  AdminBadge,
  AdminCard,
  AdminPageHeader,
  AdminStatCard,
} from "@/components/admin/AdminUI";
import { formatProductPrice } from "@/lib/price";

export function AdminOverview() {
  const recentOrders = adminOrders.slice(0, 5);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="داشبورد"
        description="خلاصه فروش و وضعیت فروشگاه رزین‌مال"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="فروش امروز"
          value={formatProductPrice(adminStats.salesToday)}
          hint={`${adminStats.ordersToday.toLocaleString("fa-IR")} سفارش`}
        />
        <AdminStatCard
          label="فروش ماه"
          value={formatProductPrice(adminStats.salesMonth)}
          hint={`${adminStats.ordersMonth.toLocaleString("fa-IR")} سفارش`}
        />
        <AdminStatCard
          label="کاربران جدید (هفته)"
          value={adminStats.newUsersWeek.toLocaleString("fa-IR")}
          hint="ثبت‌نام‌های اخیر"
        />
        <AdminStatCard
          label="محصولات فعال"
          value={adminStats.activeProducts.toLocaleString("fa-IR")}
          hint="در فروشگاه نمایش داده می‌شوند"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AdminCard>
          <p className="text-sm text-muted">سفارش در انتظار</p>
          <p className="mt-2 text-3xl font-bold text-[#8a6a1f]">
            {adminStats.pendingOrders.toLocaleString("fa-IR")}
          </p>
          <Link
            href="/admin/orders"
            className="mt-3 inline-block text-sm font-medium text-brand hover:text-brand-dark"
          >
            مشاهده سفارش‌ها
          </Link>
        </AdminCard>
        <AdminCard>
          <p className="text-sm text-muted">موجودی کم</p>
          <p className="mt-2 text-3xl font-bold text-[#9b3d3d]">
            {adminStats.lowStock.toLocaleString("fa-IR")}
          </p>
          <Link
            href="/admin/products"
            className="mt-3 inline-block text-sm font-medium text-brand hover:text-brand-dark"
          >
            مدیریت محصولات
          </Link>
        </AdminCard>
        <AdminCard>
          <p className="text-sm text-muted">کد تخفیف فعال</p>
          <p className="mt-2 text-3xl font-bold text-brand">
            {adminStats.activeDiscounts.toLocaleString("fa-IR")}
          </p>
          <Link
            href="/admin/discounts"
            className="mt-3 inline-block text-sm font-medium text-brand hover:text-brand-dark"
          >
            مدیریت تخفیف‌ها
          </Link>
        </AdminCard>
      </div>

      <AdminCharts />

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

        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-3 rounded-xl border border-[#efe6d4] p-4 sm:flex-row sm:items-center sm:justify-between"
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
      </AdminCard>
    </div>
  );
}
