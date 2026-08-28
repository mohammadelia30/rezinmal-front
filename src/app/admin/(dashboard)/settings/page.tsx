import type { Metadata } from "next";
import { AdminSettingsPage } from "@/components/admin/AdminSettingsPage";
import { getSiteSettings } from "@/lib/api/admin";
import { requirePanelPermission } from "@/lib/auth/guard";

export const metadata: Metadata = {
  title: "تنظیمات | پنل ادمین",
  description: "تنظیمات فروشگاه رزین‌مال.",
};

const EMPTY_SETTINGS = {
  shop_name: "",
  phone: "",
  email: "",
  address: "",
  shipping_cost: 0,
  free_shipping_min: 0,
  payment_enabled: true,
  maintenance_mode: false,
};

export default async function Page() {
  await requirePanelPermission("panel_settings");
  const settings = await getSiteSettings();
  return <AdminSettingsPage initialSettings={settings ?? EMPTY_SETTINGS} />;
}
