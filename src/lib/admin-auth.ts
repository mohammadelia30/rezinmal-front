import {
  allPermissions,
  defaultRoles,
  type AdminPermission,
} from "@/data/admin";

const ADMIN_SESSION_KEY = "admin:session";

export type AdminSession = {
  username: string;
  displayName: string;
  roleId: string;
  roleName: string;
  permissions: AdminPermission[];
  loggedInAt: string;
};

export type AdminDemoAccount = {
  username: string;
  password: string;
  displayName: string;
  roleId: string;
  description: string;
};

export const adminDemoAccounts: AdminDemoAccount[] = [
  {
    username: "admin",
    password: "admin123",
    displayName: "مدیر کل",
    roleId: "role-super",
    description: "دسترسی کامل به همه بخش‌ها",
  },
  {
    username: "sales",
    password: "sales123",
    displayName: "مدیر فروش",
    roleId: "role-sales",
    description: "سفارش، فاکتور، محصول و تخفیف",
  },
  {
    username: "support",
    password: "support123",
    displayName: "پشتیبانی",
    roleId: "role-support",
    description: "سفارش‌ها و کاربران",
  },
];

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

function resolveRole(roleId: string) {
  return (
    defaultRoles.find((role) => role.id === roleId) ?? {
      id: roleId,
      name: "بدون نقش",
      description: "",
      permissions: ["dashboard"] as AdminPermission[],
    }
  );
}

export function findAdminAccount(username: string, password: string) {
  return adminDemoAccounts.find(
    (account) =>
      account.username === username.trim() && account.password === password,
  );
}

export function validateAdminCredentials(username: string, password: string) {
  return Boolean(findAdminAccount(username, password));
}

export function saveAdminSession(username: string) {
  const account = adminDemoAccounts.find(
    (item) => item.username === username.trim(),
  );
  if (!account) return;

  const role = resolveRole(account.roleId);
  const session: AdminSession = {
    username: account.username,
    displayName: account.displayName,
    roleId: role.id,
    roleName: role.name,
    permissions:
      role.id === "role-super" ? [...allPermissions] : [...role.permissions],
    loggedInAt: new Date().toISOString(),
  };
  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

export function readAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AdminSession;
    if (!parsed.roleId || !parsed.permissions) {
      clearAdminSession();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

export function isAdminLoggedIn() {
  return Boolean(readAdminSession());
}

export function hasAdminPermission(
  session: AdminSession | null,
  permission: AdminPermission,
) {
  return Boolean(session?.permissions.includes(permission));
}
