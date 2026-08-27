import type { Metadata } from "next";
import { DashboardProfile } from "@/components/dashboard/DashboardProfile";

export const metadata: Metadata = {
  title: "پروفایل | داشبورد رزین‌مال",
  description: "ویرایش اطلاعات پروفایل کاربری در رزین‌مال.",
};

export default function DashboardProfilePage() {
  return <DashboardProfile />;
}
