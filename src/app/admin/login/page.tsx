import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "ورود ادمین | رزین‌مال",
  description: "ورود به پنل مدیریت فروشگاه رزین‌مال.",
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
