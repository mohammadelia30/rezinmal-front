import type { Metadata } from "next";
import { AdminUsersPage } from "@/components/admin/AdminUsersPage";

export const metadata: Metadata = {
  title: "کاربران | پنل ادمین",
  description: "مدیریت کاربران فروشگاه رزین‌مال.",
};

export default function Page() {
  return <AdminUsersPage />;
}
