import { Articles } from "@/components/Articles";
import { Categories } from "@/components/Categories";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MobileCategories } from "@/components/MobileCategories";

export default function Home() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#f6f1e7] md:bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <MobileCategories />
        <Categories />
          <div id="gallery">
            <FeaturedProducts mobileMode="home" />
          </div>
        <Articles />
      </main>
      <Footer />
    </div>
  );
}
