import { NextRequest, NextResponse } from "next/server";
import { API_PATHS, getApiBaseUrl } from "@/lib/api/config";
import {
  clearAuthCookies,
  readAccessToken,
  readRefreshToken,
  setAuthCookies,
} from "@/lib/auth/tokens";

export const dynamic = "force-dynamic";

/**
 * پروکسی همهٔ درخواست‌های /api به بک‌اند.
 *
 * چرا از rewrite ساده استفاده نمی‌کنیم: توکن در کوکی httpOnly است و
 * جاوااسکریپت مرورگر نمی‌تواند هدر Authorization بسازد. اینجا سمت سرور
 * توکن به درخواست اضافه می‌شود و در صورت انقضا هم تمدید می‌گردد.
 */

// هدرهایی که نباید به بک‌اند برود
const STRIPPED_REQUEST_HEADERS = new Set([
  "cookie", // کوکی نشست ما به بک‌اند ربطی ندارد
  "host",
  "connection",
  "content-length",
  "accept-encoding",
  // هدرهای hop-by-hop: مال همین اتصال‌اند و ارسالشان به اتصال بعدی
  // درخواست را می‌شکند. «expect: 100-continue» را بعضی کلاینت‌ها هنگام
  // آپلود فایل می‌فرستند و آپلود با خطای «ارتباط برقرار نشد» رد می‌شد.
  "expect",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

// هدرهایی که نباید از بک‌اند به مرورگر برگردد
const STRIPPED_RESPONSE_HEADERS = new Set([
  "set-cookie",
  "transfer-encoding",
  "connection",
  "content-encoding",
  "content-length",
]);

function buildTargetUrl(request: NextRequest, segments: string[]): string {
  // Django به اسلش انتهایی نیاز دارد؛ بدون آن APPEND_SLASH ریدایرکت می‌کند.
  const path = segments.map(encodeURIComponent).join("/");
  const search = request.nextUrl.search;
  return `${getApiBaseUrl()}/api/${path}/${search}`;
}

function forwardRequestHeaders(request: NextRequest): Headers {
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!STRIPPED_REQUEST_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });
  return headers;
}

/** وضعیت‌هایی که طبق استاندارد Fetch نباید بدنه داشته باشند */
const BODYLESS_STATUSES = new Set([204, 205, 304]);

function buildResponse(
  upstream: Response,
  body: ArrayBuffer,
): NextResponse {
  const headers = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!STRIPPED_RESPONSE_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  // دادن بدنه به این وضعیت‌ها باعث خطای سازندهٔ Response می‌شود؛
  // نتیجه‌اش این بود که حذف روی بک‌اند انجام می‌شد ولی پنل خطا نشان می‌داد.
  if (BODYLESS_STATUSES.has(upstream.status)) {
    return new NextResponse(null, { status: upstream.status, headers });
  }

  return new NextResponse(body, { status: upstream.status, headers });
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = await readRefreshToken();
  if (!refresh) return null;

  try {
    const response = await fetch(
      `${getApiBaseUrl()}${API_PATHS.refreshToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ refresh }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      await clearAuthCookies();
      return null;
    }

    const data = (await response.json()) as {
      access?: string;
      refresh?: string;
    };
    if (!data.access) return null;

    await setAuthCookies({ access: data.access, refresh: data.refresh });
    return data.access;
  } catch {
    return null;
  }
}

/**
 * صفحهٔ «دوباره وارد شوید» برای لینک‌هایی که در تب جدید باز می‌شوند.
 *
 * دو چیز این مسیر را محدود می‌کند و هر دو را امتحان کرده‌ایم:
 * CDN جلوی سایت هر پاسخِ خطادار را با صفحهٔ انگلیسی خودش
 * («Upstream Error») عوض می‌کند، و ریدایرکت هم به درد نمی‌خورد چون
 * Next هدر Location را با آدرسی که کانتینر روی آن گوش می‌دهد
 * (0.0.0.0:3000) مطلق می‌کند و مرورگر مدیر به جایی می‌رود که وجود
 * ندارد. پس یک صفحهٔ ۲۰۰ برمی‌گردانیم که از CDN رد می‌شود.
 *
 * فقط برای رفت‌وآمد مرورگر است؛ درخواست‌های JSON همان ۴۰۱ واقعی را
 * می‌گیرند.
 */
function authNoticePage(status: number): NextResponse {
  const forbidden = status === 403;
  const title = forbidden
    ? "دسترسی لازم را ندارید"
    : "نشست شما تمام شده است";
  const detail = forbidden
    ? "این بخش به دسترسی دیگری نیاز دارد. با مدیر اصلی فروشگاه هماهنگ کنید."
    : "دوباره وارد پنل شوید و همین دکمه را بزنید.";
  const link = forbidden ? "/admin" : "/admin/login";
  const action = forbidden ? "بازگشت به پنل" : "ورود به پنل";

  const html = `<!doctype html>
<html lang="fa" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title}</title>
<style>
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
background:#fbf9f1;color:#3d2247;font-family:Vazirmatn,Tahoma,sans-serif;padding:24px}
.box{max-width:420px;text-align:center;background:#fff;border-radius:16px;padding:28px;
box-shadow:0 8px 30px rgba(61,36,71,.1)}
h1{font-size:18px;margin:0 0 10px}
p{font-size:14px;line-height:2;color:#6b5b73;margin:0 0 20px}
a{display:inline-block;background:#5b2a63;color:#fff;text-decoration:none;
border-radius:10px;padding:10px 22px;font-size:14px;font-weight:700}
</style></head><body><div class="box">
<h1>${title}</h1><p>${detail}</p><a href="${link}">${action}</a>
</div></body></html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  const { path } = await context.params;
  const target = buildTargetUrl(request, path ?? []);
  const headers = forwardRequestHeaders(request);

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  const send = async (token: string | null) => {
    const requestHeaders = new Headers(headers);
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    } else {
      requestHeaders.delete("Authorization");
    }

    return fetch(target, {
      method: request.method,
      headers: requestHeaders,
      body: body && body.byteLength ? body : undefined,
      redirect: "manual",
      cache: "no-store",
    });
  };

  let token = await readAccessToken();

  // کوکی دسترسی و خود توکن هر دو ۳۰ دقیقه‌اند، پس لحظه‌ای می‌رسد که
  // کوکی از مرورگر پاک شده ولی نشست هنوز زنده است. تا امروز درخواست
  // در این فاصله بی‌هیچ توکنی فرستاده می‌شد و ۴۰۱ می‌گرفت؛ حالا پیش
  // از فرستادن تمدید می‌شود.
  if (!token && (await readRefreshToken())) {
    token = await refreshAccessToken();
  }

  let upstream: Response;
  try {
    upstream = await send(token);
  } catch {
    return NextResponse.json(
      { detail: "ارتباط با سرور برقرار نشد." },
      { status: 502 },
    );
  }

  // توکن منقضی شده: یک بار تمدید و دوباره تلاش می‌کنیم
  if (upstream.status === 401 && (await readRefreshToken())) {
    token = await refreshAccessToken();
    if (token) {
      try {
        upstream = await send(token);
      } catch {
        return NextResponse.json(
          { detail: "ارتباط با سرور برقرار نشد." },
          { status: 502 },
        );
      }
    }
  }

  // چاپ فاکتور یک لینک معمولی است، نه fetch: اگر نشست تمام شده باشد
  // مرورگر صفحهٔ خطای انگلیسیِ خود DRF را نشان می‌داد و مدیر فقط
  // «۴۰۱» می‌دید. برای این حالت یک صفحهٔ فارسی برمی‌گردانیم.
  if (
    (upstream.status === 401 || upstream.status === 403) &&
    request.method === "GET" &&
    (request.headers.get("accept") ?? "").includes("text/html")
  ) {
    return authNoticePage(upstream.status);
  }

  // خواندن بدنه هم می‌تواند وسط کار قطع شود؛ بدون این، پنل یک ۵۰۰
  // بی‌توضیح می‌گرفت به‌جای همان پیام «ارتباط برقرار نشد»
  let responseBody: ArrayBuffer;
  try {
    responseBody = await upstream.arrayBuffer();
  } catch {
    return NextResponse.json(
      { detail: "ارتباط با سرور برقرار نشد." },
      { status: 502 },
    );
  }

  return buildResponse(upstream, responseBody);
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const HEAD = proxy;
