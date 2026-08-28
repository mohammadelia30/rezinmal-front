import { redirect } from "next/navigation";
import { getSessionUser, isStaff } from "@/lib/auth/session";

/**
 * بررسی دسترسی یک بخش از پنل، روی سرور.
 *
 * بک‌اند هم همین دسترسی را جداگانه چک می‌کند؛ این لایه فقط جلوی
 * باز شدن صفحه را می‌گیرد تا کاربر با خطای خالی روبه‌رو نشود.
 */
export async function requirePanelPermission(codename: string) {
  const user = await getSessionUser();

  if (!user || !isStaff(user)) {
    redirect("/admin/login");
  }

  if (user.is_superuser) return user;

  if (!(user.panel_permissions ?? []).includes(codename)) {
    redirect("/admin?error=forbidden");
  }

  return user;
}
