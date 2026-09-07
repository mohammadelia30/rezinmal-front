import type { Metadata } from "next";
import { AdminDiscountsPage } from "@/components/admin/AdminDiscountsPage";
import {
  getAdminCategories,
  getAdminDiscounts,
  getAdminProductDetails,
  getClubLevels,
} from "@/lib/api/admin";
import { requirePanelPermission } from "@/lib/auth/guard";

export const metadata: Metadata = {
  title: "کد تخفیف | پنل ادمین",
  description: "مدیریت کدهای تخفیف فروشگاه رزین‌مال.",
};

export default async function Page() {
  await requirePanelPermission("panel_discounts");

  const [discounts, categories, products, levels] = await Promise.all([
    getAdminDiscounts(),
    getAdminCategories(),
    getAdminProductDetails(),
    getClubLevels(),
  ]);

  return (
    <AdminDiscountsPage
      discounts={discounts}
      categories={categories.map((item) => ({
        id: item.id,
        title: item.title,
      }))}
      products={products.map((item) => ({ id: item.id, title: item.title }))}
      levels={levels.map((item) => ({ id: item.id, name: item.name }))}
    />
  );
}
