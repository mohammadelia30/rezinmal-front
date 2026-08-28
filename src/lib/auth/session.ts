import { API_PATHS, getApiBaseUrl } from "@/lib/api/config";
import { readAccessToken, readRefreshToken } from "@/lib/auth/tokens";

export type SessionUser = {
  phone_number: string;
  first_name?: string | null;
  last_name?: string | null;
  avatar?: string | null;
  is_completed?: boolean;
  is_staff: boolean;
  is_superuser: boolean;
};

/** آدرس بک‌اند برای فراخوانی سمت سرور (داخل شبکهٔ داکر) */
function backendUrl(path: string) {
  return `${getApiBaseUrl()}${path}`;
}

/**
 * توکن دسترسی برای رندر سمت سرور.
 *
 * در Server Component نمی‌توان کوکی ست کرد، پس اگر access منقضی شده باشد
 * فقط برای همین رندر یک توکن تازه می‌گیریم؛ ماندگار کردنش بر عهدهٔ
 * پروکسی /api است که در Route Handler اجرا می‌شود.
 */
export async function getRenderAccessToken(): Promise<string | null> {
  const access = await readAccessToken();
  if (access) return access;

  const refresh = await readRefreshToken();
  if (!refresh) return null;

  try {
    const response = await fetch(backendUrl(API_PATHS.refreshToken), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ refresh }),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { access?: string };
    return data.access ?? null;
  } catch {
    return null;
  }
}

/** کاربر فعلی از روی توکن؛ در صورت نبودِ نشست null برمی‌گرداند. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = await getRenderAccessToken();
  if (!token) return null;

  try {
    const response = await fetch(backendUrl(API_PATHS.profile), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as SessionUser;
  } catch {
    return null;
  }
}

export function isStaff(user: SessionUser | null): boolean {
  return Boolean(user?.is_staff || user?.is_superuser);
}

/** درخواست احراز شده به بک‌اند از سمت سرور (برای SSR صفحات محافظت‌شده) */
export async function serverApiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T | null> {
  const token = await getRenderAccessToken();
  if (!token) return null;

  try {
    const response = await fetch(backendUrl(path), {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (!response.ok) return null;
    if (response.status === 204) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}
