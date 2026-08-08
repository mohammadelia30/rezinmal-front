"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Container } from "@/components/Container";
import { Header } from "@/components/Header";
import {
  clearUserSession,
  formatPhoneDisplay,
  getUserDisplayName,
  readUserSession,
  type UserSession,
} from "@/lib/auth-flow";

const navItems = [
  { href: "/dashboard", label: "خلاصه", exact: true },
  { href: "/dashboard/orders", label: "سفارش‌ها", exact: false },
  { href: "/dashboard/favorites", label: "علاقه‌مندی‌ها", exact: false },
  { href: "/dashboard/profile", label: "پروفایل", exact: false },
] as const;

export function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const session = readUserSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    setUser(session);
  }, [router]);

  const handleLogout = () => {
    clearUserSession();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f6f1e7] text-sm text-muted">
        در حال بارگذاری...
      </div>
    );
  }

  const displayName = getUserDisplayName(user);

  return (
    <div className="flex min-h-dvh flex-col bg-[#f6f1e7]">
      <Header />

      <main className="flex-1 py-6 sm:py-8">
        <Container>
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="text-right">
              <p className="text-sm text-muted">حساب کاربری</p>
              <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
                سلام، {displayName}
              </h1>
              <p className="mt-1 text-sm text-muted" dir="ltr">
                {formatPhoneDisplay(user.phone)}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="self-start rounded-xl border border-[#e6dcc2] bg-white px-4 py-2 text-sm font-medium text-[#8a3a3a] transition hover:bg-[#fff5f5] sm:self-auto"
            >
              خروج از حساب
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
            <aside className="rounded-2xl bg-white p-3 shadow-[0_4px_20px_rgba(78,42,84,0.06)]">
              <nav aria-label="منوی داشبورد">
                <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
                  {navItems.map((item) => {
                    const active = item.exact
                      ? pathname === item.href
                      : pathname.startsWith(item.href);

                    return (
                      <li key={item.href} className="shrink-0 lg:shrink">
                        <Link
                          href={item.href}
                          className={`block whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium transition ${
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
            </aside>

            <section>{children}</section>
          </div>
        </Container>
      </main>
    </div>
  );
}
