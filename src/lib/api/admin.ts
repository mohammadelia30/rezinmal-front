import { API_PATHS } from "@/lib/api/config";
import { serverApiFetch } from "@/lib/auth/session";
import type {
  AdminDiscount,
  AdminInvoice,
  AdminOrder,
  AdminOrderStatus,
  AdminProduct,
  InvoiceStatus,
} from "@/data/admin";
import { getPrimaryImage } from "@/lib/api/mappers";
import { publicMediaUrl } from "@/lib/format";
import type { ProductDetail, ProductList } from "@/lib/api/types";

/**
 * لایهٔ دادهٔ پنل مدیریت.
 *
 * همهٔ فراخوانی‌ها سمت سرور و با توکن کوکی انجام می‌شود؛ اگر بک‌اند پاسخ
 * ندهد، مقدار خالی برمی‌گردد و صفحه حالت خالیِ واقعی نشان می‌دهد
 * (به‌جای دادهٔ نمونه که قبلاً پنل را «دمو» نشان می‌داد).
 */

type ApiOrderItem = {
  id: number;
  quantity?: number;
  price?: number;
  title?: string;
  product_title?: string;
};

type ApiOrder = {
  id: number;
  order_code: string;
  status: string;
  status_display?: string;
  recipient_name?: string;
  recipient_phone?: string;
  subtotal?: number;
  discount_amount?: number;
  shipping_cost?: number;
  total_amount?: number;
  paid_at?: string | null;
  created_date?: string;
  items?: ApiOrderItem[];
};

export type ReportOverview = {
  year: number;
  summary: { order_count: number; sales: number };
  monthly_sales: {
    month: number;
    month_name: string;
    order_count: number;
    sales: number;
  }[];
  annual_sales: { year: number; order_count: number; sales: number }[];
};

/** وضعیت‌های بک‌اند را به وضعیت‌های نمایشی فرانت نگاشت می‌کند. */
function mapOrderStatus(status: string): AdminOrderStatus {
  const normalized = (status ?? "").toLowerCase();
  if (normalized.includes("cancel")) return "cancelled";
  if (normalized.includes("deliver")) return "delivered";
  if (normalized.includes("post") || normalized.includes("ship")) {
    return "shipped";
  }
  if (normalized.includes("paid") || normalized.includes("confirm")) {
    return "paid";
  }
  return "pending";
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(value));
  } catch {
    return "—";
  }
}

function toAdminOrder(order: ApiOrder): AdminOrder {
  return {
    id: String(order.id),
    code: order.order_code ?? String(order.id),
    customer: order.recipient_name?.trim() || "—",
    phone: order.recipient_phone ?? "—",
    date: formatDate(order.paid_at ?? order.created_date),
    total: order.total_amount ?? 0,
    status: mapOrderStatus(order.status),
    itemsCount: order.items?.length ?? 0,
  };
}

function toAdminInvoice(order: ApiOrder): AdminInvoice {
  const status: InvoiceStatus = order.paid_at
    ? "paid"
    : mapOrderStatus(order.status) === "cancelled"
      ? "refunded"
      : "unpaid";

  return {
    id: String(order.id),
    number: order.order_code ?? String(order.id),
    orderCode: order.order_code ?? String(order.id),
    customer: order.recipient_name?.trim() || "—",
    date: formatDate(order.paid_at ?? order.created_date),
    total: order.total_amount ?? 0,
    status,
    items: (order.items ?? []).map((item) => ({
      title: item.product_title ?? item.title ?? "—",
      quantity: item.quantity ?? 0,
      price: item.price ?? 0,
    })),
  };
}

export async function getReportOverview(): Promise<ReportOverview | null> {
  return serverApiFetch<ReportOverview>(API_PATHS.reportsOverview);
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
  const orders = await serverApiFetch<ApiOrder[]>(API_PATHS.orders);
  if (!Array.isArray(orders)) return [];
  return orders.map(toAdminOrder);
}

export async function getAdminInvoices(): Promise<AdminInvoice[]> {
  const orders = await serverApiFetch<ApiOrder[]>(API_PATHS.orders);
  if (!Array.isArray(orders)) return [];
  return orders.map(toAdminInvoice);
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const list = await serverApiFetch<ProductList[]>(API_PATHS.products);
  if (!Array.isArray(list)) return [];

  const details = await Promise.all(
    list.map((item) => serverApiFetch<ProductDetail>(API_PATHS.product(item.id))),
  );

  return details
    .filter((detail): detail is ProductDetail => Boolean(detail))
    .map((detail) => {
      const variant = detail.variants?.[0];
      return {
        id: String(detail.id),
        title: detail.title,
        price: variant?.price ?? 0,
        image: getPrimaryImage(detail.images),
        stock: 0,
        active: detail.is_active !== false,
        sold: 0,
      };
    });
}

type ApiCoupon = {
  id: number;
  title?: string;
  code: string;
  discount_type: string;
  value: number;
  category?: number | null;
  product?: number | null;
  starts_at?: string | null;
  expires_at?: string | null;
  usage_limit?: number | null;
  is_active?: boolean;
};

type ApiCouponAssignment = {
  id: number;
  coupon: number;
  assignment_type: string;
  user?: number | null;
  level?: number | null;
};

export async function getAdminDiscounts(): Promise<AdminDiscount[]> {
  const coupons = await serverApiFetch<ApiCoupon[]>(API_PATHS.coupons);
  if (!Array.isArray(coupons)) return [];

  const assignments = await serverApiFetch<ApiCouponAssignment[]>(
    API_PATHS.couponAssignments,
  );

  const levelByCoupon = new Map<number, number>();
  if (Array.isArray(assignments)) {
    for (const item of assignments) {
      if (item.assignment_type === "level" && item.level) {
        levelByCoupon.set(item.coupon, item.level);
      }
    }
  }

  return coupons.map((coupon) => ({
    id: String(coupon.id),
    code: coupon.code,
    type: coupon.discount_type === "fixed" ? "fixed" : "percentage",
    value: coupon.value ?? 0,
    maxUses: coupon.usage_limit ?? 0,
    used: 0,
    expiresAt: formatDate(coupon.expires_at),
    active: coupon.is_active !== false,
    categoryId: coupon.category ? String(coupon.category) : "",
    productId: coupon.product ? String(coupon.product) : "",
    levelId: levelByCoupon.has(coupon.id)
      ? String(levelByCoupon.get(coupon.id))
      : "",
  }));
}


// ==========================================================
// کاربران، نقش‌ها و تنظیمات
// ==========================================================

type ApiAdminUser = {
  id: number;
  phone_number: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  is_staff: boolean;
  is_verified?: boolean;
  orders_count?: number;
  total_spent?: number;
  role_ids?: number[];
  created_at?: string;
};

export type AdminUserRow = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  isActive: boolean;
  isStaff: boolean;
  roleIds: string[];
  joinedAt: string;
};

export async function getAdminUsers(): Promise<AdminUserRow[]> {
  const users = await serverApiFetch<ApiAdminUser[]>(API_PATHS.adminUsers);
  if (!Array.isArray(users)) return [];

  return users.map((user) => ({
    id: String(user.id),
    firstName: user.first_name ?? "",
    lastName: user.last_name ?? "",
    phone: user.phone_number,
    ordersCount: user.orders_count ?? 0,
    totalSpent: user.total_spent ?? 0,
    isActive: user.is_active,
    isStaff: user.is_staff,
    roleIds: (user.role_ids ?? []).map(String),
    joinedAt: formatDate(user.created_at),
  }));
}

type ApiRole = {
  id: number;
  name: string;
  permissions?: string[];
  users_count?: number;
};

export type AdminRoleRow = {
  id: string;
  name: string;
  permissions: string[];
  usersCount: number;
};

export async function getAdminRoles(): Promise<AdminRoleRow[]> {
  const roles = await serverApiFetch<ApiRole[]>(API_PATHS.adminRoles);
  if (!Array.isArray(roles)) return [];

  return roles.map((role) => ({
    id: String(role.id),
    name: role.name,
    permissions: role.permissions ?? [],
    usersCount: role.users_count ?? 0,
  }));
}

export type SiteSettingsModel = {
  shop_name: string;
  phone: string;
  email: string;
  address: string;
  shipping_cost: number;
  free_shipping_min: number;
  payment_enabled: boolean;
  maintenance_mode: boolean;
};

export async function getSiteSettings(): Promise<SiteSettingsModel | null> {
  return serverApiFetch<SiteSettingsModel>(API_PATHS.siteSettings);
}


// ==========================================================
// دسته‌بندی، برند و جزئیات محصول (برای فرم‌ها)
// ==========================================================

export type AdminCategoryRow = {
  id: string;
  title: string;
  description: string;
  parentId: string;
  parentTitle: string;
  sortOrder: number;
  isActive: boolean;
};

type ApiCategory = {
  id: number;
  title: string;
  description?: string;
  parent?: number | null;
  sort_order?: number;
  is_active?: boolean;
};

export async function getAdminCategories(): Promise<AdminCategoryRow[]> {
  const items = await serverApiFetch<ApiCategory[]>(API_PATHS.categories);
  if (!Array.isArray(items)) return [];

  const titleById = new Map(items.map((item) => [item.id, item.title]));

  return items.map((item) => ({
    id: String(item.id),
    title: item.title,
    description: item.description ?? "",
    parentId: item.parent ? String(item.parent) : "",
    parentTitle: item.parent ? (titleById.get(item.parent) ?? "—") : "—",
    sortOrder: item.sort_order ?? 0,
    isActive: item.is_active !== false,
  }));
}

export type AdminBrandRow = {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
};

type ApiBrand = {
  id: number;
  title: string;
  description?: string;
  is_active?: boolean;
};

export async function getAdminBrands(): Promise<AdminBrandRow[]> {
  const items = await serverApiFetch<ApiBrand[]>(API_PATHS.brands);
  if (!Array.isArray(items)) return [];

  return items.map((item) => ({
    id: String(item.id),
    title: item.title,
    description: item.description ?? "",
    isActive: item.is_active !== false,
  }));
}

/** محصول با تمام فیلدهایی که فرم ویرایش لازم دارد */
export type AdminProductDetail = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  brandId: string;
  categoryIds: string[];
  status: string;
  isFeatured: boolean;
  isActive: boolean;
  price: number;
  sku: string;
  variantId: string;
  images: { id: string; url: string; isPrimary: boolean }[];
};

export async function getAdminProductDetails(): Promise<AdminProductDetail[]> {
  const list = await serverApiFetch<ProductList[]>(API_PATHS.products);
  if (!Array.isArray(list)) return [];

  const details = await Promise.all(
    list.map((item) => serverApiFetch<ProductDetail>(API_PATHS.product(item.id))),
  );

  return details
    .filter((detail): detail is ProductDetail => Boolean(detail))
    .map((detail) => {
      const variant =
        detail.variants?.find((item) => item.is_default) ?? detail.variants?.[0];
      const brand = detail.brand;

      return {
        id: String(detail.id),
        title: detail.title,
        shortDescription: detail.short_description ?? "",
        description: detail.description ?? "",
        brandId:
          brand && typeof brand === "object" && "id" in brand
            ? String((brand as { id: number }).id)
            : "",
        categoryIds: (detail.categories ?? []).map((item) => String(item.id)),
        status: detail.status == null ? "" : String(detail.status),
        isFeatured: Boolean(detail.is_featured),
        isActive: detail.is_active !== false,
        price: variant?.price ?? 0,
        sku: variant?.sku ?? "",
        variantId: variant ? String(variant.id) : "",
        images: (detail.images ?? []).map((image) => ({
          id: String(image.id),
          url: publicMediaUrl(image.image) ?? "",
          isPrimary: Boolean(image.is_primary),
        })),
      };
    });
}


// ==========================================================
// صندوق پیام (مشترک بین مشتری و مدیر)
// ==========================================================

type ApiNotification = {
  id: number;
  title: string;
  message: string;
  notification_type?: string;
  is_read: boolean;
  created_at?: string;
};

export type InboxRow = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

export async function getInbox(): Promise<InboxRow[]> {
  const items = await serverApiFetch<ApiNotification[]>(API_PATHS.notifications);
  if (!Array.isArray(items)) return [];

  return items.map((item) => ({
    id: String(item.id),
    title: item.title,
    message: item.message,
    type: item.notification_type ?? "",
    isRead: Boolean(item.is_read),
    createdAt: formatDate(item.created_at),
  }));
}


// ==========================================================
// موجودی انبار
// ==========================================================

type ApiInventory = {
  id: number;
  variant?: number;
  sku?: string;
  product_title?: string;
  stock: number;
  reserved_stock?: number;
  available_stock?: number;
  minimum_stock?: number;
  is_low_stock?: boolean;
};

export type InventoryRow = {
  id: string;
  productTitle: string;
  sku: string;
  stock: number;
  reserved: number;
  available: number;
  minimum: number;
  isLow: boolean;
};

export async function getInventories(): Promise<InventoryRow[]> {
  const items = await serverApiFetch<ApiInventory[]>(API_PATHS.inventories);
  if (!Array.isArray(items)) return [];

  return items.map((item) => ({
    id: String(item.id),
    productTitle: item.product_title ?? "—",
    sku: item.sku ?? "—",
    stock: item.stock ?? 0,
    reserved: item.reserved_stock ?? 0,
    available: item.available_stock ?? 0,
    minimum: item.minimum_stock ?? 0,
    isLow: Boolean(item.is_low_stock),
  }));
}


// ==========================================================
// باشگاه مشتریان
// ==========================================================

export type ClubLevelRow = {
  id: string;
  name: string;
  levelId: string;
  levelType: string;
  priority: number;
  minAmount: number;
  minCount: number;
  isActive: boolean;
  membersCount: number;
};

export async function getClubLevels(): Promise<ClubLevelRow[]> {
  const items = await serverApiFetch<Record<string, unknown>[]>(
    API_PATHS.clubLevels,
  );
  if (!Array.isArray(items)) return [];

  return items.map((item) => ({
    id: String(item.id),
    name: String(item.name ?? ""),
    levelId: String(item.level_id ?? ""),
    levelType: String(item.level_type ?? ""),
    priority: Number(item.priority ?? 0),
    minAmount: Number(item.min_purchase_amount ?? 0),
    minCount: Number(item.min_purchase_count ?? 0),
    isActive: item.is_active !== false,
    membersCount: Number(item.members_count ?? 0),
  }));
}

export type ClubMemberRow = {
  userId: string;
  fullName: string;
  phone: string;
  levelName: string;
  levelType: string;
  byAdmin: boolean;
  since: string;
  totalAmount: number;
  totalCount: number;
};

export async function getClubMembers(): Promise<ClubMemberRow[]> {
  const items = await serverApiFetch<Record<string, unknown>[]>(
    API_PATHS.clubMembers,
  );
  if (!Array.isArray(items)) return [];

  return items.map((item) => {
    const name = `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim();
    return {
      userId: String(item.user_id ?? ""),
      fullName: name || "—",
      phone: String(item.phone_number ?? ""),
      levelName: String(item.level_name ?? "—"),
      levelType: String(item.level_type ?? ""),
      byAdmin: Boolean(item.assigned_by_admin),
      since: formatDate(item.started_at as string | undefined),
      totalAmount: Number(item.total_purchase_amount ?? 0),
      totalCount: Number(item.total_purchase_count ?? 0),
    };
  });
}
