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

function buildResponse(
  upstream: Response,
  body: ArrayBuffer,
): NextResponse<ArrayBuffer> {
  const headers = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!STRIPPED_RESPONSE_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });
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

  const responseBody = await upstream.arrayBuffer();
  return buildResponse(upstream, responseBody);
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const HEAD = proxy;
