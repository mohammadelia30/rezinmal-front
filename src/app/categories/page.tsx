import type { Metadata } from "next";
import { CategoryHeader } from "@/components/category/CategoryHeader";
import { CategoryPageContent } from "@/components/category/CategoryPageContent";

export const metadata: Metadata = {
  title: "دسته‌بندی‌ها | رزینمال",
  description: "مرور دسته‌بندی محصولات رزینمال؛ زیرلیوانی، ساعت، زیورآلات و بیشتر.",
};

export default function CategoriesPage() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <CategoryHeader />
      <main className="flex-1 bg-[#f4f0f6]">
        <CategoryPageContent />
      </main>
    </div>
  );
}
