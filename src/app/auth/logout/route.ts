import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth/tokens";

export const dynamic = "force-dynamic";

export async function POST() {
  await clearAuthCookies();
  return NextResponse.json({ ok: true });
}
