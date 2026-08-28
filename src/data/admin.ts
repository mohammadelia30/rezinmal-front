export type AdminOrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export type InvoiceStatus = "paid" | "unpaid" | "refunded";

export type AdminPermission =
  | "dashboard"
  | "orders"
  | "invoices"
  | "products"
  | "discounts"
  | "users"
  | "roles"
  | "settings";

export type DiscountType = "percent" | "fixed";

export type AdminOrder = {
  id: string;
  code: string;
  customer: string;
  phone: string;
  date: string;
  total: number;
  status: AdminOrderStatus;
  itemsCount: number;
};

export type AdminInvoice = {
  id: string;
  number: string;
  orderCode: string;
  customer: string;
  date: string;
  total: number;
  status: InvoiceStatus;
  items: { title: string; quantity: number; price: number }[];
};

export type AdminProduct = {
  id: string;
  title: string;
  price: number;
  image: string;
  stock: number;
  active: boolean;
  sold: number;
};

export type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  status: "active" | "blocked";
  joinedAt: string;
};

export type AdminRole = {
  id: string;
  name: string;
  description: string;
  permissions: AdminPermission[];
};

export type AdminDiscount = {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  maxUses: number;
  used: number;
  expiresAt: string;
  active: boolean;
};

export type AdminSettings = {
  shopName: string;
  phone: string;
  email: string;
  address: string;
  shippingCost: number;
  freeShippingMin: number;
  paymentEnabled: boolean;
  maintenanceMode: boolean;
};

export const orderStatusLabels: Record<AdminOrderStatus, string> = {
  pending: "در انتظار",
  paid: "پرداخت‌شده",
  shipped: "ارسال‌شده",
  delivered: "تحویل‌شده",
  cancelled: "لغو‌شده",
};

export const orderStatusStyles: Record<AdminOrderStatus, string> = {
  pending: "bg-[#fff3d6] text-[#8a6a1f]",
  paid: "bg-brand-mist text-brand",
  shipped: "bg-[#e0eefc] text-[#1f5a8a]",
  delivered: "bg-[#e4f5ea] text-[#2f6b45]",
  cancelled: "bg-[#fde8e8] text-[#9b3d3d]",
};

export const invoiceStatusLabels: Record<InvoiceStatus, string> = {
  paid: "پرداخت‌شده",
  unpaid: "پرداخت‌نشده",
  refunded: "مرجوعی",
};

export const invoiceStatusStyles: Record<InvoiceStatus, string> = {
  paid: "bg-[#e4f5ea] text-[#2f6b45]",
  unpaid: "bg-[#fff3d6] text-[#8a6a1f]",
  refunded: "bg-[#fde8e8] text-[#9b3d3d]",
};

export const permissionLabels: Record<AdminPermission, string> = {
  dashboard: "داشبورد",
  orders: "سفارش‌ها",
  invoices: "فاکتورها",
  products: "محصولات",
  discounts: "کد تخفیف",
  users: "کاربران",
  roles: "نقش‌ها",
  settings: "تنظیمات",
};

export const allPermissions: AdminPermission[] = [
  "dashboard",
  "orders",
  "invoices",
  "products",
  "discounts",
  "users",
  "roles",
  "settings",
];


/** فروش محصولات (تومان) */






export const defaultSettings: AdminSettings = {
  shopName: "رزین‌مال",
  phone: "۰۲۱ ۳۴۴۲ ۳۶۰",
  email: "info@resinmal.com",
  address: "تهران، ولیعصر",
  shippingCost: 50_000,
  freeShippingMin: 1_000_000,
  paymentEnabled: true,
  maintenanceMode: false,
};
