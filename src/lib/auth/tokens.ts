import { cookies, headers } from "next/headers";

/**
 * توکن‌ها فقط در کوکی httpOnly نگهداری می‌شوند تا جاوااسکریپت مرورگر
 * (و در نتیجه یک حملهٔ XSS) هرگز به آن‌ها دسترسی نداشته باشد.
 */
export const ACCESS_COOKIE = "rz_at";
export const REFRESH_COOKIE = "rz_rt";

// هم‌راستا با SIMPLE_JWT در بک‌اند: ۳۰ دقیقه و ۷ روز
const ACCESS_MAX_AGE = 30 * 60;
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60;

export type AuthTokenPair = {
  access: string;
  refresh?: string | null;
};

/**
 * روی HTTPS کوکی را Secure می‌کنیم. تشخیص از روی هدر پروکسی انجام می‌شود
 * چون خودِ کانتینر همیشه HTTP است.
 */
async function isSecureRequest(): Promise<boolean> {
  if (process.env.COOKIE_SECURE === "true") return true;
  if (process.env.COOKIE_SECURE === "false") return false;

  try {
    const headerList = await headers();
    const proto = headerList.get("x-forwarded-proto");
    if (proto) return proto.split(",")[0]?.trim() === "https";
  } catch {
    // خارج از چرخهٔ درخواست
  }
  return false;
}

export async function setAuthCookies(tokens: AuthTokenPair) {
  const cookieStore = await cookies();
  const secure = await isSecureRequest();
  const base = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
  };

  cookieStore.set(ACCESS_COOKIE, tokens.access, {
    ...base,
    maxAge: ACCESS_MAX_AGE,
  });

  if (tokens.refresh) {
    cookieStore.set(REFRESH_COOKIE, tokens.refresh, {
      ...base,
      maxAge: REFRESH_MAX_AGE,
    });
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
}

export async function readAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_COOKIE)?.value ?? null;
}

export async function readRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_COOKIE)?.value ?? null;
}
