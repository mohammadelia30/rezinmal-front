import type { Metadata } from "next";
import { AdminClubPage } from "@/components/admin/AdminClubPage";
import { getClubLevels, getClubMembers } from "@/lib/api/admin";
import { requirePanelPermission } from "@/lib/auth/guard";

export const metadata: Metadata = {
  title: "باشگاه مشتریان | پنل ادمین",
  description: "سطوح و اعضای باشگاه مشتریان رزین‌مال.",
};

export default async function Page() {
  await requirePanelPermission("panel_users");
  const [levels, members] = await Promise.all([
    getClubLevels(),
    getClubMembers(),
  ]);
  return <AdminClubPage levels={levels} members={members} />;
}
