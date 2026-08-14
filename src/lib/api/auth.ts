import { apiFetch } from "@/lib/api/client";
import { API_PATHS } from "@/lib/api/config";
import type {
  AuthTokens,
  Cart,
  CartItem,
  PasswordLogin,
  RequestOTP,
  VerifyOTP,
} from "@/lib/api/types";

export async function requestOtp(payload: RequestOTP) {
  return apiFetch<Record<string, unknown>>(API_PATHS.requestOtp, {
    method: "POST",
    body: payload,
    cache: "no-store",
  });
}

export async function verifyOtp(payload: VerifyOTP) {
  return apiFetch<AuthTokens>(API_PATHS.verifyOtp, {
    method: "POST",
    body: payload,
    cache: "no-store",
  });
}

export async function loginWithPassword(payload: PasswordLogin) {
  return apiFetch<AuthTokens>(API_PATHS.loginPassword, {
    method: "POST",
    body: payload,
    cache: "no-store",
  });
}

export async function refreshToken(refresh: string) {
  return apiFetch<AuthTokens>(API_PATHS.refreshToken, {
    method: "POST",
    body: { refresh },
    cache: "no-store",
  });
}

export async function getCart(token: string) {
  return apiFetch<Cart>(API_PATHS.cart, {
    token,
    cache: "no-store",
  });
}

export async function addCartItem(
  token: string,
  payload: { variant: number; quantity: number },
) {
  return apiFetch<CartItem>(API_PATHS.cartItems, {
    method: "POST",
    token,
    body: payload,
    cache: "no-store",
  });
}

export async function clearCart(token: string) {
  return apiFetch<void>(API_PATHS.cart, {
    method: "DELETE",
    token,
    cache: "no-store",
  });
}
