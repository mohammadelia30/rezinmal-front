import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  // بدون metadataBase، Next آدرس پایه را localhost:3000 می‌گیرد و
  // og:image و canonical هر صفحه به آدرسی اشاره می‌کند که از بیرون
  // اصلاً وجود ندارد — نه گوگل تصویر را می‌دید، نه تلگرام
  metadataBase: new URL(SITE_URL),
  title: "رزین‌مال | فروشگاه و آموزش هنر رزین",
  description:
    "زیبایی را خودتان بسازید با کیت‌های آموزش، مواد اولیه و ابزارآلات تخصصی رزین‌مال.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} h-full`}
    >
      <body className="min-h-full bg-background font-sans text-foreground antialiased [direction:rtl]">
        {children}
      </body>
    </html>
  );
}
