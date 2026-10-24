import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductVariantPicker } from "@/components/ProductVariantPicker";
import { shopNavLinks } from "@/data/home";
import { getStoreProduct, getStoreProducts } from "@/lib/api";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const products = await getStoreProducts();
    return products.map((product) => ({ id: product.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getStoreProduct(id);
  if (!product) return { title: "محصول | رزینمال" };

  // آنچه مدیر در «نمایش در گوگل» نوشته مقدم است؛ وگرنه از خود محصول
  // ساخته می‌شود تا هیچ صفحه‌ای بدون توضیح نماند
  const title = product.metaTitle || `${product.title} | رزین‌مال`;
  const description =
    product.metaDescription ||
    product.description ||
    `${product.title} از ${product.subtitle} — ${product.price}`;

  return {
    title,
    description,
    alternates: { canonical: `/products/${product.id}` },
    // پیش‌نمایش لینک در تلگرام، واتساپ و شبکه‌های اجتماعی
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fa_IR",
      images: product.image ? [{ url: product.image }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getStoreProduct(id);
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
            <ProductGallery
              title={product.title}
              images={
                product.images?.length
                  ? product.images
                  : [{ url: product.image, alt: product.imageAlt }]
              }
            />

            <div className="space-y-4 text-right sm:space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
                  {product.title}
                </h1>
                <p className="mt-2 text-sm text-muted sm:text-base">
                  {product.subtitle}
                </p>

                {/* دستهٔ واقعی محصول؛ تا امروز هیچ‌جای صفحه نوشته
                    نمی‌شد و معلوم نبود محصول کجا ثبت شده است */}
                {product.categories?.length ? (
                  // در صفحهٔ راست‌به‌چپ، اولین عنصر سمت راست می‌نشیند؛
                  // برچسب باید اول بیاید وگرنه «ابزارآلات دسته‌بندی:»
                  // خوانده می‌شود
                  <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                    <span className="text-xs text-muted">دسته‌بندی:</span>
                    {product.categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/categories?category=${category.id}`}
                        className="rounded-full bg-brand-mist px-3 py-1 text-xs font-medium text-brand transition hover:bg-brand/10"
                      >
                        {category.title}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>

              <p className="text-sm leading-7 text-foreground/80 sm:text-base sm:leading-8">
                {product.description ||
                  "محصول دست‌ساز رزینی از مجموعه ویژه رزینمال؛ مناسب هدیه، دکور و استفاده روزمره."}
              </p>

              {/* قیمت و خرید کنار هم‌اند چون با انتخاب نسخه عوض می‌شوند */}
              <ProductVariantPicker product={product} />
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
