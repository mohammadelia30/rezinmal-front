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
  label?: string;
  /** compact = Figma mobile blog card */
  variant?: "full" | "compact";
};

export function BlogArticleCard({
  id,
  title,
  excerpt,
  category,
  author,
  price,
  image,
  label,
  variant = "full",
}: BlogArticleCardProps) {
  if (variant === "compact") {
    return (
      <article className="flex h-full flex-col overflow-hidden rounded-[10px] bg-white p-1.5 shadow-[0px_3px_10px_rgba(80,40,120,0.18)]">
        <Link
          href={`/blog/${id}`}
          className="relative block aspect-[120/82] w-full overflow-hidden rounded-[7px] bg-[#f7f2fa]"
        >
          <Image
            src={image}
            alt={title}
            fill
            sizes="50vw"
            className="object-cover"
          />
        </Link>

        <div className="flex flex-1 flex-col px-0.5 pt-1.5 pb-1">
          <Link href={`/blog/${id}`}>
            <h3 className="line-clamp-2 min-h-[2.1rem] text-right text-[12.5px] font-bold leading-[1.35] text-[#2b2b33]">
              {title}
            </h3>
          </Link>
          <div className="mt-auto flex items-center justify-end gap-1 pt-1.5 text-[11px] text-[#6b5b7b]">
            <Image
              src="/images/figma/icon-author-blog-m.svg"
              alt=""
              width={12}
              height={12}
              className="size-3 shrink-0"
            />
            <span className="truncate">{label ?? category}</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[#efe6f4] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link
        href={`/blog/${id}`}
        className="relative block aspect-[16/9] w-full overflow-hidden bg-[#f7f2fa]"
      >
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

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 border-t border-[#efe6f4] px-3 py-2 text-[11px] text-[#6b5b73]">
        <span className="shrink-0 font-medium text-[#5b2a63]">{category}</span>

        <span className="flex min-w-0 max-w-[45%] items-center gap-1 sm:max-w-none">
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
          <span className="w-full shrink-0 text-left text-[#4a4050] sm:w-auto">
            {price}
          </span>
        ) : null}
      </div>
    </article>
  );
}
