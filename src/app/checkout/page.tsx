import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutContent } from "@/components/checkout/CheckoutContent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { shopNavLinks } from "@/data/home";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "تسویه حساب | رزین‌مال",
  description: "انتخاب آدرس و پرداخت آنلاین سفارش در رزین‌مال.",
  robots: { index: false },
};

/**
 * سفارش به شماره موبایل و آدرس نیاز دارد، پس مهمان اول وارد می‌شود یا
 * ثبت‌نام می‌کند و بعد از آن مستقیم به همین صفحه برمی‌گردد. سبدی که
 * به‌عنوان مهمان پر کرده هنگام ورود به حسابش منتقل می‌شود.
 */
export default async function CheckoutPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login?next=/checkout");
  }

  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#f6f1e7]">
      <Header links={shopNavLinks} />
      <main className="flex-1">
        <CheckoutContent />
      </main>
      <Footer />
    </div>
  );
}
