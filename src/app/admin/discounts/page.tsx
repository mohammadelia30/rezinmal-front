import type { Metadata } from "next";
import { AdminDiscountsPage } from "@/components/admin/AdminDiscountsPage";

export const metadata: Metadata = {
  title: "کد تخفیف | پنل ادمین",
  description: "مدیریت کدهای تخفیف فروشگاه رزین‌مال.",
};

export default function Page() {
  return <AdminDiscountsPage />;
}
