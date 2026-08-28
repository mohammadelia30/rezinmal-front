import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getSessionUser, isStaff } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * دروازهٔ پنل مدیریت.
 *
 * بررسی روی سرور انجام می‌شود؛ محافظت سمت کلاینت به‌تنهایی با غیرفعال
 * کردن جاوااسکریپت یا دستکاری state قابل دور زدن است.
 */
export default async function AdminProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (!isStaff(user)) {
    redirect("/admin/login?error=forbidden");
  }

  const displayName =
    `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() ||
    user.phone_number;

  return (
    <AdminShell
      session={{
        phoneNumber: user.phone_number,
        displayName,
        isStaff: Boolean(user.is_staff),
        isSuperuser: Boolean(user.is_superuser),
      }}
    >
      {children}
    </AdminShell>
  );
}
