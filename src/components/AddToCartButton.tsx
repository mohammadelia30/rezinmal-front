"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";

type AddToCartButtonProps = {
  productId: string;
  className?: string;
  label?: string;
  redirectToCart?: boolean;
};

export function AddToCartButton({
  productId,
  className = "",
  label = "خرید",
  redirectToCart = false,
}: AddToCartButtonProps) {
  const router = useRouter();
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    add(productId);
    setAdded(true);

    if (redirectToCart) {
      router.push("/cart");
      return;
    }

    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
    >
      {added ? "افزوده شد" : label}
    </button>
  );
}
