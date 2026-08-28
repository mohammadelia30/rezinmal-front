import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * نشست فعلی برای کامپوننت‌های کلاینت.
 * فقط اطلاعات نمایشی برمی‌گردد؛ توکن هرگز به مرورگر داده نمی‌شود.
 */
export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({
    user: {
      phoneNumber: user.phone_number,
      firstName: user.first_name ?? null,
      lastName: user.last_name ?? null,
      isStaff: Boolean(user.is_staff || user.is_superuser),
      isSuperuser: Boolean(user.is_superuser),
      isCompleted: Boolean(user.is_completed),
    },
  });
}
