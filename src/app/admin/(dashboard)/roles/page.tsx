import type { Metadata } from "next";
import { AdminRolesPage } from "@/components/admin/AdminRolesPage";
import { getAdminRoles } from "@/lib/api/admin";
import { requirePanelPermission } from "@/lib/auth/guard";

export const metadata: Metadata = {
  title: "نقش‌ها | پنل ادمین",
  description: "مدیریت نقش‌ها و دسترسی‌های پنل رزین‌مال.",
};

export default async function Page() {
  await requirePanelPermission("panel_roles");
  const roles = await getAdminRoles();
  return <AdminRolesPage roles={roles} />;
}
