/**
 * دقیقاً همان وضعیت‌های Order.Status در بک‌اند.
 *
 * قبلاً به پنج وضعیت کلی خلاصه می‌شدند؛ مثلاً «آماده‌سازی» و «در انتظار
 * پرداخت» هر دو «در انتظار» نشان داده می‌شدند و دکمه‌هایی ظاهر می‌شد
 * که بک‌اند برای آن سفارش رد می‌کرد.
 */
export type AdminOrderStatus =
  | "pending_payment"
  | "confirmed"
  | "preparing"
  | "ready_for_post"
  | "delivered_to_post"
  | "cancelled";

/** تغییر وضعیت‌های مجاز؛ همان OrderService.ALLOWED_STATUS_TRANSITIONS */
export const orderStatusTransitions: Record<AdminOrderStatus, AdminOrderStatus[]> = {
  pending_payment: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["ready_for_post", "cancelled"],
  ready_for_post: ["delivered_to_post"],
  delivered_to_post: [],
  cancelled: [],
};

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

// مقادیر باید دقیقاً با DiscountType در بک‌اند یکی باشند
export type DiscountType = "percentage" | "fixed";

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
  /** جمع کالاها پس از تخفیف محصول */
  subtotal: number;
  discount: number;
  shippingCost: number;
  shippingType: ShippingType;
  total: number;
  status: InvoiceStatus;
  items: { title: string; quantity: number; price: number }[];
};

export type ShippingType = "standard" | "large";

export const shippingTypeLabels: Record<ShippingType, string> = {
  standard: "بستهٔ استاندارد",
  large: "بستهٔ بزرگ",
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

/**
 * کد تخفیف (Coupon): مشتری هنگام خرید کد را وارد می‌کند.
 * مخاطبش همهٔ کاربران است یا اعضای سطح‌های مشخصی از باشگاه مشتریان.
 */
export type AdminCoupon = {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  /** null یعنی بدون سقف */
  usageLimit: number | null;
  used: number;
  /** yyyy-mm-dd به وقت تهران، برای فرم؛ خالی یعنی بدون محدودیت */
  startsAt: string;
  expiresAt: string;
  active: boolean;
  levelIds: string[];
  /** تعداد تخصیص‌های مستقیم به کاربر (از پنل جنگو) */
  userAssignments: number;
};

/**
 * تخفیف محصول (Discount): کد ندارد و خودکار روی قیمت یک محصول یا همهٔ
 * محصولات یک دسته اعمال می‌شود.
 */
export type AdminProductDiscount = {
  id: string;
  type: DiscountType;
  value: number;
  targetKind: "product" | "category";
  targetId: string;
  targetTitle: string;
  startsAt: string;
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
  pending_payment: "در انتظار پرداخت",
  confirmed: "تأییدشده",
  preparing: "در حال آماده‌سازی",
  ready_for_post: "آمادهٔ ارسال",
  delivered_to_post: "تحویل به تیپاکس",
  cancelled: "لغوشده",
};

export const orderStatusStyles: Record<AdminOrderStatus, string> = {
  pending_payment: "bg-[#f1ede4] text-[#6b6358]",
  confirmed: "bg-[#fff3d6] text-[#8a6a1f]",
  preparing: "bg-brand-mist text-brand",
  ready_for_post: "bg-[#e0eefc] text-[#1f5a8a]",
  delivered_to_post: "bg-[#e4f5ea] text-[#2f6b45]",
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
