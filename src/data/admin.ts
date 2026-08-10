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

export const adminStats = {
  salesToday: 4_850_000,
  salesMonth: 86_400_000,
  ordersToday: 12,
  ordersMonth: 214,
  newUsersWeek: 38,
  activeProducts: 4,
  pendingOrders: 7,
  lowStock: 2,
  activeDiscounts: 3,
};

/** فروش ۷ روز اخیر (تومان) */
export const salesByDay = [
  { label: "شنبه", value: 6_200_000 },
  { label: "یکشنبه", value: 4_800_000 },
  { label: "دوشنبه", value: 7_100_000 },
  { label: "سه‌شنبه", value: 5_400_000 },
  { label: "چهارشنبه", value: 8_900_000 },
  { label: "پنجشنبه", value: 9_600_000 },
  { label: "جمعه", value: 4_850_000 },
] as const;

/** تعداد سفارش در ۶ ماه اخیر */
export const ordersByMonth = [
  { label: "دی", value: 142 },
  { label: "بهمن", value: 168 },
  { label: "اسفند", value: 191 },
  { label: "فروردین", value: 175 },
  { label: "اردیبهشت", value: 203 },
  { label: "خرداد", value: 214 },
] as const;

/** توزیع وضعیت سفارش‌ها */
export const ordersByStatus = [
  { status: "pending" as const, value: 7, color: "#d4a017" },
  { status: "paid" as const, value: 18, color: "#5b2a63" },
  { status: "shipped" as const, value: 12, color: "#3b7bb8" },
  { status: "delivered" as const, value: 45, color: "#2f6b45" },
  { status: "cancelled" as const, value: 4, color: "#9b3d3d" },
];

/** فروش محصولات (تومان) */
export const productSalesChart = [
  { label: "ساعت دیواری", value: 43_000_000 },
  { label: "قالب سیلیکونی", value: 26_000_000 },
  { label: "زیورآلات", value: 20_500_000 },
  { label: "هرم دکوراتیو", value: 20_100_000 },
] as const;

export const adminOrders: AdminOrder[] = [
  {
    id: "ao1",
    code: "RM-10452",
    customer: "سارا احمدی",
    phone: "09121234567",
    date: "۱۴۰۴/۰۵/۱۹",
    total: 1_300_000,
    status: "pending",
    itemsCount: 2,
  },
  {
    id: "ao2",
    code: "RM-10448",
    customer: "مریم کریمی",
    phone: "09129876543",
    date: "۱۴۰۴/۰۵/۱۸",
    total: 500_000,
    status: "paid",
    itemsCount: 1,
  },
  {
    id: "ao3",
    code: "RM-10441",
    customer: "نیلوفر رضایی",
    phone: "09351234567",
    date: "۱۴۰۴/۰۵/۱۷",
    total: 800_000,
    status: "shipped",
    itemsCount: 2,
  },
  {
    id: "ao4",
    code: "RM-10428",
    customer: "زهرا موسوی",
    phone: "09121112233",
    date: "۱۴۰۴/۰۵/۱۲",
    total: 1_300_000,
    status: "delivered",
    itemsCount: 3,
  },
  {
    id: "ao5",
    code: "RM-10410",
    customer: "فاطمه حسینی",
    phone: "09123334455",
    date: "۱۴۰۴/۰۵/۰۸",
    total: 300_000,
    status: "cancelled",
    itemsCount: 1,
  },
];

export const adminInvoices: AdminInvoice[] = [
  {
    id: "inv1",
    number: "INV-24019",
    orderCode: "RM-10448",
    customer: "مریم کریمی",
    date: "۱۴۰۴/۰۵/۱۸",
    total: 500_000,
    status: "paid",
    items: [{ title: "ساعت دیواری رزین", quantity: 1, price: 500_000 }],
  },
  {
    id: "inv2",
    number: "INV-24018",
    orderCode: "RM-10441",
    customer: "نیلوفر رضایی",
    date: "۱۴۰۴/۰۵/۱۷",
    total: 800_000,
    status: "paid",
    items: [
      { title: "زیورآلات رزینی", quantity: 1, price: 500_000 },
      { title: "هرم رزینی دکوراتیو", quantity: 1, price: 300_000 },
    ],
  },
  {
    id: "inv3",
    number: "INV-24015",
    orderCode: "RM-10428",
    customer: "زهرا موسوی",
    date: "۱۴۰۴/۰۵/۱۲",
    total: 1_300_000,
    status: "paid",
    items: [
      { title: "ساعت دیواری رزین", quantity: 1, price: 500_000 },
      { title: "هرم رزینی دکوراتیو", quantity: 2, price: 800_000 },
    ],
  },
  {
    id: "inv4",
    number: "INV-24012",
    orderCode: "RM-10410",
    customer: "فاطمه حسینی",
    date: "۱۴۰۴/۰۵/۰۸",
    total: 300_000,
    status: "refunded",
    items: [{ title: "هرم رزینی دکوراتیو", quantity: 1, price: 300_000 }],
  },
  {
    id: "inv5",
    number: "INV-24020",
    orderCode: "RM-10452",
    customer: "سارا احمدی",
    date: "۱۴۰۴/۰۵/۱۹",
    total: 1_300_000,
    status: "unpaid",
    items: [
      { title: "ساعت دیواری رزین", quantity: 1, price: 500_000 },
      { title: "هنر قالب سیلیکونی", quantity: 1, price: 500_000 },
      { title: "هرم رزینی دکوراتیو", quantity: 1, price: 300_000 },
    ],
  },
];

export const adminProducts: AdminProduct[] = [
  {
    id: "p1",
    title: "ساعت دیواری رزین",
    price: 500_000,
    image: "/images/product-1.jpg",
    stock: 24,
    active: true,
    sold: 86,
  },
  {
    id: "p2",
    title: "هنر قالب سیلیکونی",
    price: 500_000,
    image: "/images/product-2.jpg",
    stock: 8,
    active: true,
    sold: 52,
  },
  {
    id: "p3",
    title: "زیورآلات رزینی",
    price: 500_000,
    image: "/images/product-3.jpg",
    stock: 3,
    active: true,
    sold: 41,
  },
  {
    id: "p4",
    title: "هرم رزینی دکوراتیو",
    price: 300_000,
    image: "/images/product-4.jpg",
    stock: 2,
    active: true,
    sold: 67,
  },
];

export const adminUsers: AdminUser[] = [
  {
    id: "u1",
    firstName: "سارا",
    lastName: "احمدی",
    phone: "09121234567",
    ordersCount: 5,
    totalSpent: 3_200_000,
    status: "active",
    joinedAt: "۱۴۰۴/۰۲/۱۰",
  },
  {
    id: "u2",
    firstName: "مریم",
    lastName: "کریمی",
    phone: "09129876543",
    ordersCount: 3,
    totalSpent: 1_500_000,
    status: "active",
    joinedAt: "۱۴۰۴/۰۳/۰۱",
  },
  {
    id: "u3",
    firstName: "نیلوفر",
    lastName: "رضایی",
    phone: "09351234567",
    ordersCount: 8,
    totalSpent: 4_800_000,
    status: "active",
    joinedAt: "۱۴۰۳/۱۱/۲۰",
  },
  {
    id: "u4",
    firstName: "زهرا",
    lastName: "موسوی",
    phone: "09121112233",
    ordersCount: 2,
    totalSpent: 1_300_000,
    status: "active",
    joinedAt: "۱۴۰۴/۰۴/۱۵",
  },
  {
    id: "u5",
    firstName: "فاطمه",
    lastName: "حسینی",
    phone: "09123334455",
    ordersCount: 1,
    totalSpent: 300_000,
    status: "blocked",
    joinedAt: "۱۴۰۴/۰۵/۰۱",
  },
];

export const defaultRoles: AdminRole[] = [
  {
    id: "role-super",
    name: "Super Admin",
    description: "دسترسی کامل به تمام بخش‌های پنل",
    permissions: [...allPermissions],
  },
  {
    id: "role-sales",
    name: "مدیر فروش",
    description: "مدیریت سفارش‌ها، فاکتورها و محصولات",
    permissions: ["dashboard", "orders", "invoices", "products", "discounts"],
  },
  {
    id: "role-support",
    name: "پشتیبانی",
    description: "مشاهده سفارش‌ها و کاربران برای پشتیبانی",
    permissions: ["dashboard", "orders", "users"],
  },
];

export const defaultDiscounts: AdminDiscount[] = [
  {
    id: "d1",
    code: "WELCOME10",
    type: "percent",
    value: 10,
    maxUses: 100,
    used: 42,
    expiresAt: "۱۴۰۴/۰۶/۳۰",
    active: true,
  },
  {
    id: "d2",
    code: "RESIN50K",
    type: "fixed",
    value: 50_000,
    maxUses: 50,
    used: 18,
    expiresAt: "۱۴۰۴/۰۵/۳۱",
    active: true,
  },
  {
    id: "d3",
    code: "SPRING20",
    type: "percent",
    value: 20,
    maxUses: 200,
    used: 200,
    expiresAt: "۱۴۰۴/۰۱/۱۵",
    active: false,
  },
];

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
