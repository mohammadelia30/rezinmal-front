import type { Metadata } from "next";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";

export const metadata: Metadata = {
  title: "داشبورد | رزین‌مال",
  description: "مدیریت حساب کاربری، سفارش‌ها و پروفایل در رزین‌مال.",
};

export default function DashboardPage() {
  return <DashboardOverview />;
}
