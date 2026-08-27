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
} as const;
