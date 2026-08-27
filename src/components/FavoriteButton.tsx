"use client";

import { useRouter } from "next/navigation";
import { HeartIcon } from "@/components/icons";
import type { FavoriteProduct } from "@/lib/favorites";
import { useFavorites } from "@/lib/favorites";

type FavoriteButtonProps = {
  product: FavoriteProduct;
  className?: string;
};

export function FavoriteButton({ product, className = "" }: FavoriteButtonProps) {
  const router = useRouter();
  const { isLoggedIn, isFavorite, toggle } = useFavorites();
  const active = isFavorite(product.id);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    toggle(product);
  };

  return (
    <button
      type="button"
      aria-label={active ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      aria-pressed={active}
      onClick={handleClick}
      className={`inline-flex size-9 items-center justify-center rounded-full bg-white/90 text-[#8a6a80] shadow-sm transition hover:scale-105 hover:text-brand ${active ? "text-brand" : ""} ${className}`}
    >
      <HeartIcon className="size-4.5" filled={active} />
    </button>
  );
}
