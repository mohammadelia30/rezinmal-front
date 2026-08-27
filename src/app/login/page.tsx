import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "ورود | رزین‌مال",
  description: "ورود به حساب کاربری رزین‌مال با شماره موبایل.",
};

export default function LoginPage() {
  return <LoginForm />;
}
