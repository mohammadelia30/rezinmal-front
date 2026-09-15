import type { Metadata } from "next";
import { AdminInvoicesPage } from "@/components/admin/AdminInvoicesPage";
import { getAdminInvoices } from "@/lib/api/admin";
import { requirePanelPermission } from "@/lib/auth/guard";

export const metadata: Metadata = {
  title: "فاکتورها | پنل ادمین",
  description: "مدیریت فاکتورهای فروشگاه رزین‌مال.",
};

export default async function Page() {
  await requirePanelPermission("panel_invoices");
  const invoices = await getAdminInvoices();
  return <AdminInvoicesPage invoices={invoices} />;
}
