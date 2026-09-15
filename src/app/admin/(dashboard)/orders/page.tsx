import type { Metadata } from "next";
import { AdminOrdersPage } from "@/components/admin/AdminOrdersPage";
import { getAdminOrders } from "@/lib/api/admin";
import { requirePanelPermission } from "@/lib/auth/guard";

export const metadata: Metadata = {
  title: "سفارش‌ها | پنل ادمین",
  description: "مدیریت سفارش‌های فروشگاه رزین‌مال.",
};

export default async function Page() {
  await requirePanelPermission("panel_orders");
  const orders = await getAdminOrders();
  return <AdminOrdersPage orders={orders} />;
}
