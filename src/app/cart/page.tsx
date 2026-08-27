import type { Metadata } from "next";
import { CartPageContent } from "@/components/cart/CartPageContent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { shopNavLinks } from "@/data/home";

export const metadata: Metadata = {
  title: "سبد خرید | رزین‌مال",
  description: "مشاهده و مدیریت سبد خرید در فروشگاه رزین‌مال.",
};

export default function CartPage() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#f6f1e7]">
      <Header links={shopNavLinks} />
      <main className="flex-1">
        <CartPageContent />
      </main>
      <Footer />
    </div>
  );
}
