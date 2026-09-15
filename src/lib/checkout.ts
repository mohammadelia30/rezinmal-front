"use client";

/**
 * مراحل خرید: هماهنگ کردن سبد، ثبت سفارش و رفتن به درگاه.
 *
 * سبد خرید سایت در مرورگر نگه داشته می‌شود (تا مهمان هم بتواند خرید
 * کند)، ولی بک‌اند سفارش را از سبدِ سمت سرور می‌سازد و موجودی را همان‌جا
 * رزرو می‌کند. پس درست پیش از ثبت سفارش، سبد سرور با سبد مرورگر
 * یکسان می‌شود.
 */

export class CheckoutError extends Error {}

type StoredItem = { id: string; quantity: number };

type ApiVariant = { id: number; is_default?: boolean; is_active?: boolean };
type ApiProduct = { id: number; title: string; variants?: ApiVariant[] };

export type ServerCart = {
  subtotal: number;
  product_discount_amount: number;
  discount_amount: number;
  shipping_cost: number;
  /** بک‌اند از تعداد اقلام تعیین می‌کند: بیش از ۲ عدد = بستهٔ بزرگ */
  shipping_type?: "standard" | "large";
  total_amount: number;
};

/** پیام‌های انگلیسی بک‌اند که مشتری ممکن است ببیند. */
const MESSAGES: [RegExp, string][] = [
  [/coupon inactive/i, "این کد تخفیف غیرفعال است."],
  [/coupon limit reached/i, "ظرفیت استفاده از این کد تخفیف تمام شده است."],
  [/coupon already used/i, "قبلاً از این کد تخفیف استفاده کرده‌اید."],
  [/not assigned to user/i, "این کد تخفیف برای حساب شما نیست."],
  [/invalid category|already discounted/i, "این کد تخفیف روی محصولات سبد شما اعمال نمی‌شود."],
  [/invalid coupon/i, "کد تخفیف معتبر نیست."],
  [/not enough|insufficient stock|available stock/i, "موجودی یکی از محصولات کافی نیست. تعداد را کم کنید."],
  [/inventory does not exist|not active|not available/i, "یکی از محصولات دیگر قابل خرید نیست. آن را از سبد حذف کنید."],
  [/cart is empty/i, "سبد خرید خالی است."],
  [/does not belong to you/i, "آدرس انتخاب‌شده معتبر نیست."],
  [/merchant id|callback url/i, "درگاه پرداخت هنوز تنظیم نشده است. لطفاً با پشتیبانی تماس بگیرید."],
  [/timed out|unable to connect|invalid response|gateway/i, "ارتباط با درگاه پرداخت برقرار نشد. چند دقیقه بعد دوباره تلاش کنید."],
  [/already been completed|already completed/i, "این سفارش قبلاً پرداخت شده است."],
  [/not waiting for payment|cancelled order|has been cancelled/i, "این سفارش دیگر در انتظار پرداخت نیست."],
];

/** اولین پیام خوانا از بدنهٔ خطای DRF، به فارسی در صورت امکان. */
export function toPersianError(data: unknown, fallback: string): string {
  const pick = (value: unknown): string | null => {
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return pick(value[0]);
    if (value && typeof value === "object") {
      const record = value as Record<string, unknown>;
      return (
        pick(record.error) ??
        pick(record.detail) ??
        pick(Object.values(record)[0])
      );
    }
    return null;
  };

  const message = pick(data);
  if (!message) return fallback;

  for (const [pattern, persian] of MESSAGES) {
    if (pattern.test(message)) return persian;
  }
  // پیام فارسی بک‌اند (مثلاً خطای کد تخفیف) همان‌طور نمایش داده می‌شود
  return /[؀-ۿ]/.test(message) ? message : fallback;
}

async function call<T>(
  path: string,
  init: { method?: string; body?: unknown } = {},
  fallback = "انجام درخواست ناموفق بود.",
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: init.method ?? "GET",
      headers:
        init.body === undefined ? undefined : { "Content-Type": "application/json" },
      credentials: "same-origin",
      cache: "no-store",
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    });
  } catch {
    throw new CheckoutError("ارتباط با سرور برقرار نشد.");
  }

  if (response.status === 401) {
    throw new CheckoutError("نشست شما به پایان رسیده است. دوباره وارد شوید.");
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new CheckoutError(toPersianError(data, fallback));
  return data as T;
}

/** نسخهٔ پیش‌فرضِ فعالِ هر محصول؛ سبد سرور با نسخه کار می‌کند نه محصول. */
async function resolveVariant(productId: string): Promise<{ variant: number; title: string }> {
  const product = await call<ApiProduct>(
    `/api/catalog/products/${encodeURIComponent(productId)}`,
    {},
    "یکی از محصولات سبد پیدا نشد.",
  );
  const active = (product.variants ?? []).filter((item) => item.is_active !== false);
  const variant = active.find((item) => item.is_default) ?? active[0];
  if (!variant) {
    throw new CheckoutError(`«${product.title}» در حال حاضر قابل خرید نیست.`);
  }
  return { variant: variant.id, title: product.title };
}

/**
 * سبد سرور را دقیقاً برابر سبد مرورگر می‌کند و مبالغ نهایی را برمی‌گرداند.
 *
 * خالی کردن سبد سرور رزروهای قبلی را آزاد می‌کند؛ بدون آن، هر بار ورود به
 * این صفحه تعداد را دوباره اضافه و موجودی را دو بار رزرو می‌کرد.
 */
export async function syncServerCart(items: StoredItem[]): Promise<ServerCart> {
  const valid = items.filter((item) => item.quantity > 0);
  if (valid.length === 0) throw new CheckoutError("سبد خرید خالی است.");

  const resolved = await Promise.all(valid.map((item) => resolveVariant(item.id)));

  await call("/api/cart", { method: "DELETE" });

  let cart: ServerCart | null = null;
  for (const [index, item] of valid.entries()) {
    try {
      cart = await call<ServerCart>("/api/cart/items", {
        method: "POST",
        body: { variant: resolved[index].variant, quantity: item.quantity },
      });
    } catch (error) {
      const message = error instanceof CheckoutError ? error.message : "";
      throw new CheckoutError(
        message.includes("موجودی")
          ? `موجودی «${resolved[index].title}» برای ${item.quantity.toLocaleString("fa-IR")} عدد کافی نیست.`
          : message || "افزودن محصولات به سبد ناموفق بود.",
      );
    }
  }

  return cart as ServerCart;
}

export type PlacedOrder = { id: number; order_code: string; total_amount: number };

export function placeOrder(input: {
  addressId: string;
  couponCode?: string;
}): Promise<PlacedOrder> {
  return call<PlacedOrder>(
    "/api/orders/orders/checkout",
    {
      method: "POST",
      body: {
        // نوع ارسال را بک‌اند از تعداد اقلام تعیین می‌کند و از مشتری نمی‌پذیرد
        address_id: Number(input.addressId),
        ...(input.couponCode ? { coupon_code: input.couponCode } : {}),
      },
    },
    "ثبت سفارش ناموفق بود.",
  );
}

/**
 * آدرس درگاه را از بک‌اند می‌گیرد و مرورگر را به آن می‌فرستد.
 *
 * فقط به دامنهٔ زرین‌پال هدایت می‌شود تا پاسخ دستکاری‌شده نتواند
 * کاربر را به صفحهٔ پرداخت جعلی بفرستد.
 */
export async function redirectToGateway(orderId: number | string): Promise<void> {
  const data = await call<{ payment?: { payment_url?: string } }>(
    `/api/payments/orders/${encodeURIComponent(String(orderId))}/pay`,
    { method: "POST", body: { gateway: "zarinpal" } },
    "اتصال به درگاه پرداخت ناموفق بود.",
  );

  const url = data.payment?.payment_url;
  let trusted = false;
  try {
    const parsed = url ? new URL(url) : null;
    trusted = Boolean(
      parsed &&
        parsed.protocol === "https:" &&
        (parsed.hostname === "zarinpal.com" || parsed.hostname.endsWith(".zarinpal.com")),
    );
  } catch {
    trusted = false;
  }

  if (!url || !trusted) {
    throw new CheckoutError("آدرس درگاه پرداخت معتبر نیست.");
  }

  window.location.assign(url);
}
