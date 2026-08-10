import type { Metadata } from "next";
import { AdminOrdersPage } from "@/components/admin/AdminOrdersPage";

export const metadata: Metadata = {
  title: "سفارش‌ها | پنل ادمین",
  description: "مدیریت سفارش‌های فروشگاه رزین‌مال.",
};

export default function Page() {
  return <AdminOrdersPage />;
}
