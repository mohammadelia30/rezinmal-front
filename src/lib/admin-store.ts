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

export async function updateCoupon(
  id: string,
  input: CouponInput,
): Promise<void> {
  await send(API_PATHS.coupon(id), {
    method: "PATCH",
    body: {
      title: input.code,
      code: input.code,
      discount_type: input.type,
      value: input.value,
      usage_limit: input.maxUses,
      expires_at: input.expiresAt || null,
    },
  });
}

export async function renameRole(id: string, name: string): Promise<void> {
  await send(API_PATHS.adminRole(id), { method: "PATCH", body: { name } });
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

export async function setUserActive(
  id: string,
  active: boolean,
): Promise<void> {
  await send(API_PATHS.adminUser(id), {
    method: "PATCH",
    body: { is_active: active },
  });
}

export async function setUserStaff(
  id: string,
  staff: boolean,
): Promise<void> {
  await send(API_PATHS.adminUser(id), {
    method: "PATCH",
    body: { is_staff: staff },
  });
}

export async function setUserRoles(
  id: string,
  roleIds: string[],
): Promise<void> {
  await send(API_PATHS.adminUser(id), {
    method: "PATCH",
    body: { role_ids: roleIds.map(Number) },
  });
}

export async function createRole(name: string): Promise<void> {
  await send(API_PATHS.adminRoles, {
    method: "POST",
    body: { name, permissions: [] },
  });
}

export async function setRolePermissions(
  id: string,
  permissions: string[],
): Promise<void> {
  await send(API_PATHS.adminRole(id), {
    method: "PATCH",
    body: { permissions },
  });
}

export async function deleteRole(id: string): Promise<void> {
  await send(API_PATHS.adminRole(id), { method: "DELETE" });
}

export type SiteSettingsInput = {
  shop_name: string;
  phone: string;
  email: string;
  address: string;
  shipping_cost: number;
  free_shipping_min: number;
  payment_enabled: boolean;
  maintenance_mode: boolean;
};

export async function saveSiteSettings(
  input: SiteSettingsInput,
): Promise<void> {
  await send(API_PATHS.siteSettings, {
    method: "PATCH",
    body: input,
  });
}

// ==========================================================
// دسته‌بندی و برند
// ==========================================================

export type CategoryInput = {
  title: string;
  description: string;
  parent: string;
  sort_order: number;
  is_active: boolean;
};

function categoryBody(input: CategoryInput) {
  return {
    title: input.title,
    description: input.description,
    parent: input.parent ? Number(input.parent) : null,
    sort_order: input.sort_order,
    is_active: input.is_active,
  };
}

export async function createCategory(input: CategoryInput): Promise<void> {
  await send(API_PATHS.categories, { method: "POST", body: categoryBody(input) });
}

export async function updateCategory(
  id: string,
  input: CategoryInput,
): Promise<void> {
  await send(API_PATHS.category(id), {
    method: "PATCH",
    body: categoryBody(input),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await send(API_PATHS.category(id), { method: "DELETE" });
}

export type BrandInput = {
  title: string;
  description: string;
  is_active: boolean;
};

export async function createBrand(input: BrandInput): Promise<void> {
  await send(API_PATHS.brands, { method: "POST", body: input });
}

export async function updateBrand(id: string, input: BrandInput): Promise<void> {
  await send(API_PATHS.brand(id), { method: "PATCH", body: input });
}

export async function deleteBrand(id: string): Promise<void> {
  await send(API_PATHS.brand(id), { method: "DELETE" });
}

// ==========================================================
// محصولات
// ==========================================================

export type ProductInput = {
  title: string;
  short_description: string;
  description: string;
  brand: string;
  categories: string[];
  status: string;
  is_featured: boolean;
  is_active: boolean;
};

function productBody(input: ProductInput) {
  return {
    title: input.title,
    short_description: input.short_description,
    description: input.description,
    brand: input.brand ? Number(input.brand) : null,
    categories: input.categories.map(Number),
    status: input.status,
    is_featured: input.is_featured,
    is_active: input.is_active,
  };
}

/**
 * ساخت محصول همراه با یک واریانت پیش‌فرض.
 *
 * قیمت در بک‌اند روی واریانت است نه خود محصول، پس محصولی که واریانت
 * نداشته باشد در فروشگاه بدون قیمت نمایش داده می‌شود.
 */
export async function createProduct(
  input: ProductInput,
  variant: { sku: string; price: number },
): Promise<number> {
  const created = await send<{ id: number }>(API_PATHS.products, {
    method: "POST",
    body: productBody(input),
  });

  await send(API_PATHS.variants, {
    method: "POST",
    body: {
      product: created.id,
      sku: variant.sku,
      price: variant.price,
      is_default: true,
      is_active: true,
    },
  });

  return created.id;
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<void> {
  await send(API_PATHS.product(id), {
    method: "PATCH",
    body: productBody(input),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await send(API_PATHS.product(id), { method: "DELETE" });
}

export async function updateVariantPrice(
  variantId: string,
  price: number,
): Promise<void> {
  await send(API_PATHS.variant(variantId), {
    method: "PATCH",
    body: { price },
  });
}

/** آپلود تصویر محصول؛ چون multipart است، بدنه را دستی می‌فرستیم. */
export async function uploadProductImage(
  productId: string,
  file: File,
  isPrimary: boolean,
): Promise<void> {
  const form = new FormData();
  form.append("product", productId);
  form.append("image", file);
  form.append("is_primary", isPrimary ? "true" : "false");

  const response = await fetch(API_PATHS.productImages, {
    method: "POST",
    credentials: "same-origin",
    body: form,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new AdminActionError(
      data && typeof data === "object" && "detail" in data
        ? String((data as { detail: unknown }).detail)
        : "آپلود تصویر ناموفق بود.",
    );
  }
}

export async function deleteProductImage(imageId: string): Promise<void> {
  await send(API_PATHS.productImage(imageId), { method: "DELETE" });
}

// ==========================================================
// سفارش‌ها
// ==========================================================

export type OrderAction =
  | "confirm"
  | "cancel"
  | "preparing"
  | "readyForPost"
  | "deliveredToPost";

const ORDER_ACTION_PATHS: Record<OrderAction, (id: string) => string> = {
  confirm: API_PATHS.orderConfirm,
  cancel: API_PATHS.orderCancel,
  preparing: API_PATHS.orderPreparing,
  readyForPost: API_PATHS.orderReadyForPost,
  deliveredToPost: API_PATHS.orderDeliveredToPost,
};

export async function runOrderAction(
  id: string,
  action: OrderAction,
): Promise<void> {
  await send(ORDER_ACTION_PATHS[action](id), { method: "POST" });
}

export type { AdminDiscount };
