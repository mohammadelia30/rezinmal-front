"use client";

import { useEffect, useState } from "react";

/**
 * تعریف یا تغییر رمز عبور از داخل پروفایل.
 *
 * کاربری که تازه ثبت‌نام کرده هنوز رمز ندارد و فقط با کد پیامکی
 * می‌تواند وارد شود؛ اینجا همان‌جایی است که اطلاعاتش را می‌بیند، پس
 * تعریف رمز هم باید همین‌جا در دسترس باشد.
 *
 * دو اندپوینت جدا لازم است: تعریف رمز اولیه رمز فعلی نمی‌خواهد، ولی
 * تغییر رمزِ موجود می‌خواهد.
 */
export function DashboardPasswordCard() {
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const response = await fetch("/auth/session", {
          credentials: "same-origin",
          cache: "no-store",
        });
        const data = (await response.json()) as {
          user?: { hasPassword?: boolean } | null;
        };
        if (active) setHasPassword(Boolean(data.user?.hasPassword));
      } catch {
        if (active) setHasPassword(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password.length < 8) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد.");
      return;
    }
    if (password !== confirm) {
      setError("رمز عبور و تکرار آن یکسان نیستند.");
      return;
    }
    if (hasPassword && !current) {
      setError("رمز فعلی را وارد کنید.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const response = await fetch(
        hasPassword
          ? "/api/accounts/change-password"
          : "/api/accounts/set-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify(
            hasPassword
              ? {
                  current_password: current,
                  password,
                  password_confirm: confirm,
                }
              : { password, password_confirm: confirm },
          ),
        },
      );

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as Record<
          string,
          unknown
        > | null;
        const first = data
          ? Object.values(data).find(
              (value) => typeof value === "string" || Array.isArray(value),
            )
          : null;
        setError(
          Array.isArray(first)
            ? String(first[0])
            : typeof first === "string"
              ? first
              : "ثبت رمز عبور ناموفق بود.",
        );
        return;
      }

      setHasPassword(true);
      setCurrent("");
      setPassword("");
      setConfirm("");
      setDone(true);
      window.setTimeout(() => setDone(false), 4000);
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setBusy(false);
    }
  };

  if (hasPassword === null) return null;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_4px_20px_rgba(78,42,84,0.06)] sm:p-6">
      <div className="mb-4 text-right">
        <h2 className="text-lg font-bold text-foreground">
          {hasPassword ? "تغییر رمز عبور" : "تعریف رمز عبور"}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {hasPassword
            ? "برای تغییر رمز، ابتدا رمز فعلی را وارد کنید."
            : "با تعریف رمز عبور، دفعهٔ بعد بدون کد پیامکی وارد می‌شوید."}
        </p>
      </div>

      {done ? (
        <p className="mb-3 rounded-xl bg-[#e4f5ea] px-4 py-2.5 text-right text-sm text-[#2f6b45]">
          رمز عبور ذخیره شد.
        </p>
      ) : null}

      {error ? (
        <p className="mb-3 rounded-xl bg-[#fde8e8] px-4 py-2.5 text-right text-sm text-[#9b3d3d]">
          {error}
        </p>
      ) : null}

      <form onSubmit={submit} className="space-y-4">
        {hasPassword ? (
          <label className="block text-right">
            <span className="mb-1.5 block text-sm font-medium text-foreground">
              رمز فعلی
            </span>
            <input
              type="password"
              value={current}
              autoComplete="current-password"
              onChange={(event) => setCurrent(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-[#e6dcc2] bg-[#fbf9f1] px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </label>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-right">
            <span className="mb-1.5 block text-sm font-medium text-foreground">
              رمز جدید
            </span>
            <input
              type="password"
              value={password}
              autoComplete="new-password"
              placeholder="حداقل ۸ کاراکتر"
              onChange={(event) => setPassword(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-[#e6dcc2] bg-[#fbf9f1] px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </label>

          <label className="block text-right">
            <span className="mb-1.5 block text-sm font-medium text-foreground">
              تکرار رمز جدید
            </span>
            <input
              type="password"
              value={confirm}
              autoComplete="new-password"
              onChange={(event) => setConfirm(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-[#e6dcc2] bg-[#fbf9f1] px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="min-h-10 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-dark disabled:opacity-60"
        >
          {busy ? "در حال ذخیره..." : "ذخیره رمز عبور"}
        </button>
      </form>
    </div>
  );
}
