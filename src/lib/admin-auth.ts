import type { AdminPermission } from "@/data/admin";

/**
 * هویت ادمین کاملاً از بک‌اند می‌آید.
 *
 * قبلاً حساب‌ها و دسترسی‌ها در همین فایل hardcode بودند و نشست در
 * sessionStorage ذخیره می‌شد؛ یعنی هر کاربری می‌توانست با ویرایش
 * sessionStorage خودش را مدیر کل کند. حالا تنها منبع حقیقت،
 * فیلد is_staff در پاسخ بک‌اند است و بررسی نهایی سمت سرور انجام می‌شود.
 */

export type AdminSession = {
  phoneNumber: string;
  displayName: string;
  isStaff: boolean;
  isSuperuser: boolean;
  permissions: AdminPermission[];
};

export type SessionUserPayload = {
  phoneNumber: string;
  firstName: string | null;
  lastName: string | null;
  isStaff: boolean;
  isSuperuser: boolean;
  isCompleted: boolean;
  panelPermissions: string[];
};

/** codenameهای بک‌اند؛ ترتیبشان ترتیب نمایش در صفحهٔ نقش‌هاست. */
export const PANEL_PERMISSIONS = [
  "panel_dashboard",
  "panel_orders",
  "panel_invoices",
  "panel_products",
  "panel_discounts",
  "panel_users",
  "panel_roles",
  "panel_settings",
] as const;

/** panel_orders → orders */
export function toPanelPermission(codename: string): string {
  return codename.replace(/^panel_/, "");
}

export const adminNavItems: {
  href: string;
  label: string;
  exact: boolean;
  permission: AdminPermission;
}[] = [
  { href: "/admin", label: "داشبورد", exact: true, permission: "dashboard" },
  { href: "/admin/orders", label: "سفارش‌ها", exact: false, permission: "orders" },
  {
    href: "/admin/invoices",
    label: "فاکتورها",
    exact: false,
    permission: "invoices",
  },
  {
    href: "/admin/products",
    label: "محصولات",
    exact: false,
    permission: "products",
  },
  {
    href: "/admin/discounts",
    label: "کد تخفیف",
    exact: false,
    permission: "discounts",
  },
  { href: "/admin/users", label: "کاربران", exact: false, permission: "users" },
  {
    href: "/admin/roles",
    label: "نقش‌ها و دسترسی‌ها",
    exact: false,
    permission: "roles",
  },
  {
    href: "/admin/settings",
    label: "تنظیمات",
    exact: false,
    permission: "settings",
  },
];

export function toAdminSession(user: SessionUserPayload): AdminSession | null {
  if (!user.isStaff && !user.isSuperuser) return null;

  const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  return {
    phoneNumber: user.phoneNumber,
    displayName: name || user.phoneNumber,
    isStaff: user.isStaff,
    isSuperuser: user.isSuperuser,
    // دسترسی‌ها از نقش‌های واقعی کاربر در بک‌اند می‌آید
    permissions: (user.panelPermissions ?? []).map(
      (codename) => toPanelPermission(codename) as AdminPermission,
    ),
  };
}

export function getPermissionForPath(pathname: string): AdminPermission | null {
  if (pathname === "/admin" || pathname === "/admin/") return "dashboard";

  const match = adminNavItems
    .filter((item) => !item.exact && pathname.startsWith(item.href))
    .sort((a, b) => b.href.length - a.href.length)[0];

  return match?.permission ?? null;
}

export function getDefaultAdminRoute(permissions: AdminPermission[]) {
  const first = adminNavItems.find((item) =>
    permissions.includes(item.permission),
  );
  return first?.href ?? "/admin/login";
}

export function hasAdminPermission(
  session: AdminSession | null,
  permission: AdminPermission,
) {
  return Boolean(session?.permissions.includes(permission));
}

/** نشست فعلی را از سرور می‌پرسد؛ توکن هرگز به کلاینت داده نمی‌شود. */
export async function fetchSessionUser(): Promise<SessionUserPayload | null> {
  try {
    const response = await fetch("/auth/session", {
      cache: "no-store",
      credentials: "same-origin",
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { user: SessionUserPayload | null };
    return data.user;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch("/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });
  } catch {
    // حتی اگر شبکه قطع باشد، هدایت به صفحهٔ ورود انجام می‌شود
  }
}
