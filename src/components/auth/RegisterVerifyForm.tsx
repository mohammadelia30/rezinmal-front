"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthSubmitButton, OtpField } from "@/components/auth/AuthFields";
import { AuthShell, AuthSwitchLink } from "@/components/auth/AuthShell";
import {
  clearRegisterData,
  formatPhoneDisplay,
  isValidOtp,
  readRegisterData,
  saveUserSession,
} from "@/lib/auth-flow";

export function RegisterVerifyForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [registerData, setRegisterData] = useState<{
    firstName: string;
    lastName: string;
    phone: string;
  } | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = readRegisterData();
    if (!data) {
      router.replace("/register");
      return;
    }
    setPhone(data.phone);
    setFullName(`${data.firstName} ${data.lastName}`);
    setRegisterData(data);
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

    clearRegisterData();
    if (registerData) {
      saveUserSession({
        phone: registerData.phone,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
      });
    }
    router.push("/dashboard");
  };

  if (!phone) return null;

  return (
    <AuthShell
      title="تایید ثبت‌نام"
      subtitle={`کد ارسال‌شده به ${formatPhoneDisplay(phone)} برای ${fullName} را وارد کنید.`}
      footer={
        <AuthSwitchLink
          prompt="قبلاً ثبت‌نام کرده‌اید؟"
          href="/login"
          label="ورود"
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
          {loading ? "در حال ثبت‌نام..." : "تایید و ثبت‌نام"}
        </AuthSubmitButton>

        <div className="flex flex-col items-center gap-2 text-sm">
          <button
            type="button"
            className="font-medium text-brand transition hover:text-brand-dark"
            onClick={() => router.push("/register")}
          >
            ویرایش اطلاعات
          </button>
          <Link href="/register" className="text-muted transition hover:text-brand">
            ارسال مجدد کد
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
