import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { getAdminOrders, getReportOverview } from "@/lib/api/admin";
import { adminNavItems, toPanelPermission } from "@/lib/admin-auth";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "داشبورد ادمین | رزین‌مال",
  description: "خلاصه فروش و وضعیت فروشگاه رزین‌مال.",
};

/**
 * داشبورد پنل.
 *
 * مدیری که دسترسی داشبورد را ندارد، به‌جای دیدن صفحهٔ خالی، به اولین
 * بخشی که اجازه‌اش را دارد می‌رود؛ و مدیری که هنوز هیچ نقشی نگرفته
 * پیام روشن می‌بیند. قبلاً چنین مدیری بعد از ورود موفق به صفحهٔ ورود
 * برمی‌گشت و فکر می‌کرد اجازهٔ ورود ندارد.
 */
export default async function AdminPage() {
  const user = await getSessionUser();
  const permissions = (user?.panel_permissions ?? []).map(toPanelPermission);
  const canSeeDashboard =
    Boolean(user?.is_superuser) || permissions.includes("dashboard");

  if (!canSeeDashboard) {
    const firstAllowed = adminNavItems.find(
      (item) => item.href !== "/admin" && permissions.includes(item.permission),
    );

    if (firstAllowed) {
      redirect(firstAllowed.href);
    }

    return <NoSectionsYet />;
  }

  const [overview, orders] = await Promise.all([
    getReportOverview(),
    getAdminOrders(),
  ]);

  return <AdminOverview overview={overview} orders={orders} />;
}

function NoSectionsYet() {
  return (
    <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-[0_4px_20px_rgba(78,42,84,0.06)]">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#fff3d6] text-2xl text-[#8a6a1f]">
        !
      </div>
      <h1 className="text-lg font-bold text-foreground">
        هنوز دسترسی‌ای به شما داده نشده
      </h1>
      <p className="mt-2 text-sm leading-7 text-muted">
        حساب شما مدیر است، ولی هیچ بخشی از پنل برایتان فعال نشده. از مدیر کل
        بخواهید از بخش «نقش‌ها و دسترسی‌ها» یک نقش به حساب شما بدهد.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-xl border border-[#e6dcc2] px-5 py-3 text-sm font-bold text-brand transition hover:bg-[#f6f1e7]"
      >
        بازگشت به فروشگاه
      </Link>
    </div>
  );
}
