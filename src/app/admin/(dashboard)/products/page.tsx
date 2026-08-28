import type { Metadata } from "next";
import { AdminProductsPage } from "@/components/admin/AdminProductsPage";
import { getAdminProducts } from "@/lib/api/admin";

export const metadata: Metadata = {
  title: "محصولات | پنل ادمین",
  description: "مدیریت محصولات فروشگاه رزین‌مال.",
};

export default async function Page() {
  const products = await getAdminProducts();
  return <AdminProductsPage products={products} />;
}
