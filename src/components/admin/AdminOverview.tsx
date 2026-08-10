"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
import {
  hasAdminPermission,
  readAdminSession,
  type AdminSession,
} from "@/lib/admin-auth";
import { formatProductPrice } from "@/lib/price";

export function AdminOverview() {
  const [session, setSession] = useState<AdminSession | null>(null);

  useEffect(() => {
    setSession(readAdminSession());
  }, []);

  if (!session) {
    return (
      <div className="py-10 text-center text-sm text-muted">در حال بارگذاری...</div>
    );
  }

  const isSupport = session.roleId === "role-support";
  const isSales = session.roleId === "role-sales";
  const canSeeProducts = hasAdminPermission(session, "products");
  const canSeeDiscounts = hasAdminPermission(session, "discounts");
  const canSeeUsers = hasAdminPermission(session, "users");
  const recentOrders = adminOrders.slice(0, isSupport ? 6 : 5);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`داشبورد ${session.roleName}`}
        description={
          isSupport
            ? "نمای پشتیبانی: سفارش‌های اخیر و وضعیت مشتریان"
            : isSales
              ? "نمای فروش: عملکرد فروش، موجودی و تخفیف‌ها"
              : "خلاصه کامل فروش و وضعیت فروشگاه رزین‌مال"
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {!isSupport ? (
          <>
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
          </>
        ) : (
          <>
            <AdminStatCard
              label="سفارش در انتظار"
              value={adminStats.pendingOrders.toLocaleString("fa-IR")}
              hint="نیاز به پیگیری پشتیبانی"
            />
            <AdminStatCard
              label="سفارش‌های امروز"
              value={adminStats.ordersToday.toLocaleString("fa-IR")}
              hint="ثبت‌شده در ۲۴ ساعت اخیر"
            />
          </>
        )}

        {canSeeUsers || isSupport ? (
          <AdminStatCard
            label="کاربران جدید (هفته)"
            value={adminStats.newUsersWeek.toLocaleString("fa-IR")}
            hint="ثبت‌نام‌های اخیر"
          />
        ) : (
          <AdminStatCard
            label="سفارش ماه"
            value={adminStats.ordersMonth.toLocaleString("fa-IR")}
            hint="کل سفارش‌های این ماه"
          />
        )}

        {canSeeProducts ? (
          <AdminStatCard
            label="محصولات فعال"
            value={adminStats.activeProducts.toLocaleString("fa-IR")}
            hint="در فروشگاه نمایش داده می‌شوند"
          />
        ) : (
          <AdminStatCard
            label="سفارش فعال"
            value={(
              adminStats.pendingOrders + 12
            ).toLocaleString("fa-IR")}
            hint="در حال پردازش یا ارسال"
          />
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AdminCard className="border border-[#efe6d4] bg-gradient-to-br from-white to-[#fff8e8]">
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

        {canSeeProducts ? (
          <AdminCard className="border border-[#efe6d4] bg-gradient-to-br from-white to-[#fdeeee]">
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
        ) : (
          <AdminCard className="border border-[#efe6d4] bg-gradient-to-br from-white to-[#eef6ff]">
            <p className="text-sm text-muted">پیگیری ارسال</p>
            <p className="mt-2 text-3xl font-bold text-[#1f5a8a]">
              ۱۲
            </p>
            <Link
              href="/admin/orders"
              className="mt-3 inline-block text-sm font-medium text-brand hover:text-brand-dark"
            >
              سفارش‌های در حال ارسال
            </Link>
          </AdminCard>
        )}

        {canSeeDiscounts ? (
          <AdminCard className="border border-[#efe6d4] bg-gradient-to-br from-white to-[#f4eef9]">
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
        ) : canSeeUsers ? (
          <AdminCard className="border border-[#efe6d4] bg-gradient-to-br from-white to-[#eef8f1]">
            <p className="text-sm text-muted">کاربران فعال</p>
            <p className="mt-2 text-3xl font-bold text-[#2f6b45]">
              {(adminStats.newUsersWeek + 120).toLocaleString("fa-IR")}
            </p>
            <Link
              href="/admin/users"
              className="mt-3 inline-block text-sm font-medium text-brand hover:text-brand-dark"
            >
              مشاهده کاربران
            </Link>
          </AdminCard>
        ) : (
          <AdminCard className="border border-[#efe6d4] bg-gradient-to-br from-white to-[#f4eef9]">
            <p className="text-sm text-muted">نرخ تکمیل سفارش</p>
            <p className="mt-2 text-3xl font-bold text-brand">۸۴٪</p>
            <p className="mt-3 text-sm text-muted">بر اساس سفارش‌های ماه جاری</p>
          </AdminCard>
        )}
      </div>

      <AdminCharts
        showSales={!isSupport}
        showProducts={canSeeProducts}
      />

      <AdminCard>
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-brand hover:text-brand-dark"
          >
            مشاهده همه
          </Link>
          <h2 className="text-lg font-bold text-foreground">
            {isSupport ? "سفارش‌های نیازمند پیگیری" : "آخرین سفارش‌ها"}
          </h2>
        </div>

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
                {!isSupport ? (
                  <p className="text-sm font-bold text-brand">
                    {formatProductPrice(order.total)}
                  </p>
                ) : (
                  <p className="text-sm text-muted" dir="ltr">
                    {order.phone}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
