import type { Metadata } from "next";
import { AdminProductsPage } from "@/components/admin/AdminProductsPage";

export const metadata: Metadata = {
  title: "محصولات | پنل ادمین",
  description: "مدیریت محصولات فروشگاه رزین‌مال.",
};

export default function Page() {
  return <AdminProductsPage />;
}
