"use client";

import { API_PATHS } from "@/lib/api/config";
import type { AdminOrderStatus, DiscountType } from "@/data/admin";
import { toEndOfDay, toStartOfDay } from "@/lib/tehran-date";

/**
 * عملیات نوشتنی پنل مدیریت.
 *
 * قبلاً همه‌چیز در localStorage ذخیره می‌شد؛ یعنی تغییرات فقط در مرورگر
 * همان کاربر دیده می‌شد و هیچ‌وقت به بک‌اند نمی‌رسید. حالا هر تغییر به
 * API واقعی می‌رود و توکن از کوکی httpOnly توسط پروکسی /api اضافه می‌شود.
 */

export class AdminActionError extends Error {}

/** پیام‌های انگلیسی بک‌اند که مدیر فروشگاه ممکن است ببیند. */
const API_MESSAGES: [RegExp, string][] = [
  [/exactly one target/i, "یک محصول یا یک دسته‌بندی انتخاب کنید (فقط یکی)."],
  [/percentage .*(exceed|cannot)|value__lte|max_100/i, "درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد."],
  [/greater than zero/i, "مقدار باید بیشتر از صفر باشد."],
  [/expiration date must be after/i, "تاریخ پایان باید بعد از تاریخ شروع باشد."],
  [/with this sku|sku already exists/i, "این کد کالا (SKU) قبلاً برای محصول دیگری ثبت شده است."],
  [/with this barcode|barcode already exists/i, "این بارکد قبلاً برای محصول دیگری ثبت شده است."],
  [/with this title already exists/i, "این عنوان قبلاً ثبت شده است."],
  [/attribute, value must make a unique set/i, "این مقدار برای این ویژگی قبلاً ثبت شده است."],
  [/valid image|corrupted image/i, "این فایل تصویر معتبری نیست؛ عکس را با فرمت JPG یا PNG بفرستید."],
  [/coupon with this code already exists|code already exists|unique/i, "این کد تخفیف قبلاً ثبت شده است."],
  [/code cannot be empty/i, "کد تخفیف را وارد کنید."],
  [/datetime has wrong format|date has wrong format/i, "تاریخ وارد شده معتبر نیست."],
  [/free shipping minimum/i, "حداقل مبلغ ارسال رایگان باید از هر دو هزینهٔ ارسال بیشتر باشد."],
  [/cannot change order status/i, "این تغییر وضعیت برای این سفارش مجاز نیست."],
  [/permission/i, "دسترسی لازم برای این کار را ندارید."],
  [/this field is required/i, "همهٔ فیلدهای لازم را پر کنید."],
  [/invalid pk|does not exist/i, "مورد انتخاب‌شده دیگر وجود ندارد."],
];

/**
 * اولین پیام خطای DRF، به فارسی.
 *
 * DRF خطای اعتبارسنجی را به شکل {فیلد: [پیام]} برمی‌گرداند، نه
 * {detail}؛ قبلاً فقط detail خوانده می‌شد و مدیر برای هر خطای فرم فقط
 * «انجام عملیات ناموفق بود» می‌دید.
 */
function readApiError(data: unknown, status: number): string {
  const pick = (value: unknown): string | null => {
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return pick(value[0]);
    if (value && typeof value === "object") {
      const record = value as Record<string, unknown>;
      return pick(record.detail) ?? pick(Object.values(record)[0]);
    }
    return null;
  };

  const message = pick(data);
  if (message) {
    for (const [pattern, persian] of API_MESSAGES) {
      if (pattern.test(message)) return persian;
    }
    if (/[\u0600-\u06FF]/.test(message)) return message;
  }

  if (status === 403) return "دسترسی لازم برای این کار را ندارید.";
  if (status === 404) return "مورد مورد نظر پیدا نشد.";
  return "انجام عملیات ناموفق بود.";
}

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
    throw new AdminActionError(readApiError(data, response.status));
  }

  return data as T;
}

// ==========================================================
// کد تخفیف و تخفیف محصول
// ==========================================================

export type CouponInput = {
  code: string;
  type: DiscountType;
  value: number;
  /** null یعنی بدون سقف */
  usageLimit: number | null;
  startsAt: string;
  expiresAt: string;
  /** خالی یعنی همهٔ کاربران */
  levelIds: string[];
};

function couponBody(input: CouponInput) {
  return {
    title: input.code,
    code: input.code,
    discount_type: input.type,
    value: input.value,
    usage_limit: input.usageLimit,
    starts_at: toStartOfDay(input.startsAt),
    expires_at: toEndOfDay(input.expiresAt),
    // کد تخفیف دیگر به محصول یا دسته گره نمی‌خورد؛ آن کار «تخفیف محصول»
    // است. مقدارهای قدیمی هم پاک می‌شوند تا کد روی کل سبد اعمال شود.
    category: null,
    product: null,
  };
}

/**
 * کد را به سطح‌های باشگاه اختصاص می‌دهد.
 *
 * هر تخصیص در بک‌اند یک رکورد جداست و به اعضای فعلی آن سطح کد می‌دهد
 * (و اعلان می‌فرستد)؛ پس فقط سطح‌هایی که هنوز تخصیص ندارند ثبت می‌شوند،
 * وگرنه هر ویرایش تخصیص تکراری می‌ساخت.
 */
async function assignLevels(
  couponId: number | string,
  levelIds: string[],
  alreadyAssigned: string[] = [],
): Promise<void> {
  for (const levelId of levelIds) {
    if (alreadyAssigned.includes(levelId)) continue;
    await send(API_PATHS.couponAssignments, {
      method: "POST",
      body: {
        coupon: Number(couponId),
        assignment_type: "level",
        level: Number(levelId),
      },
    });
  }
}

export async function createCoupon(input: CouponInput): Promise<void> {
  const created = await send<{ id: number }>(API_PATHS.coupons, {
    method: "POST",
    body: { ...couponBody(input), is_active: true },
  });
  await assignLevels(created.id, input.levelIds);
}

export async function updateCoupon(
  id: string,
  input: CouponInput,
  alreadyAssignedLevels: string[],
): Promise<void> {
  await send(API_PATHS.coupon(id), {
    method: "PATCH",
    body: couponBody(input),
  });
  await assignLevels(id, input.levelIds, alreadyAssignedLevels);
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

export type ProductDiscountInput = {
  type: DiscountType;
  value: number;
  targetKind: "product" | "category";
  targetId: string;
  startsAt: string;
  expiresAt: string;
};

function productDiscountBody(input: ProductDiscountInput) {
  // بک‌اند دقیقاً یک هدف می‌خواهد؛ دیگری باید صریحاً null باشد
  return {
    discount_type: input.type,
    value: input.value,
    product: input.targetKind === "product" ? Number(input.targetId) : null,
    category: input.targetKind === "category" ? Number(input.targetId) : null,
    starts_at: toStartOfDay(input.startsAt),
    expires_at: toEndOfDay(input.expiresAt),
  };
}

export async function createProductDiscount(
  input: ProductDiscountInput,
): Promise<void> {
  await send(API_PATHS.discounts, {
    method: "POST",
    body: { ...productDiscountBody(input), is_active: true },
  });
}

export async function updateProductDiscount(
  id: string,
  input: ProductDiscountInput,
): Promise<void> {
  await send(API_PATHS.discount(id), {
    method: "PATCH",
    body: productDiscountBody(input),
  });
}

export async function setProductDiscountActive(
  id: string,
  active: boolean,
): Promise<void> {
  await send(API_PATHS.discount(id), {
    method: "PATCH",
    body: { is_active: active },
  });
}

export async function deleteProductDiscount(id: string): Promise<void> {
  await send(API_PATHS.discount(id), { method: "DELETE" });
}

export async function renameRole(id: string, name: string): Promise<void> {
  await send(API_PATHS.adminRole(id), { method: "PATCH", body: { name } });
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
  meta_description: string;
  standard_shipping_cost: number;
  large_shipping_cost: number;
  free_shipping_min: number;
  payment_enabled: boolean;
  maintenance_mode: boolean;
};

export async function saveSiteSettings<T extends SiteSettingsInput>(
  input: T,
): Promise<T> {
  // پاسخ برگردانده می‌شود تا فرم همان چیزی را نشان دهد که ذخیره شده
  return send<T>(API_PATHS.siteSettings, {
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
  /** تصویر تازه؛ خالی یعنی تصویر فعلی دست‌نخورده بماند */
  image?: File | null;
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

/**
 * دسته‌بندی با تصویر.
 *
 * تصویر فایل است، پس درخواست باید multipart باشد؛ با JSON معمولی
 * فیلد image اصلاً به بک‌اند نمی‌رسید و دسته بدون عکس ذخیره می‌شد.
 */
async function sendCategory(
  path: string,
  method: "POST" | "PATCH",
  input: CategoryInput,
): Promise<void> {
  const body = categoryBody(input);

  if (!input.image) {
    await send(path, { method, body });
    return;
  }

  const problem = checkImageFile(input.image);
  if (problem) throw new AdminActionError(problem);

  const form = new FormData();
  for (const [key, value] of Object.entries(body)) {
    // parent خالی را نباید فرستاد؛ رشتهٔ "null" برای بک‌اند عدد نیست
    if (value === null || value === undefined) continue;
    form.append(key, String(value));
  }
  form.append("image", input.image);

  const response = await fetch(path, {
    method,
    credentials: "same-origin",
    body: form,
  });

  if (!response.ok) {
    if (response.status === 413) {
      throw new AdminActionError(
        "حجم تصویر بیشتر از حد مجاز است؛ تصویر کوچک‌تری انتخاب کنید.",
      );
    }
    const data = await response.json().catch(() => null);
    throw new AdminActionError(readApiError(data, response.status));
  }
}

export async function createCategory(input: CategoryInput): Promise<void> {
  await sendCategory(API_PATHS.categories, "POST", input);
}

export async function updateCategory(
  id: string,
  input: CategoryInput,
): Promise<void> {
  await sendCategory(API_PATHS.category(id), "PATCH", input);
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
  meta_title: string;
  meta_description: string;
};

/** وضعیت در بک‌اند IntegerChoices است: ۱ پیش‌نویس، ۲ منتشرشده، ۳ بایگانی */
export const PRODUCT_STATUS = [
  { value: "1", label: "پیش‌نویس" },
  { value: "2", label: "منتشر شده" },
  { value: "3", label: "بایگانی" },
];

function productBody(input: ProductInput) {
  return {
    title: input.title,
    short_description: input.short_description,
    description: input.description,
    brand: input.brand ? Number(input.brand) : null,
    categories: input.categories.map(Number),
    status: Number(input.status) || 2,
    is_featured: input.is_featured,
    is_active: input.is_active,
    meta_title: input.meta_title,
    meta_description: input.meta_description,
  };
}

// ==========================================================
// نسخه‌های محصول (رنگ، سایز و ... هرکدام با قیمت خودش)
// ==========================================================
//
// قیمت و موجودی در بک‌اند روی نسخه است نه روی خود محصول، پس هر رنگ یا
// سایز یک نسخهٔ جداست و محصولِ بدون نسخه در فروشگاه بی‌قیمت دیده
// می‌شود. ویژگی‌ها هم جدا از نسخه ذخیره می‌شوند: «رنگ» یک Attribute و
// «آبی» یک AttributeValue است.

/** یک ویژگی و مقدارش، همان‌طور که مدیر در فرم می‌نویسد */
export type VariantAttributeInput = { name: string; value: string };

export type VariantInput = {
  /** خالی یعنی نسخهٔ تازه */
  id: string;
  /** رکورد موجودی؛ خالی یعنی باید ساخته شود */
  inventoryId: string;
  attributes: VariantAttributeInput[];
  sku: string;
  price: number;
  barcode: string;
  /** گرم؛ خالی یعنی ثبت‌نشده */
  weight: number | null;
  stock: number;
  minimumStock: number;
  isDefault: boolean;
  isActive: boolean;
};

/** ویژگی‌های ثبت‌شده، همان‌طور که صفحه از سرور گرفته است */
export type AttributeCatalog = {
  id: string;
  title: string;
  values: { id: string; value: string }[];
}[];

const attributeKey = (name: string, value: string) =>
  `${name.trim()}\u0000${value.trim()}`;

/**
 * شناسهٔ مقدار یک ویژگی؛ اگر نباشد ساخته می‌شود.
 *
 * مدیر «رنگ» و «آبی» را تایپ می‌کند و نباید درگیر این شود که کدام‌شان
 * از قبل در دیتابیس هست. چیزی که ساخته می‌شود در حافظه می‌ماند تا
 * نسخهٔ بعدیِ همان فرم دوباره نسازد و به خطای تکراری نخورد.
 */
function attributeResolver(known: AttributeCatalog) {
  const attributeIds = new Map<string, number>();
  const valueIds = new Map<string, number>();

  for (const attribute of known) {
    attributeIds.set(attribute.title.trim(), Number(attribute.id));
    for (const value of attribute.values) {
      valueIds.set(
        attributeKey(attribute.title, value.value),
        Number(value.id),
      );
    }
  }

  return async function resolve(
    pair: VariantAttributeInput,
  ): Promise<number> {
    const name = pair.name.trim();
    const value = pair.value.trim();

    const existing = valueIds.get(attributeKey(name, value));
    if (existing) return existing;

    let attributeId = attributeIds.get(name);
    if (!attributeId) {
      const attribute = await send<{ id: number }>(API_PATHS.attributes, {
        method: "POST",
        body: { title: name },
      });
      attributeId = attribute.id;
      attributeIds.set(name, attributeId);
    }

    const created = await send<{ id: number }>(API_PATHS.attributeValues, {
      method: "POST",
      body: { attribute: attributeId, value },
    });
    valueIds.set(attributeKey(name, value), created.id);
    return created.id;
  };
}

/** کد کالای خالی را خودمان می‌سازیم؛ در بک‌اند یکتا و اجباری است */
const variantSku = (variant: VariantInput, index: number) =>
  variant.sku.trim() || `SKU-${Date.now()}-${index + 1}`;

export async function saveProductVariants(
  productId: string,
  variants: VariantInput[],
  removedVariantIds: string[],
  attributes: AttributeCatalog,
): Promise<void> {
  const resolve = attributeResolver(attributes);

  for (const variantId of removedVariantIds) {
    await send(API_PATHS.variant(variantId), { method: "DELETE" });
  }

  for (const [index, variant] of variants.entries()) {
    const values: number[] = [];
    for (const pair of variant.attributes) {
      if (!pair.name.trim() || !pair.value.trim()) continue;
      values.push(await resolve(pair));
    }

    const body = {
      product: Number(productId),
      sku: variantSku(variant, index),
      price: variant.price,
      barcode: variant.barcode.trim() || null,
      weight: variant.weight,
      attribute_values: values,
      is_default: variant.isDefault,
      is_active: variant.isActive,
    };

    const saved = variant.id
      ? await send<{ id: number }>(API_PATHS.variant(variant.id), {
          method: "PATCH",
          body,
        })
      : await send<{ id: number }>(API_PATHS.variants, {
          method: "POST",
          body,
        });

    // بدون رکورد موجودی، محصول به سبد خرید اضافه نمی‌شود
    if (variant.inventoryId) {
      await send(API_PATHS.inventory(variant.inventoryId), {
        method: "PATCH",
        body: { stock: variant.stock, minimum_stock: variant.minimumStock },
      });
    } else {
      await createInventory(
        String(saved.id),
        variant.stock,
        variant.minimumStock,
      );
    }
  }
}

export async function createProduct(
  input: ProductInput,
  variants: VariantInput[],
  attributes: AttributeCatalog,
): Promise<number> {
  const created = await send<{ id: number }>(API_PATHS.products, {
    method: "POST",
    body: productBody(input),
  });

  await saveProductVariants(String(created.id), variants, [], attributes);

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

/** بیشترین حجم تصویر؛ باید با client_max_body_size در nginx بک‌اند بخواند */
export const MAX_IMAGE_BYTES = 25 * 1024 * 1024;

const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|gif|bmp|heic|heif|avif|tiff?)$/i;

export function checkImageFile(file: File): string {
  // بعضی گالری‌های اندروید نوع فایل را خالی می‌دهند؛ قبلاً همین باعث
  // می‌شد انتخاب عکس با پیام «تصویر نیست» رد شود و هیچ درخواستی هم به
  // سرور نرود. وقتی نوع معلوم نیست، به پسوند نگاه می‌کنیم.
  const looksLikeImage = file.type
    ? file.type.startsWith("image/")
    : IMAGE_EXTENSIONS.test(file.name);

  if (!looksLikeImage) {
    return `«${file.name}» تصویر نیست.`;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    const size = (file.size / 1024 / 1024).toFixed(1);
    return `حجم «${file.name}» ${size} مگابایت است؛ حداکثر ۲۵ مگابایت مجاز است.`;
  }
  return "";
}

/** آپلود تصویر محصول؛ چون multipart است، بدنه را دستی می‌فرستیم. */
export async function uploadProductImage(
  productId: string,
  file: File,
  isPrimary: boolean,
  alt: string,
): Promise<void> {
  const tooBig = checkImageFile(file);
  if (tooBig) throw new AdminActionError(tooBig);

  if (!alt.trim()) {
    throw new AdminActionError(
      `برای «${file.name}» متن جایگزین تصویر را بنویسید.`,
    );
  }

  const form = new FormData();
  form.append("product", productId);
  form.append("image", file);
  form.append("alt", alt.trim());
  form.append("is_primary", isPrimary ? "true" : "false");

  const response = await fetch(API_PATHS.productImages, {
    method: "POST",
    credentials: "same-origin",
    body: form,
  });

  if (!response.ok) {
    // ۴۱۳ از nginx می‌آید و بدنه‌اش HTML است، نه JSON
    if (response.status === 413) {
      throw new AdminActionError(
        "حجم تصویر بیشتر از حد مجاز است؛ تصویر کوچک‌تری انتخاب کنید.",
      );
    }

    const data = await response.json().catch(() => null);
    throw new AdminActionError(readApiError(data, response.status));
  }
}

export async function deleteProductImage(imageId: string): Promise<void> {
  await send(API_PATHS.productImage(imageId), { method: "DELETE" });
}

// ==========================================================
// سفارش‌ها
// ==========================================================

export type BulkStatusResult = {
  changed: { id: number; order_code: string }[];
  skipped: {
    id: number;
    order_code: string | null;
    reason: "not_found" | "unchanged" | "invalid_transition" | "error";
  }[];
};

/**
 * تغییر وضعیت یک یا چند سفارش با یک درخواست.
 *
 * بک‌اند هر سفارش را جدا بررسی می‌کند؛ سفارشی که این تغییر برایش مجاز
 * نیست رد می‌شود و بقیه انجام می‌شوند.
 */
export async function changeOrdersStatus(
  ids: string[],
  status: AdminOrderStatus,
): Promise<BulkStatusResult> {
  return send<BulkStatusResult>(API_PATHS.ordersBulkStatus, {
    method: "POST",
    body: { ids: ids.map(Number), status },
  });
}

// ==========================================================
// موجودی انبار
// ==========================================================

export async function changeStock(
  id: string,
  quantity: number,
  direction: "increase" | "decrease",
): Promise<void> {
  const path =
    direction === "increase"
      ? API_PATHS.inventoryIncrease(id)
      : API_PATHS.inventoryDecrease(id);
  await send(path, { method: "POST", body: { quantity } });
}

export async function createInventory(
  variantId: string,
  stock: number,
  minimum: number,
): Promise<void> {
  await send(API_PATHS.inventories, {
    method: "POST",
    body: {
      variant: Number(variantId),
      stock,
      minimum_stock: minimum,
      is_active: true,
    },
  });
}

export async function setMinimumStock(
  id: string,
  minimum: number,
): Promise<void> {
  await send(API_PATHS.inventory(id), {
    method: "PATCH",
    body: { minimum_stock: minimum },
  });
}

// ==========================================================
// سطوح باشگاه مشتریان
// ==========================================================

export type ClubLevelInput = {
  name: string;
  levelType: string;
  priority: number;
  minAmount: number;
  minCount: number;
  isActive: boolean;
};

function levelBody(input: ClubLevelInput) {
  return {
    name: input.name,
    level_type: input.levelType,
    priority: input.priority,
    min_purchase_amount: input.minAmount,
    min_purchase_count: input.minCount,
    is_active: input.isActive,
  };
}

export async function createClubLevel(
  input: ClubLevelInput,
): Promise<void> {
  await send(API_PATHS.clubLevels, {
    method: "POST",
    body: levelBody(input),
  });
}

export async function updateClubLevel(
  id: string,
  input: ClubLevelInput,
): Promise<void> {
  await send(API_PATHS.clubLevel(id), {
    method: "PATCH",
    body: levelBody(input),
  });
}

export async function deleteClubLevel(id: string): Promise<void> {
  await send(API_PATHS.clubLevel(id), { method: "DELETE" });
}

/**
 * تغییر رمز یک کاربر توسط مدیر.
 *
 * رمز فعلی لازم نیست چون مدیر آن را نمی‌داند؛ بک‌اند دسترسی را بررسی
 * می‌کند و توکن‌های قبلی آن کاربر را باطل می‌کند.
 */
export async function setUserPassword(
  id: string,
  password: string,
  confirm: string,
): Promise<void> {
  await send(API_PATHS.adminUserSetPassword(id), {
    method: "POST",
    body: { password, password_confirm: confirm },
  });
}


// ==========================================================
// مقالات
// ==========================================================

export type ArticleInput = {
  title: string;
  summary: string;
  content: string;
  isPublished: boolean;
  coverAlt: string;
  metaTitle: string;
  metaDescription: string;
  /** تصویر تازه؛ خالی یعنی تصویر فعلی بماند */
  cover?: File | null;
};

function articleBody(input: ArticleInput) {
  return {
    title: input.title,
    summary: input.summary,
    content: input.content,
    is_published: input.isPublished,
    cover_alt: input.coverAlt,
    meta_title: input.metaTitle,
    meta_description: input.metaDescription,
  };
}

/** مقاله با تصویر؛ مثل دسته‌بندی، وجود فایل یعنی درخواست multipart. */
async function sendArticle(
  path: string,
  method: "POST" | "PATCH",
  input: ArticleInput,
): Promise<void> {
  const body = articleBody(input);

  if (!input.cover) {
    await send(path, { method, body });
    return;
  }

  const problem = checkImageFile(input.cover);
  if (problem) throw new AdminActionError(problem);

  const form = new FormData();
  for (const [key, value] of Object.entries(body)) {
    form.append(key, String(value));
  }
  form.append("cover", input.cover);

  const response = await fetch(path, {
    method,
    credentials: "same-origin",
    body: form,
  });

  if (!response.ok) {
    if (response.status === 413) {
      throw new AdminActionError(
        "حجم تصویر بیشتر از حد مجاز است؛ تصویر کوچک‌تری انتخاب کنید.",
      );
    }
    const data = await response.json().catch(() => null);
    throw new AdminActionError(readApiError(data, response.status));
  }
}

export async function createArticle(input: ArticleInput): Promise<void> {
  await sendArticle(API_PATHS.articles, "POST", input);
}

export async function updateArticle(
  id: string,
  input: ArticleInput,
): Promise<void> {
  await sendArticle(API_PATHS.article(id), "PATCH", input);
}

export async function setArticlePublished(
  id: string,
  isPublished: boolean,
): Promise<void> {
  await send(API_PATHS.article(id), {
    method: "PATCH",
    body: { is_published: isPublished },
  });
}

export async function deleteArticle(id: string): Promise<void> {
  await send(API_PATHS.article(id), { method: "DELETE" });
}

