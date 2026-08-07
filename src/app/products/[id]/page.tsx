import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { products, shopNavLinks } from "@/data/home";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((item) => item.id === id);
  if (!product) return { title: "محصول | رزینمال" };
  return {
    title: `${product.title} | رزینمال`,
    description: `${product.title} از برند ${product.subtitle} — ${product.price}`,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);
  if (!product) notFound();

  return (
    <div className="flex min-h-dvh w-full flex-col bg-background">
      <Header links={shopNavLinks} />
      <main className="flex-1 py-10 sm:py-14">
        <Container>
          <div className="mb-6">
            <Link
              href="/products"
              className="text-sm text-muted transition hover:text-brand"
            >
              ← بازگشت به محصولات
            </Link>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-card">
              <Image
                src={product.image}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="space-y-5 text-right">
              <div>
                <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                  {product.title}
                </h1>
                <p className="mt-2 text-muted">{product.subtitle}</p>
              </div>

              <p className="text-2xl font-bold text-brand">{product.price}</p>

              <p className="leading-8 text-foreground/80">
                محصول دست‌ساز رزینی از مجموعه ویژه رزینمال؛ مناسب هدیه، دکور و
                استفاده روزمره.
              </p>

              <button
                type="button"
                className="inline-flex rounded-lg bg-brand px-8 py-3 text-base font-bold text-white transition hover:bg-brand-dark"
              >
                خرید
              </button>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
