"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import {
  fetchSessionUser,
  getDefaultAdminRoute,
  logout,
  toAdminSession,
} from "@/lib/admin-auth";
import { isValidPhone, normalizePhone } from "@/lib/auth-flow";

export function AdminLoginForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!isValidPhone(phone)) {
      setError("شماره موبایل معتبر نیست.");
      return;
    }
    if (!password) {
      setError("رمز عبور را وارد کنید.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          phone_number: normalizePhone(phone),
          password,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        detail?: string;
      } | null;

      if (!response.ok) {
        setError(data?.detail ?? "شماره موبایل یا رمز عبور نادرست است.");
        return;
      }

      const user = await fetchSessionUser();
      const session = user ? toAdminSession(user) : null;

      if (!session) {
        // کاربر معتبر است ولی دسترسی مدیریت ندارد؛ نشست را باطل می‌کنیم.
        await logout();
        setError("این حساب دسترسی به پنل مدیریت ندارد.");
        return;
      }

      router.replace(getDefaultAdminRoute(session.permissions));
      router.refresh();
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
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
        <div className="w-full max-w-md space-y-5">
          <div className="rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(78,42,84,0.08)] sm:p-8">
            <div className="mb-6 text-right">
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                ورود به پنل مدیریت
              </h1>
              <p className="mt-2 text-sm leading-7 text-muted">
                با شماره موبایل و رمز عبور حساب مدیریتی خود وارد شوید.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-right">
                <label
                  htmlFor="admin-phone"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  شماره موبایل
                </label>
                <input
                  id="admin-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="username"
                  dir="ltr"
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value);
                    setError("");
                  }}
                  className="w-full rounded-xl border border-[#e6dcc2] bg-[#fbf9f1] px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
                  placeholder="09xxxxxxxxx"
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
