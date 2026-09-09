"use client";

import { useCallback, useEffect, useState } from "react";
import { readUserSession } from "@/lib/auth-flow";
import { fetchProductsByIds } from "@/lib/product-lookup";

export type FavoriteProduct = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  image: string;
};

const FAVORITES_PREFIX = "favorites:";
const FAVORITES_GUEST_KEY = "favorites:guest";

/**
 * کاربر مهمان هم می‌تواند علاقه‌مندی ثبت کند و بعد از ورود، سطل مهمان
 * به حساب او منتقل می‌شود. قبلاً بدون ورود، دکمه بی‌صدا هیچ کاری
 * نمی‌کرد و کاربر فکر می‌کرد خراب است.
 */
function getStorageKey(phone: string | null) {
  return phone ? `${FAVORITES_PREFIX}${phone}` : FAVORITES_GUEST_KEY;
}

function readFavoriteIds(phone: string | null) {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem(getStorageKey(phone));
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeFavoriteIds(phone: string | null, ids: string[]) {
  localStorage.setItem(getStorageKey(phone), JSON.stringify(ids));
}

/** انتقال علاقه‌مندی‌های مهمان به حساب کاربر بعد از ورود. */
export function mergeGuestFavoritesIntoUser(phone: string) {
  const guest = readFavoriteIds(null);
  if (guest.length === 0) return;

  const merged = Array.from(new Set([...readFavoriteIds(phone), ...guest]));
  writeFavoriteIds(phone, merged);
  localStorage.removeItem(FAVORITES_GUEST_KEY);
  window.dispatchEvent(new CustomEvent("favorites:change"));
}

export function isFavoriteProduct(phone: string | null, productId: string) {
  return readFavoriteIds(phone).includes(productId);
}

export function toggleFavoriteProduct(
  phone: string | null,
  product: FavoriteProduct,
) {
  const ids = readFavoriteIds(phone);
  const exists = ids.includes(product.id);
  const nextIds = exists
    ? ids.filter((id) => id !== product.id)
    : [...ids, product.id];

  writeFavoriteIds(phone, nextIds);
  window.dispatchEvent(new CustomEvent("favorites:change"));
  return !exists;
}

export function removeFavoriteProduct(
  phone: string | null,
  productId: string,
) {
  writeFavoriteIds(
    phone,
    readFavoriteIds(phone).filter((id) => id !== productId),
  );
  window.dispatchEvent(new CustomEvent("favorites:change"));
}

export function useFavorites() {
  const [phone, setPhone] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);

  const refresh = useCallback(() => {
    const session = readUserSession();
    const userPhone = session?.phone ?? null;
    setPhone(userPhone);

    const ids = readFavoriteIds(userPhone);
    setFavoriteIds(ids);

    void fetchProductsByIds(ids).then((found) => {
      setFavorites(ids.flatMap((id) => {
        const product = found.get(id);
        return product ? [product] : [];
      }));
    });
  }, []);

  useEffect(() => {
    refresh();

    const handleChange = () => refresh();
    window.addEventListener("favorites:change", handleChange);
    window.addEventListener("storage", handleChange);

    return () => {
      window.removeEventListener("favorites:change", handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, [refresh]);

  const toggle = useCallback(
    (product: FavoriteProduct) => {
      const added = toggleFavoriteProduct(phone, product);
      refresh();
      return added;
    },
    [phone, refresh],
  );

  const remove = useCallback(
    (productId: string) => {
      if (!phone) return;
      removeFavoriteProduct(phone, productId);
      refresh();
    },
    [phone, refresh],
  );

  return {
    phone,
    isLoggedIn: Boolean(phone),
    favoriteIds,
    favorites,
    count: favorites.length,
    isFavorite: (productId: string) => favoriteIds.includes(productId),
    toggle,
    remove,
    refresh,
  };
}
