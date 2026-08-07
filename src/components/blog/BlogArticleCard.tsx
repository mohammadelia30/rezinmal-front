import Image from "next/image";
import Link from "next/link";

type BlogArticleCardProps = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  price: string | null;
  image: string;
};

export function BlogArticleCard({
  id,
  title,
  excerpt,
  category,
  author,
  price,
  image,
}: BlogArticleCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[#efe6f4] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/blog/${id}`} className="relative block aspect-[16/9] w-full overflow-hidden bg-[#f7f2fa]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover transition duration-500 hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col px-3 pt-2.5">
        <Link href={`/blog/${id}`}>
          <h3 className="line-clamp-2 text-right text-sm font-bold leading-6 text-[#3d2246]">
            {title}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-right text-xs leading-5 text-[#6b5b73]">
          {excerpt}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#efe6f4] px-3 py-2 text-[11px] text-[#6b5b73]">
        <span className="shrink-0 font-medium text-[#5b2a63]">{category}</span>

        <span className="flex min-w-0 items-center gap-1">
          <span className="truncate">{author}</span>
          <Image
            src="/images/figma/icon-author.svg"
            alt=""
            width={13}
            height={13}
            className="size-[13px] shrink-0"
          />
        </span>

        {price ? (
          <span className="shrink-0 text-[#4a4050]">{price}</span>
        ) : (
          <span className="shrink-0 opacity-0">—</span>
        )}
      </div>
    </article>
  );
}
