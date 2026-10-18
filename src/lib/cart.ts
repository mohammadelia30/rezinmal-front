"use client";

import { useCallback, useEffect, useState } from "react";
import { readUserSession } from "@/lib/auth-flow";
import { fetchProductsByIds } from "@/lib/product-lookup";
import { formatProductPrice, parseProductPrice } from "@/lib/price";

export type CartProduct = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  image: string;
  quantity: number;
  /** نسخهٔ خریداری‌شده؛ قیمت ردیف از همین نسخه است */
  variantId?: number;
};

type StoredCartItem = {
  id: string;
  quantity: number;
  /** نسخهٔ انتخاب‌شده (رنگ/سایز)؛ خالی یعنی نسخهٔ پیش‌فرض محصول */
  variantId?: number;
};

/**
 * هر ترکیب محصول و نسخه یک ردیف جداست: یک محصول با دو رنگ مختلف
 * دو قیمت دارد و نباید در یک ردیف جمع شود.
 */
function lineKey(item: { id: string; variantId?: number }) {
  return `${item.id}:${item.variantId ?? ""}`;
}

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

/**
 * تبدیل شناسه‌های ذخیره‌شده به محصول واقعی.
 *
 * اطلاعات محصول از API گرفته می‌شود؛ در حافظهٔ مرورگر فقط شناسه و
 * تعداد نگه داشته می‌شود تا قیمت و نام همیشه به‌روز باشند.
 */
async function hydrateItems(
  items: StoredCartItem[],
): Promise<CartProduct[]> {
  const valid = items.filter((item) => item.quantity > 0);
  if (valid.length === 0) return [];

  const products = await fetchProductsByIds(valid);

  return valid.flatMap((item) => {
    const product = products.get(lineKey(item));
    if (!product) return [];
    return [
      { ...product, quantity: item.quantity, variantId: item.variantId },
    ];
  });
}

function mergeItems(
  current: StoredCartItem[],
  incoming: StoredCartItem[],
): StoredCartItem[] {
  const map = new Map<string, StoredCartItem>();

  for (const item of [...current, ...incoming]) {
    const key = lineKey(item);
    const found = map.get(key);
    map.set(
      key,
      found ? { ...found, quantity: found.quantity + item.quantity } : item,
    );
  }

  return Array.from(map.values());
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
  variantId?: number,
) {
  const items = readStoredItems(phone);
  const key = lineKey({ id: productId, variantId });
  const existing = items.find((item) => lineKey(item) === key);

  const nextItems = existing
    ? items.map((item) =>
        lineKey(item) === key
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      )
    : [...items, { id: productId, quantity, variantId }];

  writeStoredItems(phone, nextItems);
  notifyCartChange();
}

export function updateCartQuantity(
  phone: string | null,
  productId: string,
  quantity: number,
  variantId?: number,
) {
  if (quantity < 1) {
    removeFromCart(phone, productId, variantId);
    return;
  }

  const key = lineKey({ id: productId, variantId });
  const nextItems = readStoredItems(phone).map((item) =>
    lineKey(item) === key ? { ...item, quantity } : item,
  );

  writeStoredItems(phone, nextItems);
  notifyCartChange();
}

export function removeFromCart(
  phone: string | null,
  productId: string,
  variantId?: number,
) {
  const key = lineKey({ id: productId, variantId });
  writeStoredItems(
    phone,
    readStoredItems(phone).filter((item) => lineKey(item) !== key),
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
  // تا اطلاعات محصولات نرسیده، سبد خالی از سبدِ هنوز-بارگذاری‌نشده قابل تشخیص نیست
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    const session = readUserSession();
    const userPhone = session?.phone ?? null;
    setPhone(userPhone);
    void hydrateItems(readStoredItems(userPhone)).then((next) => {
      setItems(next);
      setReady(true);
    });
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
    (productId: string, quantity = 1, variantId?: number) => {
      addProductToCart(phone, productId, quantity, variantId);
      refresh();
    },
    [phone, refresh],
  );

  const setQuantity = useCallback(
    (productId: string, quantity: number, variantId?: number) => {
      updateCartQuantity(phone, productId, quantity, variantId);
      refresh();
    },
    [phone, refresh],
  );

  const remove = useCallback(
    (productId: string, variantId?: number) => {
      removeFromCart(phone, productId, variantId);
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
    ready,
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
