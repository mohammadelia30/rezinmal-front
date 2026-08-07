import Image from "next/image";

type CategoryProductCardProps = {
  title: string;
  price: string;
  rating: string;
  image: string;
};

export function CategoryProductCard({
  title,
  price,
  rating,
  image,
}: CategoryProductCardProps) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-[#efe6f4] bg-white p-2.5 shadow-sm">
      <div className="relative aspect-[4/3.5] w-full overflow-hidden rounded-lg bg-[#f7f2fa]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
      </div>

      <h3 className="mt-3 line-clamp-2 min-h-[2.5rem] text-right text-xs font-bold leading-5 text-[#3d2246] sm:text-sm">
        {title}
      </h3>

      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="flex items-center gap-0.5 text-[#4a4050]">
          <span>{rating}</span>
          <span className="text-[#f5b400]">★</span>
        </span>
        <span className="font-semibold text-[#3d2246]">{price}</span>
      </div>

      <div className="mt-3 flex flex-col gap-1.5 sm:flex-row sm:items-center">
        <button
          type="button"
          className="flex-1 rounded-lg bg-brand px-2 py-2 text-[10px] font-bold text-white transition hover:bg-brand-dark sm:text-xs"
        >
          افزودن به سبد خرید
        </button>
        <button
          type="button"
          className="shrink-0 rounded-lg border border-[#d8c5e0] bg-white px-2 py-2 text-[10px] font-medium text-[#5b2a63] transition hover:bg-[#f8f2fb] sm:text-xs"
        >
          علاقه‌مندی
        </button>
      </div>
    </article>
  );
}
