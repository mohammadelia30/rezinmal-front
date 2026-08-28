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
  starts_at?: string | null;
  expires_at?: string | null;
  usage_limit?: number | null;
  is_active?: boolean;
};

export async function getAdminDiscounts(): Promise<AdminDiscount[]> {
  const coupons = await serverApiFetch<ApiCoupon[]>(API_PATHS.coupons);
  if (!Array.isArray(coupons)) return [];

  return coupons.map((coupon) => ({
    id: String(coupon.id),
    code: coupon.code,
    type: coupon.discount_type === "fixed" ? "fixed" : "percent",
    value: coupon.value ?? 0,
    maxUses: coupon.usage_limit ?? 0,
    used: 0,
    expiresAt: formatDate(coupon.expires_at),
    active: coupon.is_active !== false,
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
