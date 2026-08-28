"use client";

import { API_PATHS } from "@/lib/api/config";
import type { AdminDiscount, DiscountType } from "@/data/admin";

/**
 * عملیات نوشتنی پنل مدیریت.
 *
 * قبلاً همه‌چیز در localStorage ذخیره می‌شد؛ یعنی تغییرات فقط در مرورگر
 * همان کاربر دیده می‌شد و هیچ‌وقت به بک‌اند نمی‌رسید. حالا هر تغییر به
 * API واقعی می‌رود و توکن از کوکی httpOnly توسط پروکسی /api اضافه می‌شود.
 */

export class AdminActionError extends Error {}

async function send<T>(
  path: string,
  init: { method: string; body?: unknown },
): Promise<T> {
  const response = await fetch(path, {
    method: init.method,
    credentials: "same-origin",
    headers: init.body ? { "Content-Type": "application/json" } : undefined,
    body: init.body ? JSON.stringify(init.body) : undefined,
  });

  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail =
      data && typeof data === "object" && "detail" in data
        ? String((data as { detail: unknown }).detail)
        : "انجام عملیات ناموفق بود.";
    throw new AdminActionError(detail);
  }

  return data as T;
}

export type CouponInput = {
  code: string;
  type: DiscountType;
  value: number;
  maxUses: number;
  expiresAt: string;
};

export async function createCoupon(input: CouponInput): Promise<void> {
  await send(API_PATHS.coupons, {
    method: "POST",
    body: {
      title: input.code,
      code: input.code,
      discount_type: input.type,
      value: input.value,
      usage_limit: input.maxUses,
      expires_at: input.expiresAt || null,
      is_active: true,
    },
  });
}

export async function setCouponActive(
  id: string,
  active: boolean,
): Promise<void> {
  await send(API_PATHS.coupon(id), {
    method: "PATCH",
    body: { is_active: active },
  });
}

export async function deleteCoupon(id: string): Promise<void> {
  await send(API_PATHS.coupon(id), { method: "DELETE" });
}

export async function setProductActive(
  id: string,
  active: boolean,
): Promise<void> {
  await send(API_PATHS.product(id), {
    method: "PATCH",
    body: { is_active: active },
  });
}

export type { AdminDiscount };
