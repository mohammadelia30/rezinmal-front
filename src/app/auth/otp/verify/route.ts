import { NextRequest, NextResponse } from "next/server";
import { API_PATHS, getApiBaseUrl } from "@/lib/api/config";
import { setAuthCookies } from "@/lib/auth/tokens";
import { backendErrorMessage, type TokenResponse } from "@/lib/auth/backend";

export const dynamic = "force-dynamic";

/** تأیید کد یک‌بارمصرف؛ در صورت موفقیت نشست ساخته می‌شود. */
export async function POST(request: NextRequest) {
  let payload: { phone_number?: string; code?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ detail: "درخواست نامعتبر است." }, { status: 400 });
  }

  if (!payload.phone_number || !payload.code) {
    return NextResponse.json(
      { detail: "شماره موبایل و کد الزامی است." },
      { status: 400 },
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${getApiBaseUrl()}${API_PATHS.verifyOtp}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        phone_number: payload.phone_number,
        code: payload.code,
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
      { detail: backendErrorMessage(data, "کد تأیید نادرست است.") },
      { status: upstream.ok ? 502 : upstream.status },
    );
  }

  await setAuthCookies(data.tokens);

  return NextResponse.json({
    phone_number: data.phone_number ?? null,
    has_password: data.has_password ?? false,
  });
}
