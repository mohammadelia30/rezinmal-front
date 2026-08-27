import type { Metadata } from "next";
import { RegisterVerifyForm } from "@/components/auth/RegisterVerifyForm";

export const metadata: Metadata = {
  title: "تایید ثبت‌نام | رزین‌مال",
  description: "وارد کردن کد تایید برای تکمیل ثبت‌نام در رزین‌مال.",
};

export default function RegisterVerifyPage() {
  return <RegisterVerifyForm />;
}
