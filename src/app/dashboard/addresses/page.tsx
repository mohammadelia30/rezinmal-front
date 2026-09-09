import type { Metadata } from "next";
import { DashboardAddresses } from "@/components/dashboard/DashboardAddresses";

export const metadata: Metadata = {
  title: "آدرس‌ها | داشبورد رزین‌مال",
  description: "مدیریت آدرس‌های تحویل سفارش.",
};

export default function Page() {
  return <DashboardAddresses />;
}
