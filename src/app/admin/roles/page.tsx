import type { Metadata } from "next";
import { AdminRolesPage } from "@/components/admin/AdminRolesPage";

export const metadata: Metadata = {
  title: "نقش‌ها | پنل ادمین",
  description: "مدیریت نقش‌ها و دسترسی‌های پنل ادمین.",
};

export default function Page() {
  return <AdminRolesPage />;
}
