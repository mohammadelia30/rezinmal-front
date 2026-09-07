import type { Metadata } from "next";
import { NotificationInbox } from "@/components/NotificationInbox";
import { getInbox } from "@/lib/api/admin";

export const metadata: Metadata = {
  title: "پیام‌ها | داشبورد رزین‌مال",
  description: "اعلان‌های حساب کاربری شما.",
};

export default async function Page() {
  const items = await getInbox();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-5 shadow-[0_4px_20px_rgba(78,42,84,0.06)] sm:p-6">
        <h2 className="text-right text-lg font-bold text-foreground">پیام‌ها</h2>
        <p className="mt-1 text-right text-sm text-muted">
          اطلاع‌رسانی‌های مربوط به سفارش‌ها و حساب شما
        </p>
      </div>
      <NotificationInbox items={items} />
    </div>
  );
}
