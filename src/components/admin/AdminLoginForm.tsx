"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import {
  isAdminLoggedIn,
  saveAdminSession,
  validateAdminCredentials,
} from "@/lib/admin-auth";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn()) {
      router.replace("/admin");
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!validateAdminCredentials(username, password)) {
      setError("نام کاربری یا رمز عبور نادرست است.");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 400));
    saveAdminSession(username);
    router.push("/admin");
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

      <main className="flex flex-1 items-start justify-center px-4 pb-10 pt-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(78,42,84,0.08)] sm:p-8">
          <div className="mb-6 text-right">
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">
              ورود به پنل ادمین
            </h1>
            <p className="mt-2 text-sm leading-7 text-muted">
              برای مدیریت فروشگاه وارد شوید.
            </p>
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
            ) : (
              <p className="text-right text-xs text-muted">
                دمو: نام کاربری <span dir="ltr">admin</span> — رمز{" "}
                <span dir="ltr">admin123</span>
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-60"
            >
              {loading ? "در حال ورود..." : "ورود"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted">
            <Link href="/" className="font-medium text-brand hover:text-brand-dark">
              بازگشت به فروشگاه
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
