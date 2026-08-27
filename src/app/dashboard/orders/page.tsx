import type { Metadata } from "next";
import { DashboardOrders } from "@/components/dashboard/DashboardOrders";

export const metadata: Metadata = {
  title: "سفارش‌ها | داشبورد رزین‌مال",
  description: "مشاهده سفارش‌های ثبت‌شده در حساب کاربری رزین‌مال.",
};

export default function DashboardOrdersPage() {
  return <DashboardOrders />;
}
