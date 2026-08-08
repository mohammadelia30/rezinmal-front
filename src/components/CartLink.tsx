"use client";

import Link from "next/link";
import { CartIcon } from "@/components/icons";
import { useCart } from "@/lib/cart";

type CartLinkProps = {
  className?: string;
  iconClassName?: string;
  mobile?: boolean;
};

export function CartLink({
  className = "",
  iconClassName = "h-5 w-5",
  mobile = false,
}: CartLinkProps) {
  const { count } = useCart();

  if (mobile) {
    return (
      <Link href="/cart" aria-label="سبد خرید" className={`relative p-1 ${className}`}>
        <img
          src="/images/figma/icon-cart-mobile.svg"
          alt=""
          width={17}
          height={17}
          className="size-[17px]"
        />
        {count > 0 ? (
          <span className="absolute -top-0.5 -left-0.5 flex min-w-[16px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
            {count > 9 ? "9+" : count}
          </span>
        ) : null}
      </Link>
    );
  }

  return (
    <Link
      href="/cart"
      aria-label="سبد خرید"
      className={`relative rounded-lg p-2 transition hover:bg-brand-mist hover:text-brand ${className}`}
    >
      <CartIcon className={iconClassName} />
      {count > 0 ? (
        <span className="absolute -top-0.5 -left-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </Link>
  );
}
