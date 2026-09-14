"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/Container";
import {
  DashboardAddresses,
  type AddressRow,
} from "@/components/dashboard/DashboardAddresses";
import { useCart } from "@/lib/cart";
import {
  CheckoutError,
  placeOrder,
  redirectToGateway,
  syncServerCart,
  type ServerCart,
} from "@/lib/checkout";
import { formatProductPrice } from "@/lib/price";

const CARD = "rounded-2xl bg-white p-5 shadow-[0_4px_20px_rgba(78,42,84,0.06)] sm:p-6";

function message(error: unknown, fallback: string) {
  return error instanceof CheckoutError ? error.message : fallback;
}

export function CheckoutContent() {
  const { items, ready, clear } = useCart();
  const [addresses, setAddresses] = useState<AddressRow[] | null>(null);
  const [addressId, setAddressId] = useState("");
  const [manageAddresses, setManageAddresses] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [cart, setCart] = useState<ServerCart | null>(null);
  const [syncError, setSyncError] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // سفارشی که ثبت شد ولی رفتن به درگاه شکست خورد؛ پرداخت دوباره روی همان
  // سفارش انجام می‌شود تا سفارش تکراری ساخته نشود.
  const [placedOrderId, setPlacedOrderId] = useState<number | null>(null);
  const synced = useRef(false);

  // مبالغ از بک‌اند می‌آیند (با تخفیف محصولات و هزینهٔ ارسال) تا همان
  // مبلغی نمایش داده شود که در درگاه پرداخت می‌شود.
  useEffect(() => {
    if (!ready || items.length === 0 || synced.current) return;
    synced.current = true;
    syncServerCart(items)
      .then(setCart)
      .catch((syncFailure) =>
        setSyncError(message(syncFailure, "آماده‌سازی سبد خرید ناموفق بود.")),
      );
  }, [ready, items]);

  const handleAddresses = (rows: AddressRow[]) => {
    setAddresses(rows);
    setAddressId((current) => {
      if (rows.some((row) => row.id === current)) return current;
      return (rows.find((row) => row.isDefault) ?? rows[0])?.id ?? "";
    });
    if (rows.length === 0) setManageAddresses(true);
  };

  const pay = async () => {
    setError("");

    if (placedOrderId) {
      setBusy(true);
      try {
        await redirectToGateway(placedOrderId);
      } catch (payFailure) {
        setError(message(payFailure, "اتصال به درگاه پرداخت ناموفق بود."));
        setBusy(false);
      }
      return;
    }

    if (!addressId) {
      setError("یک آدرس برای ارسال سفارش انتخاب کنید.");
      return;
    }

    setBusy(true);
    try {
      // اگر سبد در زبانهٔ دیگری تغییر کرده باشد، سفارش با آخرین وضعیت ساخته شود
      await syncServerCart(items);
      const order = await placeOrder({
        addressId,
        couponCode: coupon.trim() || undefined,
      });

      // محصولات حالا در سفارش هستند و بک‌اند سبد سرور را خالی کرده است
      setPlacedOrderId(order.id);
      clear();

      await redirectToGateway(order.id);
      // مرورگر در حال رفتن به درگاه است؛ دکمه غیرفعال می‌ماند
    } catch (checkoutFailure) {
      setError(message(checkoutFailure, "ثبت سفارش ناموفق بود."));
      setBusy(false);
    }
  };

  if (!ready) {
    return (
      <Container className="py-10 sm:py-14">
        <p className="text-center text-sm text-muted">در حال بارگذاری...</p>
      </Container>
    );
  }

  if (items.length === 0 && !placedOrderId) {
    return (
      <Container className="py-10 sm:py-14">
        <div className={`${CARD} mx-auto max-w-lg text-center`}>
          <h1 className="text-xl font-bold text-foreground">سبد خرید خالی است</h1>
          <p className="mt-2 text-sm leading-7 text-muted">
            برای ثبت سفارش ابتدا محصولی به سبد خرید اضافه کنید.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            مشاهده محصولات
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      <div className="mb-6 text-right">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">تسویه حساب</h1>
        <p className="mt-1 text-sm text-muted">آدرس ارسال را انتخاب کنید و آنلاین پرداخت کنید.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="min-w-0 space-y-4">
          <section className={CARD}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setManageAddresses((open) => !open)}
                className="text-sm font-medium text-brand transition hover:text-brand-dark"
              >
                {manageAddresses ? "بستن مدیریت آدرس‌ها" : "افزودن یا ویرایش آدرس"}
              </button>
              <h2 className="text-lg font-bold text-foreground">آدرس ارسال</h2>
            </div>

            {addresses === null ? (
              <p className="text-right text-sm text-muted">در حال دریافت آدرس‌ها...</p>
            ) : addresses.length === 0 ? (
              <p className="rounded-xl bg-[#fff3d6] px-4 py-3 text-right text-sm text-[#8a6a1f]">
                هنوز آدرسی ثبت نکرده‌اید. از فرم زیر یک آدرس اضافه کنید.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {addresses.map((row) => {
                  const selected = row.id === addressId;
                  return (
                    <label
                      key={row.id}
                      className={`flex cursor-pointer gap-3 rounded-xl border p-4 text-right transition ${
                        selected
                          ? "border-brand bg-brand-mist/40 ring-2 ring-brand/15"
                          : "border-[#e6dcc2] bg-[#fbf9f1] hover:border-brand/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={row.id}
                        checked={selected}
                        onChange={() => setAddressId(row.id)}
                        className="mt-1 size-4 shrink-0 accent-brand"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold text-foreground">{row.title}</span>
                        <span className="mt-1 block text-sm leading-6 text-muted">
                          {[row.province, row.city, row.address].filter(Boolean).join("، ")}
                        </span>
                        <span className="mt-1 block text-xs text-muted">
                          {row.receiverName}
                          {row.phoneNumber ? ` · ${row.phoneNumber}` : ""}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </section>

          {/* همیشه mount است چون فهرست آدرس‌ها را همین کامپوننت می‌خواند */}
          <div hidden={!manageAddresses}>
            <DashboardAddresses onChange={handleAddresses} />
          </div>

          <section className={CARD}>
            <h2 className="mb-4 text-right text-lg font-bold text-foreground">
              محصولات ({items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString("fa-IR")} قلم)
            </h2>
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 rounded-xl bg-[#fbf9f1] p-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-brand-mist">
                    <Image src={item.image} alt={item.title} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1 text-right">
                    <p className="truncate font-bold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm text-muted">
                      تعداد: {item.quantity.toLocaleString("fa-IR")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className={`${CARD} lg:sticky lg:top-24`}>
          <h2 className="text-right text-lg font-bold text-foreground">خلاصه سفارش</h2>

          {syncError ? (
            <div className="mt-4 rounded-xl bg-[#fde8e8] px-4 py-3 text-right text-sm leading-6 text-[#9b3d3d]">
              {syncError}
              <Link href="/cart" className="mt-2 block font-bold underline">
                بازگشت به سبد خرید
              </Link>
            </div>
          ) : !cart ? (
            <p className="mt-4 text-right text-sm text-muted">در حال محاسبهٔ مبلغ...</p>
          ) : (
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between text-muted">
                <span>{formatProductPrice(cart.subtotal + cart.product_discount_amount)}</span>
                <span>جمع کالاها</span>
              </div>
              {cart.product_discount_amount > 0 ? (
                <div className="flex items-center justify-between text-[#2f6b45]">
                  <span>{formatProductPrice(cart.product_discount_amount)}−</span>
                  <span>تخفیف</span>
                </div>
              ) : null}
              <div className="flex items-center justify-between text-muted">
                <span>{cart.shipping_cost > 0 ? formatProductPrice(cart.shipping_cost) : "رایگان"}</span>
                <span>هزینهٔ ارسال</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#efe6d4] pt-3 font-bold text-foreground">
                <span>{formatProductPrice(cart.total_amount)}</span>
                <span>مبلغ قابل پرداخت</span>
              </div>
            </div>
          )}

          {!placedOrderId ? (
            <label className="mt-5 block text-right">
              <span className="mb-1.5 block text-sm font-medium text-foreground">کد تخفیف (اختیاری)</span>
              <input
                value={coupon}
                dir="ltr"
                onChange={(event) => setCoupon(event.target.value)}
                className="min-h-11 w-full rounded-xl border border-[#e6dcc2] bg-[#fbf9f1] px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
              />
              <span className="mt-1 block text-xs leading-5 text-muted">
                تخفیف کد در مبلغ نهایی درگاه اعمال می‌شود.
              </span>
            </label>
          ) : null}

          {error ? (
            <p className="mt-4 rounded-xl bg-[#fde8e8] px-4 py-3 text-right text-sm leading-6 text-[#9b3d3d]">
              {error}
            </p>
          ) : null}

          {placedOrderId ? (
            <p className="mt-4 rounded-xl bg-[#fff3d6] px-4 py-3 text-right text-sm leading-6 text-[#8a6a1f]">
              سفارش شما ثبت شد و در انتظار پرداخت است. می‌توانید دوباره تلاش کنید یا بعداً از بخش
              <Link href="/dashboard/orders" className="mx-1 font-bold underline">سفارش‌ها</Link>
              پرداخت کنید.
            </p>
          ) : null}

          <button
            type="button"
            onClick={pay}
            disabled={busy || (!placedOrderId && (!cart || Boolean(syncError)))}
            className="mt-6 w-full rounded-xl bg-brand py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {busy
              ? "در حال انتقال به درگاه..."
              : placedOrderId
                ? "تلاش دوباره برای پرداخت"
                : "پرداخت آنلاین"}
          </button>

          <p className="mt-3 text-center text-xs leading-5 text-muted">
            پرداخت امن از طریق درگاه زرین‌پال
          </p>
        </aside>
      </div>
    </Container>
  );
}
