import type { Metadata } from "next";
import { AdminInventoryPage } from "@/components/admin/AdminInventoryPage";
import { getInventories } from "@/lib/api/admin";
import { requirePanelPermission } from "@/lib/auth/guard";

export const metadata: Metadata = {
  title: "موجودی | پنل ادمین",
  description: "مدیریت موجودی انبار رزین‌مال.",
};

export default async function Page() {
  await requirePanelPermission("panel_products");
  const rows = await getInventories();
  return <AdminInventoryPage rows={rows} />;
}
