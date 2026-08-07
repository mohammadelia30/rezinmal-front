import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  className?: string;
  textClassName?: string;
  imageClassName?: string;
  size?: number;
};

export function BrandLogo({
  className = "",
  textClassName = "text-xl font-bold text-brand sm:text-2xl",
  imageClassName = "h-10 w-10 rounded-full object-cover sm:h-12 sm:w-12",
  size = 48,
}: BrandLogoProps) {
  return (
    <Link href="/" className={`flex shrink-0 items-center gap-2.5 ${className}`}>
      <Image
        src="/logo.png"
        alt="رزین‌مال"
        width={size}
        height={size}
        priority
        className={imageClassName}
      />
      <span className={textClassName}>رزین‌مال</span>
    </Link>
  );
}
