import type { Metadata } from "next";
import { AdminCategoriesPage } from "@/components/admin/AdminCategoriesPage";
import { getAdminCategories } from "@/lib/api/admin";
import { requirePanelPermission } from "@/lib/auth/guard";

export const metadata: Metadata = {
  title: "دسته‌بندی‌ها | پنل ادمین",
  description: "مدیریت دسته‌بندی محصولات رزین‌مال.",
};

export default async function Page() {
  await requirePanelPermission("panel_products");
  const categories = await getAdminCategories();
  return <AdminCategoriesPage categories={categories} />;
}
