import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { shopNavLinks } from "@/data/home";
import { searchProducts } from "@/lib/api/search";

export const dynamic = "force-dynamic";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `جست‌وجوی «${q}» | رزینمال` : "جست‌وجو | رزینمال",
    description: "جست‌وجو در محصولات رزینمال.",
    robots: { index: false },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const { products } = query
    ? await searchProducts(query)
    : { products: [] };

  return (
    <div className="flex min-h-dvh w-full flex-col bg-background">
      <Header links={shopNavLinks} />
      <main className="flex-1 py-8">
        <Container>
          <h1 className="text-right text-xl font-bold text-foreground sm:text-2xl">
            {query ? `نتایج جست‌وجو برای «${query}»` : "جست‌وجو"}
          </h1>

          {query ? (
            <p className="mt-1 text-right text-sm text-muted">
              {products.length.toLocaleString("fa-IR")} محصول پیدا شد
            </p>
          ) : (
            <p className="mt-1 text-right text-sm text-muted">
              عبارتی را در کادر جست‌وجوی بالای صفحه وارد کنید.
            </p>
          )}

          {query && products.length === 0 ? (
            <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-[0_4px_20px_rgba(78,42,84,0.06)]">
              <p className="font-bold text-foreground">
                محصولی با این عبارت پیدا نشد.
              </p>
              <p className="mt-2 text-sm text-muted">
                املای عبارت را بررسی کنید یا کلمهٔ کوتاه‌تری امتحان کنید.
              </p>
            </div>
          ) : null}

          {products.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  subtitle={product.subtitle}
                  price={product.price}
                  image={product.image}
                />
              ))}
            </div>
          ) : null}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
