import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
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
