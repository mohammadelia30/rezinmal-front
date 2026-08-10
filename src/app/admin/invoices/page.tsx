import type { Metadata } from "next";
import { AdminInvoicesPage } from "@/components/admin/AdminInvoicesPage";

export const metadata: Metadata = {
  title: "فاکتورها | پنل ادمین",
  description: "مدیریت فاکتورهای فروشگاه رزین‌مال.",
};

export default function Page() {
  return <AdminInvoicesPage />;
}
