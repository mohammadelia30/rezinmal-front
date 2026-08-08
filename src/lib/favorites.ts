"use client";

import { useCallback, useEffect, useState } from "react";
import { products } from "@/data/home";
import { readUserSession } from "@/lib/auth-flow";

export type FavoriteProduct = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  image: string;
};

const FAVORITES_PREFIX = "favorites:";

function getStorageKey(phone: string) {
  return `${FAVORITES_PREFIX}${phone}`;
}

function readFavoriteIds(phone: string) {
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

function writeFavoriteIds(phone: string, ids: string[]) {
  localStorage.setItem(getStorageKey(phone), JSON.stringify(ids));
}

export function getFavoriteProducts(phone: string): FavoriteProduct[] {
  const ids = readFavoriteIds(phone);
  return ids.flatMap((id) => {
    const product = products.find((item) => item.id === id);
    return product ? [product] : [];
  });
}

export function isFavoriteProduct(phone: string, productId: string) {
  return readFavoriteIds(phone).includes(productId);
}

export function toggleFavoriteProduct(phone: string, product: FavoriteProduct) {
  const ids = readFavoriteIds(phone);
  const exists = ids.includes(product.id);
  const nextIds = exists
    ? ids.filter((id) => id !== product.id)
    : [...ids, product.id];

  writeFavoriteIds(phone, nextIds);
  window.dispatchEvent(new CustomEvent("favorites:change"));
  return !exists;
}

export function removeFavoriteProduct(phone: string, productId: string) {
  writeFavoriteIds(
    phone,
    readFavoriteIds(phone).filter((id) => id !== productId),
  );
  window.dispatchEvent(new CustomEvent("favorites:change"));
}

export function useFavorites() {
  const [phone, setPhone] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const refresh = useCallback(() => {
    const session = readUserSession();
    const userPhone = session?.phone ?? null;
    setPhone(userPhone);
    setFavoriteIds(userPhone ? readFavoriteIds(userPhone) : []);
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

  const favorites = favoriteIds.flatMap((id) => {
    const product = products.find((item) => item.id === id);
    return product ? [product] : [];
  });

  const toggle = useCallback(
    (product: FavoriteProduct) => {
      if (!phone) return false;
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
