export { apiFetch, ApiError } from "@/lib/api/client";
export { getApiBaseUrl, API_PATHS } from "@/lib/api/config";
export type * from "@/lib/api/types";
export {
  listProducts,
  getProduct,
  listCategories,
  getCategory,
  listBrands,
  getStoreProducts,
  getStoreCatalog,
  getStoreProduct,
  getStoreCategories,
} from "@/lib/api/catalog";
export {
  requestOtp,
  verifyOtp,
  loginWithPassword,
  refreshToken,
  getCart,
  addCartItem,
  clearCart,
} from "@/lib/api/auth";
export {
  mapProductDetailToCard,
  getBrandTitle,
  getPrimaryImage,
  getDefaultVariant,
} from "@/lib/api/mappers";
