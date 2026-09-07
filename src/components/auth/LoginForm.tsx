"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthField, AuthSubmitButton } from "@/components/auth/AuthFields";
import { AuthShell, AuthSwitchLink } from "@/components/auth/AuthShell";
import { isValidPhone, normalizePhone, saveLoginPhone } from "@/lib/auth-flow";
import { mergeGuestCartIntoUser } from "@/lib/cart";

type Mode = "password" | "otp";

/**
 * ورود کاربر.
 *
 * دو راه دارد: رمز عبور برای کسی که قبلاً ثبت‌نام کرده (بدون معطلی برای
 * پیامک) و کد یک‌بارمصرف برای وقتی رمز را فراموش کرده یا هنوز رمز
 * تعریف نکرده است.
 */
export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("password");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalized = normalizePhone(phone);

    if (!isValidPhone(normalized)) {
      setError("شماره موبایل معتبر نیست. مثال: ۰۹۱۲۳۴۵۶۷۸۹");
      return;
    }

    if (mode === "password" && !password) {
      setError("رمز عبور را وارد کنید.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (mode === "password") {
        const response = await fetch("/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ phone_number: normalized, password }),
        });

        const data = (await response.json().catch(() => null)) as {
          detail?: string;
        } | null;

        if (!response.ok) {
          setError(data?.detail ?? "شماره موبایل یا رمز عبور نادرست است.");
          return;
        }

        mergeGuestCartIntoUser(normalized);
        router.push("/dashboard");
        router.refresh();
        return;
      }

      const response = await fetch("/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ phone_number: normalized }),
      });

      const data = (await response.json().catch(() => null)) as {
        detail?: string;
      } | null;

      if (!response.ok) {
        setError(data?.detail ?? "ارسال کد ناموفق بود.");
        return;
      }

      saveLoginPhone(normalized);
      router.push("/login/verify");
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="ورود به حساب کاربری"
      subtitle={
        mode === "password"
          ? "با شماره موبایل و رمز عبور وارد شوید."
          : "کد تایید به شماره شما پیامک می‌شود."
      }
      footer={
        <AuthSwitchLink
          prompt="حساب کاربری ندارید؟"
          href="/register"
          label="ثبت‌نام"
        />
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthField
          id="login-phone"
          label="شماره موبایل"
          value={phone}
          onChange={(value) => {
            setPhone(value);
            setError("");
          }}
          error={mode === "password" ? "" : error}
          placeholder="۰۹۱۲۳۴۵۶۷۸۹"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          maxLength={11}
        />

        {mode === "password" ? (
          <AuthField
            id="login-password"
            label="رمز عبور"
            value={password}
            onChange={(value) => {
              setPassword(value);
              setError("");
            }}
            error={error}
            placeholder="••••••••"
            type="password"
            autoComplete="current-password"
          />
        ) : null}

        <AuthSubmitButton disabled={loading}>
          {loading
            ? "لطفاً صبر کنید..."
            : mode === "password"
              ? "ورود"
              : "دریافت کد تایید"}
        </AuthSubmitButton>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "password" ? "otp" : "password");
            setError("");
            setPassword("");
          }}
          className="w-full text-center text-sm font-medium text-brand transition hover:text-brand-dark"
        >
          {mode === "password"
            ? "ورود با کد یک‌بارمصرف"
            : "ورود با رمز عبور"}
        </button>
      </form>
    </AuthShell>
  );
}
