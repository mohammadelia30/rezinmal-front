import type { Metadata } from "next";
import { DashboardFavorites } from "@/components/dashboard/DashboardFavorites";

export const metadata: Metadata = {
  title: "علاقه‌مندی‌ها | داشبورد رزین‌مال",
  description: "مدیریت محصولات مورد علاقه در حساب کاربری رزین‌مال.",
};

export default function DashboardFavoritesPage() {
  return <DashboardFavorites />;
}
