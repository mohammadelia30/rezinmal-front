import type { Metadata } from "next";
import { LoginVerifyForm } from "@/components/auth/LoginVerifyForm";

export const metadata: Metadata = {
  title: "تایید ورود | رزین‌مال",
  description: "وارد کردن کد تایید برای ورود به حساب کاربری رزین‌مال.",
};

export default function LoginVerifyPage() {
  return <LoginVerifyForm />;
}
