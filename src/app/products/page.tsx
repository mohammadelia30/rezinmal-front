import type { Metadata } from "next";
import { Articles } from "@/components/Articles";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { shopNavLinks } from "@/data/home";

export const metadata: Metadata = {
  title: "محصولات | رزینمال",
  description: "مجموعه محصولات ویژه رزینمال؛ زیورآلات، قالب و آثار رزینی.",
};

export default function ProductsPage() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-background">
      <Header links={shopNavLinks} />
      <main className="flex-1">
        <FeaturedProducts />
        <Articles />
      </main>
      <Footer />
    </div>
  );
}
