import type { Metadata } from "next";
import { DashboardPasswordCard } from "@/components/dashboard/DashboardPasswordCard";
import { DashboardProfile } from "@/components/dashboard/DashboardProfile";

export const metadata: Metadata = {
  title: "پروفایل | داشبورد رزین‌مال",
  description: "ویرایش اطلاعات پروفایل کاربری در رزین‌مال.",
};

export default function DashboardProfilePage() {
  return (
    <div className="space-y-4">
      <DashboardProfile />
      <DashboardPasswordCard />
    </div>
  );
}
