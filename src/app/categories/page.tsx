import type { Metadata } from "next";
import { CategoryPageContent } from "@/components/category/CategoryPageContent";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "دسته‌بندی‌ها | رزینمال",
  description: "مرور دسته‌بندی محصولات رزینمال؛ زیرلیوانی، ساعت، زیورآلات و بیشتر.",
};

export default function CategoriesPage() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#f6f1e7] md:bg-background">
      <Header />
      <main className="flex-1 bg-[#f4f0f6]">
        <CategoryPageContent />
      </main>
    </div>
  );
}
