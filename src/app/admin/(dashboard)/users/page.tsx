import type { Metadata } from "next";
import { AdminUsersPage } from "@/components/admin/AdminUsersPage";
import { getAdminRoles, getAdminUsers } from "@/lib/api/admin";
import { requirePanelPermission } from "@/lib/auth/guard";

export const metadata: Metadata = {
  title: "کاربران | پنل ادمین",
  description: "مدیریت کاربران فروشگاه رزین‌مال.",
};

export default async function Page() {
  await requirePanelPermission("panel_users");
  const [users, roles] = await Promise.all([getAdminUsers(), getAdminRoles()]);
  return <AdminUsersPage users={users} roles={roles} />;
}
