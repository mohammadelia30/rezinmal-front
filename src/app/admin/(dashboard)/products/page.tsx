import type { Metadata } from "next";
import { AdminProductsPage } from "@/components/admin/AdminProductsPage";
import {
  getAdminBrands,
  getAdminCategories,
  getAdminProductDetails,
} from "@/lib/api/admin";
import { requirePanelPermission } from "@/lib/auth/guard";

export const metadata: Metadata = {
  title: "محصولات | پنل ادمین",
  description: "مدیریت محصولات فروشگاه رزین‌مال.",
};

export default async function Page() {
  await requirePanelPermission("panel_products");
  const [products, categories, brands] = await Promise.all([
    getAdminProductDetails(),
    getAdminCategories(),
    getAdminBrands(),
  ]);
  return (
    <AdminProductsPage
      products={products}
      categories={categories}
      brands={brands}
    />
  );
}
