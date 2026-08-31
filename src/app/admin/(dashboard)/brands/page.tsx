import type { Metadata } from "next";
import { AdminBrandsPage } from "@/components/admin/AdminBrandsPage";
import { getAdminBrands } from "@/lib/api/admin";
import { requirePanelPermission } from "@/lib/auth/guard";

export const metadata: Metadata = {
  title: "برندها | پنل ادمین",
  description: "مدیریت برندهای رزین‌مال.",
};

export default async function Page() {
  await requirePanelPermission("panel_products");
  const brands = await getAdminBrands();
  return <AdminBrandsPage brands={brands} />;
}
