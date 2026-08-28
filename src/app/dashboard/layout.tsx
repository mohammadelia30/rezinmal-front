import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/** داشبورد فقط برای کاربر واردشده؛ بررسی روی سرور انجام می‌شود. */
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
