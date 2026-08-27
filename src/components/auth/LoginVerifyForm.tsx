"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthSubmitButton, OtpField } from "@/components/auth/AuthFields";
import { AuthShell, AuthSwitchLink } from "@/components/auth/AuthShell";
import {
  clearLoginPhone,
  formatPhoneDisplay,
  isValidOtp,
  readLoginPhone,
  saveUserSession,
} from "@/lib/auth-flow";
import { mergeGuestCartIntoUser } from "@/lib/cart";

export function LoginVerifyForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = readLoginPhone();
    if (!stored) {
      router.replace("/login");
      return;
    }
    setPhone(stored);
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isValidOtp(code)) {
      setError("کد تایید باید ۵ رقم باشد.");
      return;
    }

    setLoading(true);
    setError("");

    await new Promise((resolve) => window.setTimeout(resolve, 600));

    clearLoginPhone();
    saveUserSession({ phone });
    mergeGuestCartIntoUser(phone);
    router.push("/dashboard");
  };

  if (!phone) return null;

  return (
    <AuthShell
      title="تایید شماره موبایل"
      subtitle={`کد ارسال‌شده به ${formatPhoneDisplay(phone)} را وارد کنید.`}
      footer={
        <AuthSwitchLink
          prompt="حساب کاربری ندارید؟"
          href="/register"
          label="ثبت‌نام"
        />
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <OtpField
          value={code}
          onChange={(value) => {
            setCode(value);
            setError("");
          }}
          error={error}
        />

        <AuthSubmitButton disabled={loading}>
          {loading ? "در حال ورود..." : "تایید و ورود"}
        </AuthSubmitButton>

        <div className="flex flex-col items-center gap-2 text-sm">
          <button
            type="button"
            className="font-medium text-brand transition hover:text-brand-dark"
            onClick={() => router.push("/login")}
          >
            ویرایش شماره موبایل
          </button>
          <Link href="/login" className="text-muted transition hover:text-brand">
            ارسال مجدد کد
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
