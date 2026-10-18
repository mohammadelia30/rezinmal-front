import type { Metadata } from "next";
import { AdminArticlesPage } from "@/components/admin/AdminArticlesPage";
import { getAdminArticles } from "@/lib/api/admin";
import { requirePanelPermission } from "@/lib/auth/guard";

export const metadata: Metadata = {
  title: "مقالات | پنل ادمین",
  description: "نوشتن و مدیریت مقالات بلاگ رزین‌مال.",
};

export default async function Page() {
  await requirePanelPermission("panel_articles");
  const articles = await getAdminArticles();
  return <AdminArticlesPage articles={articles} />;
}
