import type { Metadata } from "next";
import { DashboardOrders } from "@/components/dashboard/DashboardOrders";
import { getMyOrders } from "@/lib/api/account";

export const metadata: Metadata = {
  title: "سفارش‌ها | داشبورد رزین‌مال",
  description: "مشاهده سفارش‌های ثبت‌شده در حساب کاربری رزین‌مال.",
};

export default async function DashboardOrdersPage() {
  const orders = await getMyOrders();
  return <DashboardOrders orders={orders} />;
}
