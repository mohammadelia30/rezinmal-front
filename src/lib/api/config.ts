export function getApiBaseUrl(): string {
  return (
    process.env.API_BASE_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
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
