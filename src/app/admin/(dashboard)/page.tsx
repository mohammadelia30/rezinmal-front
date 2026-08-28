import type { Metadata } from "next";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { getAdminOrders, getReportOverview } from "@/lib/api/admin";

export const metadata: Metadata = {
  title: "داشبورد ادمین | رزین‌مال",
  description: "خلاصه فروش و وضعیت فروشگاه رزین‌مال.",
};

export default async function AdminPage() {
  const [overview, orders] = await Promise.all([
    getReportOverview(),
    getAdminOrders(),
  ]);
  return <AdminOverview overview={overview} orders={orders} />;
}
