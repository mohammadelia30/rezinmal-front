import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminUserDetailPage } from "@/components/admin/AdminUserDetail";
import {
  getAdminRoles,
  getAdminUser,
  getAdminUserOrders,
} from "@/lib/api/admin";
import { requirePanelPermission } from "@/lib/auth/guard";

export const metadata: Metadata = {
  title: "پروفایل کاربر | پنل ادمین",
  description: "مشاهدهٔ پروفایل و مدیریت دسترسی کاربر.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePanelPermission("panel_users");
  const { id } = await params;

  const [user, roles, orders] = await Promise.all([
    getAdminUser(id),
    getAdminRoles(),
    getAdminUserOrders(id),
  ]);

  if (!user) notFound();

  return (
    <AdminUserDetailPage user={user} roles={roles} orders={orders} />
  );
}
