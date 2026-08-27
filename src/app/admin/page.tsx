import type { Metadata } from "next";
import { AdminOverview } from "@/components/admin/AdminOverview";

export const metadata: Metadata = {
  title: "داشبورد ادمین | رزین‌مال",
  description: "خلاصه فروش و وضعیت فروشگاه رزین‌مال.",
};

export default function AdminPage() {
  return <AdminOverview />;
}
