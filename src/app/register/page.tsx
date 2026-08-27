import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "ثبت‌نام | رزین‌مال",
  description: "ثبت‌نام در رزین‌مال با نام، نام خانوادگی و شماره موبایل.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
