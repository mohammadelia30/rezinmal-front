"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthField, AuthSubmitButton } from "@/components/auth/AuthFields";
import { AuthShell } from "@/components/auth/AuthShell";

/**
 * تعریف رمز عبور بعد از تأیید شمارهٔ موبایل.
 *
 * تا وقتی کاربر رمز نداشته باشد فقط با کد پیامکی می‌تواند وارد شود،
 * پس این مرحله بلافاصله بعد از ثبت‌نام انجام می‌شود. نشست از کوکی
 * httpOnly می‌آید، پس درخواست همین‌جا احراز شده است.
 */
export function SetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password.length < 8) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد.");
      return;
    }
    if (password !== confirm) {
      setError("رمز عبور و تکرار آن یکسان نیستند.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/accounts/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          password,
          password_confirm: confirm,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as Record<
          string,
          unknown
        > | null;

        // خطای اعتبارسنجی رمز به‌صورت آرایه زیر کلید فیلد می‌آید
        const detail =
          typeof data?.detail === "string"
            ? data.detail
            : Array.isArray(data?.password)
              ? String(data.password[0])
              : Array.isArray(data?.password_confirm)
                ? String(data.password_confirm[0])
                : "ثبت رمز عبور ناموفق بود.";

        setError(detail);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="تعریف رمز عبور"
      subtitle="برای ورودهای بعدی بدون کد پیامکی، یک رمز عبور انتخاب کنید."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthField
          id="new-password"
          label="رمز عبور"
          value={password}
          onChange={(value) => {
            setPassword(value);
            setError("");
          }}
          placeholder="حداقل ۸ کاراکتر"
          type="password"
          autoComplete="new-password"
        />

        <AuthField
          id="confirm-password"
          label="تکرار رمز عبور"
          value={confirm}
          onChange={(value) => {
            setConfirm(value);
            setError("");
          }}
          error={error}
          placeholder="••••••••"
          type="password"
          autoComplete="new-password"
        />

        <AuthSubmitButton disabled={loading}>
          {loading ? "در حال ذخیره..." : "ذخیره و ورود"}
        </AuthSubmitButton>

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="w-full text-center text-sm font-medium text-muted transition hover:text-brand"
        >
          فعلاً رد شو
        </button>
      </form>
    </AuthShell>
  );
}
