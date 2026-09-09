import type { Metadata } from "next";
import { SetPasswordForm } from "@/components/auth/SetPasswordForm";

export const metadata: Metadata = {
  title: "تعریف رمز عبور | رزین‌مال",
  description: "انتخاب رمز عبور برای حساب کاربری رزین‌مال.",
};

export default function Page() {
  return <SetPasswordForm />;
}
