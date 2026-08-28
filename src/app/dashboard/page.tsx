import type { Metadata } from "next";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { getMyOrders, summarizeOrders } from "@/lib/api/account";

export const metadata: Metadata = {
  title: "داشبورد | رزین‌مال",
  description: "مدیریت حساب کاربری، سفارش‌ها و پروفایل در رزین‌مال.",
};

export default async function DashboardPage() {
  const orders = await getMyOrders();
  return <DashboardOverview orders={orders} stats={summarizeOrders(orders)} />;
}
