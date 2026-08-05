import { Articles } from "@/components/Articles";
import { Categories } from "@/components/Categories";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Categories />
        <div id="gallery">
          <FeaturedProducts />
        </div>
        <Articles />
      </main>
      <Footer />
    </div>
  );
}
