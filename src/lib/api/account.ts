import { API_PATHS } from "@/lib/api/config";
import { serverApiFetch } from "@/lib/auth/session";
import { formatPrice, publicMediaUrl } from "@/lib/format";
import type { DashboardOrder, OrderStatus } from "@/data/dashboard";

/**
 * سفارش‌های خودِ کاربر از بک‌اند.
 *
 * قبلاً داشبورد سفارش‌های ساختگی نشان می‌داد؛ حالا فقط دادهٔ واقعی
 * همان کاربرِ احرازشده خوانده می‌شود.
 */

const PLACEHOLDER_IMAGE = "/images/product-1.jpg";

type ApiOrderItem = {
  id: number;
  quantity?: number;
  price?: number;
  product_title?: string;
  title?: string;
  image?: string | null;
};

type ApiOrder = {
  id: number;
  order_code?: string;
  status: string;
  total_amount?: number;
  paid_at?: string | null;
  created_date?: string;
  items?: ApiOrderItem[];
};

function mapStatus(status: string): OrderStatus {
  const normalized = (status ?? "").toLowerCase();
  if (normalized.includes("cancel")) return "cancelled";
  if (normalized.includes("deliver")) return "delivered";
  if (normalized.includes("post") || normalized.includes("ship")) {
    return "shipped";
  }
  return "processing";
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return "—";
  }
}

export async function getMyOrders(): Promise<DashboardOrder[]> {
  const orders = await serverApiFetch<ApiOrder[]>(API_PATHS.orders);
  if (!Array.isArray(orders)) return [];

  return orders.map((order) => ({
    id: String(order.id),
    code: order.order_code ?? String(order.id),
    date: formatDate(order.paid_at ?? order.created_date),
    status: mapStatus(order.status),
    total: formatPrice(order.total_amount ?? 0),
    items: (order.items ?? []).map((item) => ({
      id: String(item.id),
      title: item.product_title ?? item.title ?? "—",
      image: publicMediaUrl(item.image) ?? PLACEHOLDER_IMAGE,
      quantity: item.quantity ?? 0,
      price: formatPrice(item.price ?? 0),
    })),
  }));
}

export function summarizeOrders(orders: DashboardOrder[]) {
  return {
    totalOrders: orders.length,
    activeOrders: orders.filter(
      (order) => order.status === "processing" || order.status === "shipped",
    ).length,
    deliveredOrders: orders.filter((order) => order.status === "delivered")
      .length,
  };
}
