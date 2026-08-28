import type { Metadata } from "next";
import { AdminOrdersPage } from "@/components/admin/AdminOrdersPage";
import { getAdminOrders } from "@/lib/api/admin";

export const metadata: Metadata = {
  title: "سفارش‌ها | پنل ادمین",
  description: "مدیریت سفارش‌های فروشگاه رزین‌مال.",
};

export default async function Page() {
  const orders = await getAdminOrders();
  return <AdminOrdersPage orders={orders} />;
}
