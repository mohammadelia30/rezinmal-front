"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { adminNavItems, logout } from "@/lib/admin-auth";
import type { AdminPermission } from "@/data/admin";

export type AdminShellSession = {
  phoneNumber: string;
  displayName: string;
  isStaff: boolean;
  isSuperuser: boolean;
  permissions: AdminPermission[];
};

/**
 * پوستهٔ پنل مدیریت.
 *
 * نشست به‌صورت prop از لایهٔ سرور می‌آید؛ اینجا هیچ تصمیم امنیتی گرفته
 * نمی‌شود و ورود غیرمجاز پیش از رندر روی سرور رد شده است.
 */
export function AdminShell({
  session,
  children,
}: {
  session: AdminShellSession;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    router.replace("/admin/login");
    router.refresh();
  };

  const roleLabel = session.isSuperuser ? "مدیر کل" : "مدیر";

  // منو فقط بخش‌هایی را نشان می‌دهد که کاربر واقعاً دسترسی دارد؛
  // بررسی اصلی روی سرور و در بک‌اند انجام می‌شود.
  const visibleNav = adminNavItems.filter((item) =>
    session.permissions.includes(item.permission),
  );

  return (
    <div className="flex min-h-dvh bg-[#f6f1e7]">
      <aside
        className={`fixed inset-y-0 right-0 z-40 flex w-64 flex-col border-l border-[#efe6d4] bg-white transition-transform lg:static lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="border-b border-[#efe6d4] px-4 py-5">
          <BrandLogo
            size={36}
            imageClassName="h-9 w-9 rounded-full object-cover"
            textClassName="text-lg font-bold text-brand"
          />
          <p className="mt-2 text-xs text-muted">پنل مدیریت فروشگاه</p>
          <span className="mt-3 inline-flex rounded-full bg-brand-mist px-2.5 py-1 text-[11px] font-bold text-brand">
            {roleLabel}
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto p-3" aria-label="منوی ادمین">
          <ul className="space-y-1">
            {visibleNav.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-brand text-white shadow-md shadow-brand/20"
                        : "text-[#4a3a50] hover:bg-brand-mist hover:text-brand"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-[#efe6d4] p-3">
          <p className="mb-1 px-2 text-sm font-bold text-foreground">
            {session.displayName}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full rounded-xl border border-[#e6dcc2] px-4 py-2.5 text-sm font-medium text-[#8a3a3a] transition hover:bg-[#fff5f5] disabled:opacity-60"
          >
            {loggingOut ? "در حال خروج..." : "خروج از پنل"}
          </button>
          <Link
            href="/"
            className="mt-2 block text-center text-xs text-brand transition hover:text-brand-dark"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      </aside>

      {menuOpen ? (
        <button
          type="button"
          aria-label="بستن منو"
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[#efe6d4] bg-[#f6f1e7]/95 px-4 backdrop-blur-sm lg:h-16 lg:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-foreground transition hover:bg-brand-mist lg:hidden"
            aria-label="باز کردن منو"
            onClick={() => setMenuOpen(true)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="size-6"
              aria-hidden
            >
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
          <p className="text-sm font-bold text-foreground lg:text-base">
            پنل {roleLabel}
          </p>
          <span className="hidden rounded-full bg-white px-3 py-1 text-xs font-medium text-muted shadow-sm lg:inline">
            {session.displayName}
          </span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
