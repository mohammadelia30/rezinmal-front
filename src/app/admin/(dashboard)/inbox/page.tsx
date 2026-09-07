import type { Metadata } from "next";
import { NotificationInbox } from "@/components/NotificationInbox";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { getInbox } from "@/lib/api/admin";
import { requirePanelPermission } from "@/lib/auth/guard";

export const metadata: Metadata = {
  title: "صندوق پیام | پنل ادمین",
  description: "اعلان‌های مدیریتی رزین‌مال.",
};

export default async function Page() {
  await requirePanelPermission("panel_dashboard");
  const items = await getInbox();

  return (
    <div>
      <AdminPageHeader
        title="صندوق پیام"
        description="اعلان‌های سیستم، از جمله هشدار کاهش موجودی"
      />
      <NotificationInbox items={items} emptyMessage="اعلانی وجود ندارد." />
    </div>
  );
}
