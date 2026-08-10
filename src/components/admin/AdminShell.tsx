"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import {
  clearAdminSession,
  readAdminSession,
  type AdminSession,
} from "@/lib/admin-auth";

const navItems = [
  { href: "/admin", label: "داشبورد", exact: true },
  { href: "/admin/orders", label: "سفارش‌ها", exact: false },
  { href: "/admin/invoices", label: "فاکتورها", exact: false },
  { href: "/admin/products", label: "محصولات", exact: false },
  { href: "/admin/discounts", label: "کد تخفیف", exact: false },
  { href: "/admin/users", label: "کاربران", exact: false },
  { href: "/admin/roles", label: "نقش‌ها و دسترسی‌ها", exact: false },
  { href: "/admin/settings", label: "تنظیمات", exact: false },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const current = readAdminSession();
    if (!current) {
      router.replace("/admin/login");
      return;
    }
    setSession(current);
  }, [router]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    clearAdminSession();
    router.push("/admin/login");
  };

  if (!session) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f6f1e7] text-sm text-muted">
        در حال بارگذاری...
      </div>
    );
  }

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
        </div>

        <nav className="flex-1 overflow-y-auto p-3" aria-label="منوی ادمین">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-brand text-white"
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
          <p className="mb-2 px-2 text-xs text-muted">
            ورود: {session.username}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-xl border border-[#e6dcc2] px-4 py-2.5 text-sm font-medium text-[#8a3a3a] transition hover:bg-[#fff5f5]"
          >
            خروج از پنل
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
            پنل ادمین رزین‌مال
          </p>
          <span className="hidden text-xs text-muted lg:inline">
            نسخه دمو
          </span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
