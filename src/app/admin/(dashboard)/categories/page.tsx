import type { Metadata } from "next";
import { AdminCategoriesPage } from "@/components/admin/AdminCategoriesPage";
import { getAdminCategories, getAdminProductDetails } from "@/lib/api/admin";
import { requirePanelPermission } from "@/lib/auth/guard";

export const metadata: Metadata = {
  title: "دسته‌بندی‌ها | پنل ادمین",
  description: "مدیریت دسته‌بندی محصولات رزین‌مال.",
};

export default async function Page() {
  await requirePanelPermission("panel_products");
  // فهرست محصولات برای ابزار افزایش گروهی قیمت لازم است؛ همان یک
  // درخواستی است که صفحهٔ محصولات هم می‌زند
  const [categories, products] = await Promise.all([
    getAdminCategories(),
    getAdminProductDetails(),
  ]);
  return (
    <AdminCategoriesPage categories={categories} products={products} />
  );
}
