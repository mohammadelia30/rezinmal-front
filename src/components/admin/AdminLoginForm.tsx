"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import {
  adminDemoAccounts,
  findAdminAccount,
  getDefaultAdminRoute,
  isAdminLoggedIn,
  readAdminSession,
  saveAdminSession,
} from "@/lib/admin-auth";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn()) return;
    const session = readAdminSession();
    if (session) {
      router.replace(getDefaultAdminRoute(session.permissions));
    }
  }, [router]);

  const loginAs = async (user: string, pass: string) => {
    setError("");
    const account = findAdminAccount(user, pass);
    if (!account) {
      setError("نام کاربری یا رمز عبور نادرست است.");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    saveAdminSession(account.username);
    const session = readAdminSession();
    router.push(getDefaultAdminRoute(session?.permissions ?? []));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await loginAs(username, password);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-[#f6f1e7]">
      <header className="px-4 py-5 sm:px-6">
        <BrandLogo
          imageClassName="h-9 w-9 rounded-full object-cover"
          textClassName="text-lg font-bold text-brand"
          size={36}
        />
      </header>

      <main className="flex flex-1 items-start justify-center px-4 pb-10 pt-2">
        <div className="w-full max-w-3xl space-y-5">
          <div className="rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(78,42,84,0.08)] sm:p-8">
            <div className="mb-6 text-right">
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                ورود به پنل ادمین
              </h1>
              <p className="mt-2 text-sm leading-7 text-muted">
                نقش خود را انتخاب کنید یا با نام کاربری وارد شوید.
              </p>
            </div>

            <div className="mb-6 grid gap-3 sm:grid-cols-3">
              {adminDemoAccounts.map((account) => (
                <button
                  key={account.username}
                  type="button"
                  disabled={loading}
                  onClick={() => loginAs(account.username, account.password)}
                  className="rounded-2xl border border-[#efe6d4] bg-[#fbf9f1] p-4 text-right transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md disabled:opacity-60"
                >
                  <p className="font-bold text-foreground">{account.displayName}</p>
                  <p className="mt-1 text-xs leading-6 text-muted">
                    {account.description}
                  </p>
                  <p className="mt-3 text-[11px] text-brand" dir="ltr">
                    {account.username} / {account.password}
                  </p>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-right">
                <label
                  htmlFor="admin-username"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  نام کاربری
                </label>
                <input
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                    setError("");
                  }}
                  className="w-full rounded-xl border border-[#e6dcc2] bg-[#fbf9f1] px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
                  placeholder="admin"
                />
              </div>

              <div className="text-right">
                <label
                  htmlFor="admin-password"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  رمز عبور
                </label>
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  className="w-full rounded-xl border border-[#e6dcc2] bg-[#fbf9f1] px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
                  placeholder="••••••••"
                />
              </div>

              {error ? (
                <p className="text-right text-xs text-red-500">{error}</p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-60"
              >
                {loading ? "در حال ورود..." : "ورود"}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-muted">
            <Link href="/" className="font-medium text-brand hover:text-brand-dark">
              بازگشت به فروشگاه
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
