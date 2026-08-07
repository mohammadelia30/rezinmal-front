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
    <article className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-[0px_1px_4px_rgba(0,0,0,0.08)] md:rounded-2xl md:bg-card md:shadow-none">
      <Link
        href={`/products/${id}`}
        className="relative block aspect-[111/88] w-full overflow-hidden md:aspect-square"
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="object-cover transition duration-500 hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-1 px-1.5 pb-2 pt-1.5 md:px-4 md:pb-3 md:pt-2.5">
        <Link href={`/products/${id}`}>
          <h3 className="line-clamp-1 text-right text-[11px] font-bold text-[#3d2447] md:line-clamp-none md:text-sm md:text-foreground lg:text-base">
            {title}
          </h3>
        </Link>
        <div className="flex items-center justify-between text-[10px] text-[#7a6a80] md:text-xs md:text-muted lg:text-sm">
          <span>{price}</span>
          <span>{subtitle}</span>
        </div>
        <div className="mt-1.5 md:mt-2 md:flex md:items-center md:gap-2">
          <div className="hidden h-4 flex-1 rounded bg-bar md:block" />
          <button
            type="button"
            className="w-full rounded bg-[#e8dcc4] py-1 text-[10px] font-bold text-[#4a2a55] transition hover:bg-[#dfd0b0] md:w-auto md:rounded-lg md:bg-brand md:px-4 md:py-1.5 md:text-sm md:text-white md:hover:bg-brand-dark"
          >
            خرید
          </button>
        </div>
      </div>
    </article>
  );
}
