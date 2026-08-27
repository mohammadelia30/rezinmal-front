import type { Metadata } from "next";
import { AdminSettingsPage } from "@/components/admin/AdminSettingsPage";

export const metadata: Metadata = {
  title: "تنظیمات | پنل ادمین",
  description: "تنظیمات فروشگاه رزین‌مال.",
};

export default function Page() {
  return <AdminSettingsPage />;
}
