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
  textClassName = "text-lg font-bold text-brand sm:text-xl md:text-2xl",
  imageClassName = "h-8 w-8 rounded-full object-cover sm:h-10 sm:w-10 md:h-12 md:w-12",
  size = 48,
}: BrandLogoProps) {
  return (
    <Link href="/" className={`flex shrink-0 items-center gap-2 sm:gap-2.5 ${className}`}>
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
