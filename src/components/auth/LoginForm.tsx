"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthField, AuthSubmitButton } from "@/components/auth/AuthFields";
import { AuthShell, AuthSwitchLink } from "@/components/auth/AuthShell";
import { isValidPhone, normalizePhone, saveLoginPhone } from "@/lib/auth-flow";

export function LoginForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalized = normalizePhone(phone);

    if (!isValidPhone(normalized)) {
      setError("شماره موبایل معتبر نیست. مثال: ۰۹۱۲۳۴۵۶۷۸۹");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // کد واقعاً از بک‌اند درخواست می‌شود؛ قبلاً این مرحله ساختگی بود.
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
      subtitle="برای ورود، شماره موبایل خود را وارد کنید."
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
          error={error}
          placeholder="۰۹۱۲۳۴۵۶۷۸۹"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          maxLength={11}
        />

        <AuthSubmitButton disabled={loading}>
          {loading ? "در حال ارسال کد..." : "دریافت کد تایید"}
        </AuthSubmitButton>
      </form>
    </AuthShell>
  );
}
