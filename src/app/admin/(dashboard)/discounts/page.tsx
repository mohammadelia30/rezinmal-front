import type { Metadata } from "next";
import { AdminDiscountsPage } from "@/components/admin/AdminDiscountsPage";
import {
  getAdminCategories,
  getAdminCoupons,
  getAdminProductDetails,
  getAdminProductDiscounts,
  getClubLevels,
} from "@/lib/api/admin";
import { requirePanelPermission } from "@/lib/auth/guard";

export const metadata: Metadata = {
  title: "تخفیف‌ها | پنل ادمین",
  description: "مدیریت کدهای تخفیف و تخفیف محصولات فروشگاه رزین‌مال.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  await requirePanelPermission("panel_discounts");

  const [{ tab }, coupons, categories, products, levels] = await Promise.all([
    searchParams,
    getAdminCoupons(),
    getAdminCategories(),
    getAdminProductDetails(),
    getClubLevels(),
  ]);

  const productOptions = products.map((item) => ({ id: item.id, title: item.title }));
  const categoryOptions = categories.map((item) => ({ id: item.id, title: item.title }));

  const productDiscounts = await getAdminProductDiscounts({
    products: new Map(productOptions.map((item) => [item.id, item.title])),
    categories: new Map(categoryOptions.map((item) => [item.id, item.title])),
  });

  return (
    <AdminDiscountsPage
      initialTab={tab === "products" ? "products" : "coupons"}
      coupons={coupons}
      productDiscounts={productDiscounts}
      categories={categoryOptions}
      products={productOptions}
      levels={levels.map((item) => ({ id: item.id, name: item.name }))}
    />
  );
}
