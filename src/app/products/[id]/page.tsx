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
      <main className="flex-1 py-8 sm:py-14">
        <Container>
          <div className="mb-5 sm:mb-6">
            <Link
              href="/products"
              className="text-sm text-muted transition hover:text-brand"
            >
              ← بازگشت به محصولات
            </Link>
          </div>

          <div className="grid items-start gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-card lg:max-w-none">
              <Image
                src={product.image}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="space-y-4 text-right sm:space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
                  {product.title}
                </h1>
                <p className="mt-2 text-sm text-muted sm:text-base">
                  {product.subtitle}
                </p>
              </div>

              <p className="text-xl font-bold text-brand sm:text-2xl">
                {product.price}
              </p>

              <p className="text-sm leading-7 text-foreground/80 sm:text-base sm:leading-8">
                محصول دست‌ساز رزینی از مجموعه ویژه رزینمال؛ مناسب هدیه، دکور و
                استفاده روزمره.
              </p>

              <button
                type="button"
                className="inline-flex w-full rounded-lg bg-brand px-8 py-3 text-base font-bold text-white transition hover:bg-brand-dark sm:w-auto"
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
