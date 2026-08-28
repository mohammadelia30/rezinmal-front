import { NextRequest, NextResponse } from "next/server";
import { API_PATHS, getApiBaseUrl } from "@/lib/api/config";
import { backendErrorMessage } from "@/lib/auth/backend";

export const dynamic = "force-dynamic";

/** درخواست کد یک‌بارمصرف از بک‌اند */
export async function POST(request: NextRequest) {
  let payload: { phone_number?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ detail: "درخواست نامعتبر است." }, { status: 400 });
  }

  if (!payload.phone_number) {
    return NextResponse.json(
      { detail: "شماره موبایل الزامی است." },
      { status: 400 },
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${getApiBaseUrl()}${API_PATHS.requestOtp}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ phone_number: payload.phone_number }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { detail: "ارتباط با سرور برقرار نشد." },
      { status: 502 },
    );
  }

  const data = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    return NextResponse.json(
      { detail: backendErrorMessage(data, "ارسال کد ناموفق بود.") },
      { status: upstream.status },
    );
  }

  return NextResponse.json({ ok: true });
}
