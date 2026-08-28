"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthField, AuthSubmitButton } from "@/components/auth/AuthFields";
import { AuthShell, AuthSwitchLink } from "@/components/auth/AuthShell";
import { isValidPhone, normalizePhone, saveRegisterData } from "@/lib/auth-flow";

export function RegisterForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    phone?: string;
  }>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors: typeof errors = {};
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const normalized = normalizePhone(phone);

    if (!trimmedFirst) {
      nextErrors.firstName = "نام را وارد کنید.";
    }
    if (!trimmedLast) {
      nextErrors.lastName = "نام خانوادگی را وارد کنید.";
    }
    if (!isValidPhone(normalized)) {
      nextErrors.phone = "شماره موبایل معتبر نیست. مثال: ۰۹۱۲۳۴۵۶۷۸۹";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);

    try {
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
        setErrors({ phone: data?.detail ?? "ارسال کد ناموفق بود." });
        return;
      }

      saveRegisterData({
        firstName: trimmedFirst,
        lastName: trimmedLast,
        phone: normalized,
      });
      router.push("/register/verify");
    } catch {
      setErrors({ phone: "ارتباط با سرور برقرار نشد." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="ثبت‌نام"
      subtitle="برای ایجاد حساب کاربری، اطلاعات زیر را وارد کنید."
      footer={
        <AuthSwitchLink
          prompt="قبلاً ثبت‌نام کرده‌اید؟"
          href="/login"
          label="ورود"
        />
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthField
          id="register-first-name"
          label="نام"
          value={firstName}
          onChange={(value) => {
            setFirstName(value);
            setErrors((current) => ({ ...current, firstName: undefined }));
          }}
          error={errors.firstName}
          placeholder="نام"
          autoComplete="given-name"
        />

        <AuthField
          id="register-last-name"
          label="نام خانوادگی"
          value={lastName}
          onChange={(value) => {
            setLastName(value);
            setErrors((current) => ({ ...current, lastName: undefined }));
          }}
          error={errors.lastName}
          placeholder="نام خانوادگی"
          autoComplete="family-name"
        />

        <AuthField
          id="register-phone"
          label="شماره موبایل"
          value={phone}
          onChange={(value) => {
            setPhone(value);
            setErrors((current) => ({ ...current, phone: undefined }));
          }}
          error={errors.phone}
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
