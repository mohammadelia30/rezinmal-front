import { NextRequest, NextResponse } from "next/server";
import { API_PATHS, getApiBaseUrl } from "@/lib/api/config";
import { setAuthCookies } from "@/lib/auth/tokens";
import {
  backendErrorMessage,
  type TokenResponse,
} from "@/lib/auth/backend";

export const dynamic = "force-dynamic";

/** ورود با شماره موبایل و رمز عبور؛ توکن‌ها فقط در کوکی httpOnly می‌نشینند. */
export async function POST(request: NextRequest) {
  let payload: { phone_number?: string; password?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ detail: "درخواست نامعتبر است." }, { status: 400 });
  }

  if (!payload.phone_number || !payload.password) {
    return NextResponse.json(
      { detail: "شماره موبایل و رمز عبور الزامی است." },
      { status: 400 },
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${getApiBaseUrl()}${API_PATHS.loginPassword}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        phone_number: payload.phone_number,
        password: payload.password,
      }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { detail: "ارتباط با سرور برقرار نشد." },
      { status: 502 },
    );
  }

  const data = (await upstream.json().catch(() => null)) as TokenResponse | null;

  if (!upstream.ok || !data?.tokens?.access) {
    return NextResponse.json(
      { detail: backendErrorMessage(data, "ورود ناموفق بود.") },
      { status: upstream.status === 200 ? 502 : upstream.status },
    );
  }

  await setAuthCookies(data.tokens);

  return NextResponse.json({ phone_number: data.phone_number ?? null });
}
