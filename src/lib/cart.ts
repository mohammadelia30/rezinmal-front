"use client";

import { useCallback, useEffect, useState } from "react";
import { products } from "@/data/home";
import { readUserSession } from "@/lib/auth-flow";
import { formatProductPrice, parseProductPrice } from "@/lib/price";

export type CartProduct = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  image: string;
  quantity: number;
};

type StoredCartItem = {
  id: string;
  quantity: number;
};

const CART_GUEST_KEY = "cart:guest";

function getStorageKey(phone: string | null) {
  return phone ? `cart:${phone}` : CART_GUEST_KEY;
}

function readStoredItems(phone: string | null): StoredCartItem[] {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem(getStorageKey(phone));
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as StoredCartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredItems(phone: string | null, items: StoredCartItem[]) {
  localStorage.setItem(getStorageKey(phone), JSON.stringify(items));
}

function notifyCartChange() {
  window.dispatchEvent(new CustomEvent("cart:change"));
}

function hydrateItems(items: StoredCartItem[]): CartProduct[] {
  return items.flatMap((item) => {
    const product = products.find((entry) => entry.id === item.id);
    if (!product || item.quantity < 1) return [];

    return [
      {
        ...product,
        quantity: item.quantity,
      },
    ];
  });
}

function mergeItems(
  current: StoredCartItem[],
  incoming: StoredCartItem[],
): StoredCartItem[] {
  const map = new Map<string, number>();

  for (const item of current) {
    map.set(item.id, item.quantity);
  }

  for (const item of incoming) {
    map.set(item.id, (map.get(item.id) ?? 0) + item.quantity);
  }

  return Array.from(map.entries()).map(([id, quantity]) => ({ id, quantity }));
}

export function mergeGuestCartIntoUser(phone: string) {
  const guestItems = readStoredItems(null);
  if (guestItems.length === 0) return;

  const userItems = readStoredItems(phone);
  writeStoredItems(phone, mergeItems(userItems, guestItems));
  localStorage.removeItem(CART_GUEST_KEY);
  notifyCartChange();
}

export function addProductToCart(
  phone: string | null,
  productId: string,
  quantity = 1,
) {
  const items = readStoredItems(phone);
  const existing = items.find((item) => item.id === productId);

  const nextItems = existing
    ? items.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      )
    : [...items, { id: productId, quantity }];

  writeStoredItems(phone, nextItems);
  notifyCartChange();
}

export function updateCartQuantity(
  phone: string | null,
  productId: string,
  quantity: number,
) {
  if (quantity < 1) {
    removeFromCart(phone, productId);
    return;
  }

  const nextItems = readStoredItems(phone).map((item) =>
    item.id === productId ? { ...item, quantity } : item,
  );

  writeStoredItems(phone, nextItems);
  notifyCartChange();
}

export function removeFromCart(phone: string | null, productId: string) {
  writeStoredItems(
    phone,
    readStoredItems(phone).filter((item) => item.id !== productId),
  );
  notifyCartChange();
}

export function clearCart(phone: string | null) {
  writeStoredItems(phone, []);
  notifyCartChange();
}

export function getCartCount(phone: string | null) {
  return readStoredItems(phone).reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal(items: CartProduct[]) {
  return items.reduce(
    (sum, item) => sum + parseProductPrice(item.price) * item.quantity,
    0,
  );
}

export function useCart() {
  const [phone, setPhone] = useState<string | null>(null);
  const [items, setItems] = useState<CartProduct[]>([]);

  const refresh = useCallback(() => {
    const session = readUserSession();
    const userPhone = session?.phone ?? null;
    setPhone(userPhone);
    setItems(hydrateItems(readStoredItems(userPhone)));
  }, []);

  useEffect(() => {
    refresh();

    const handleChange = () => refresh();
    window.addEventListener("cart:change", handleChange);
    window.addEventListener("storage", handleChange);

    return () => {
      window.removeEventListener("cart:change", handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, [refresh]);

  const add = useCallback(
    (productId: string, quantity = 1) => {
      addProductToCart(phone, productId, quantity);
      refresh();
    },
    [phone, refresh],
  );

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      updateCartQuantity(phone, productId, quantity);
      refresh();
    },
    [phone, refresh],
  );

  const remove = useCallback(
    (productId: string) => {
      removeFromCart(phone, productId);
      refresh();
    },
    [phone, refresh],
  );

  const clear = useCallback(() => {
    clearCart(phone);
    refresh();
  }, [phone, refresh]);

  const total = getCartTotal(items);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    phone,
    items,
    count,
    total,
    totalLabel: formatProductPrice(total),
    add,
    setQuantity,
    remove,
    clear,
    refresh,
  };
}
