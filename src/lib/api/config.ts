/**
 * پایهٔ آدرس API.
 *
 * مرورگر: آدرس نسبی (خالی) تا درخواست به همان دامنهٔ فرانت برود و
 * از طریق rewrite در next.config.ts به بک‌اند داخل شبکهٔ داکر پروکسی شود.
 * سرور (SSR): آدرس کانتینر بک‌اند روی شبکهٔ داکر.
 */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";
  }

  return (
    process.env.API_INTERNAL_URL?.replace(/\/$/, "") ||
    process.env.API_BASE_URL?.replace(/\/$/, "") ||
    "http://127.0.0.1:8080"
  );
}

export const API_PATHS = {
  products: "/api/catalog/products/",
  product: (id: string | number) => `/api/catalog/products/${id}/`,
  categories: "/api/catalog/categories/",
  category: (id: string | number) => `/api/catalog/categories/${id}/`,
  brands: "/api/catalog/brands/",
  brand: (id: string | number) => `/api/catalog/brands/${id}/`,
  variants: "/api/catalog/variants/",
  cart: "/api/cart/",
  cartItems: "/api/cart/items/",
  requestOtp: "/api/accounts/request-otp/",
  verifyOtp: "/api/accounts/verify-otp/",
  loginPassword: "/api/accounts/login/password/",
  refreshToken: "/api/accounts/token/refresh/",
  profile: "/api/accounts/profile/",
  completeProfile: "/api/accounts/profile/complete/",
  setPassword: "/api/accounts/set-password/",
  changePassword: "/api/accounts/change-password/",
  addresses: "/api/accounts/addresses/",
  passwordResetRequestOtp: "/api/accounts/password-reset/request-otp/",
  passwordResetVerifyOtp: "/api/accounts/password-reset/verify-otp/",
  passwordReset: "/api/accounts/password-reset/",
  orders: "/api/orders/orders/",
  order: (id: string | number) => `/api/orders/orders/${id}/`,
  orderCheckout: "/api/orders/orders/checkout/",
  orderChangeStatus: (id: string | number) =>
    `/api/orders/orders/${id}/change-status/`,
  coupons: "/api/discounts/coupons/",
  coupon: (id: string | number) => `/api/discounts/coupons/${id}/`,
  discounts: "/api/discounts/discounts/",
  discount: (id: string | number) => `/api/discounts/discounts/${id}/`,
  reportsOverview: "/api/reports/overview/",
  reportsOrders: "/api/reports/orders/",
  customerMe: "/api/customers/me/",
  notifications: "/api/notifications/",
  searchProducts: "/api/search/products/",
  adminUsers: "/api/accounts/users/",
  adminUser: (id: string | number) => `/api/accounts/users/${id}/`,
  adminRoles: "/api/accounts/roles/",
  adminRole: (id: string | number) => `/api/accounts/roles/${id}/`,
  panelPermissions: "/api/accounts/panel-permissions/",
  siteSettings: "/api/core/settings/",
  productImages: "/api/catalog/images/",
  productImage: (id: string | number) => `/api/catalog/images/${id}/`,
  variant: (id: string | number) => `/api/catalog/variants/${id}/`,
  orderConfirm: (id: string | number) => `/api/orders/orders/${id}/confirm/`,
  orderCancel: (id: string | number) => `/api/orders/orders/${id}/cancel/`,
  orderPreparing: (id: string | number) => `/api/orders/orders/${id}/preparing/`,
  orderReadyForPost: (id: string | number) =>
    `/api/orders/orders/${id}/ready-for-post/`,
  orderDeliveredToPost: (id: string | number) =>
    `/api/orders/orders/${id}/delivered-to-post/`,
  orderPrint: (id: string | number) => `/api/orders/orders/${id}/print/`,
} as const;
