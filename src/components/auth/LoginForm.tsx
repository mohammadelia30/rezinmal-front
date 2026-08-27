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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalized = normalizePhone(phone);

    if (!isValidPhone(normalized)) {
      setError("شماره موبایل معتبر نیست. مثال: ۰۹۱۲۳۴۵۶۷۸۹");
      return;
    }

    saveLoginPhone(normalized);
    router.push("/login/verify");
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

        <AuthSubmitButton>دریافت کد تایید</AuthSubmitButton>
      </form>
    </AuthShell>
  );
}
