import type { Metadata } from "next";
import { AdminDiscountsPage } from "@/components/admin/AdminDiscountsPage";
import { getAdminDiscounts } from "@/lib/api/admin";

export const metadata: Metadata = {
  title: "کد تخفیف | پنل ادمین",
  description: "مدیریت کدهای تخفیف فروشگاه رزین‌مال.",
};

export default async function Page() {
  const discounts = await getAdminDiscounts();
  return <AdminDiscountsPage discounts={discounts} />;
}
