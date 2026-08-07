import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  image: string;
};

export function ProductCard({
  id,
  title,
  subtitle,
  price,
  image,
}: ProductCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-card">
      <Link href={`/products/${id}`} className="relative block aspect-square w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="object-cover transition duration-500 hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-1 px-3 pb-3 pt-2.5 sm:px-4">
        <Link href={`/products/${id}`}>
          <h3 className="text-right text-sm font-bold text-foreground sm:text-base">
            {title}
          </h3>
        </Link>
        <div className="flex items-center justify-between text-xs text-muted sm:text-sm">
          <span>{subtitle}</span>
          <span>{price}</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-4 flex-1 rounded bg-bar" />
          <button
            type="button"
            className="rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-white transition hover:bg-brand-dark sm:px-4 sm:text-sm"
          >
            خرید
          </button>
        </div>
      </div>
    </article>
  );
}
