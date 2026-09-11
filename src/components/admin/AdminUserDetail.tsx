"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminError,
  AdminField,
  AdminModal,
  AdminPageHeader,
} from "@/components/admin/AdminUI";
import type { AdminRoleRow, AdminUserDetail } from "@/lib/api/admin";
import {
  AdminActionError,
  setUserActive,
  setUserPassword,
  setUserRoles,
  setUserStaff,
} from "@/lib/admin-store";
import { formatProductPrice } from "@/lib/price";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#efe6d4] py-2.5 last:border-b-0">
      <span className="text-sm font-medium text-foreground">{value}</span>
      <span className="text-sm text-muted">{label}</span>
    </div>
  );
}

/**
 * پروفایل کاربر از دید مدیر.
 *
 * تغییر رمز اینجا رمز فعلی را نمی‌پرسد، چون مدیر آن را نمی‌داند؛
 * بک‌اند دسترسی را بررسی می‌کند و اجازه نمی‌دهد مدیر معمولی رمز یک
 * مدیر کل را عوض کند.
 */
export function AdminUserDetailPage({
  user,
  roles,
}: {
  user: AdminUserDetail;
  roles: AdminRoleRow[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);

  const fullName = `${user.firstName} ${user.lastName}`.trim() || "—";

  const run = async (action: () => Promise<void>) => {
    setError("");
    setBusy(true);
    try {
      await action();
      router.refresh();
      return true;
    } catch (actionError) {
      setError(
        actionError instanceof AdminActionError
          ? actionError.message
          : "انجام عملیات ناموفق بود.",
      );
      return false;
    } finally {
      setBusy(false);
    }
  };

  const submitPassword = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password.length < 8) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد.");
      return;
    }
    if (password !== confirm) {
      setError("رمز عبور و تکرار آن یکسان نیستند.");
      return;
    }

    const ok = await run(() => setUserPassword(user.id, password, confirm));
    if (ok) {
      setOpen(false);
      setPassword("");
      setConfirm("");
      setDone(true);
      window.setTimeout(() => setDone(false), 4000);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title={fullName === "—" ? user.phone : fullName}
        description="پروفایل کاربر و تنظیمات دسترسی"
        action={
          <Link
            href="/admin/users"
            className="inline-flex min-h-10 items-center rounded-xl border border-[#e6dcc2] px-4 py-2.5 text-sm font-medium transition hover:bg-[#f6f1e7]"
          >
            بازگشت به فهرست
          </Link>
        }
      />

      {!open ? <AdminError message={error} /> : null}

      {done ? (
        <p className="mb-4 rounded-xl bg-[#e4f5ea] px-4 py-2.5 text-right text-sm text-[#2f6b45]">
          رمز عبور تغییر کرد. نشست‌های قبلی این کاربر باطل شدند.
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminCard>
          <h2 className="mb-3 text-right text-lg font-bold text-foreground">
            اطلاعات کاربر
          </h2>
          <Row label="نام" value={fullName} />
          <Row label="موبایل" value={user.phone} />
          <Row label="تاریخ تولد" value={user.birthDate} />
          <Row label="جنسیت" value={user.gender} />
          <Row label="عضویت از" value={user.joinedAt} />
          <Row label="آخرین ورود" value={user.lastLogin} />
        </AdminCard>

        <AdminCard>
          <h2 className="mb-3 text-right text-lg font-bold text-foreground">
            خرید و وضعیت
          </h2>
          <Row
            label="تعداد سفارش"
            value={user.ordersCount.toLocaleString("fa-IR")}
          />
          <Row label="مجموع خرید" value={formatProductPrice(user.totalSpent)} />
          <Row
            label="پروفایل تکمیل شده"
            value={user.isCompleted ? "بله" : "خیر"}
          />
          <Row
            label="رمز عبور"
            value={user.hasPassword ? "تعریف شده" : "تعریف نشده"}
          />

          <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
            <AdminBadge
              className={
                user.isActive
                  ? "bg-[#e4f5ea] text-[#2f6b45]"
                  : "bg-[#fde8e8] text-[#9b3d3d]"
              }
            >
              {user.isActive ? "فعال" : "مسدود"}
            </AdminBadge>
            {user.isStaff ? (
              <AdminBadge className="bg-brand-mist text-brand">مدیر</AdminBadge>
            ) : null}
          </div>
        </AdminCard>
      </div>

      <AdminCard className="mt-4">
        <h2 className="mb-3 text-right text-lg font-bold text-foreground">
          عملیات
        </h2>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <select
            value={user.roleIds[0] ?? ""}
            disabled={busy}
            onChange={(event) =>
              run(() =>
                setUserRoles(
                  user.id,
                  event.target.value ? [event.target.value] : [],
                ),
              )
            }
            className="min-h-10 rounded-xl border border-[#e6dcc2] bg-[#fbf9f1] px-3 py-2 text-sm outline-none focus:border-brand"
          >
            <option value="">بدون نقش</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>

          <AdminButton
            variant="ghost"
            disabled={busy}
            onClick={() => run(() => setUserActive(user.id, !user.isActive))}
          >
            {user.isActive ? "مسدود کردن" : "رفع مسدودی"}
          </AdminButton>

          <AdminButton
            variant="ghost"
            disabled={busy}
            onClick={() => run(() => setUserStaff(user.id, !user.isStaff))}
          >
            {user.isStaff ? "سلب دسترسی مدیر" : "دسترسی مدیر"}
          </AdminButton>

          <AdminButton
            disabled={busy}
            onClick={() => {
              setPassword("");
              setConfirm("");
              setError("");
              setOpen(true);
            }}
          >
            تغییر رمز عبور
          </AdminButton>
        </div>
      </AdminCard>

      {open ? (
        <AdminModal title="تغییر رمز عبور" onClose={() => setOpen(false)}>
          <form onSubmit={submitPassword} className="space-y-4">
            <AdminError message={error} />

            <p className="text-right text-sm text-muted">
              رمز جدید برای {fullName === "—" ? user.phone : fullName} تنظیم
              می‌شود و نشست‌های فعلی او بسته خواهند شد.
            </p>

            <AdminField
              label="رمز عبور جدید"
              value={password}
              onChange={setPassword}
              type="password"
              placeholder="حداقل ۸ کاراکتر"
            />
            <AdminField
              label="تکرار رمز عبور"
              value={confirm}
              onChange={setConfirm}
              type="password"
            />

            <div className="flex justify-end gap-2">
              <AdminButton
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={busy}
              >
                انصراف
              </AdminButton>
              <AdminButton type="submit" disabled={busy}>
                {busy ? "در حال ذخیره..." : "ذخیره"}
              </AdminButton>
            </div>
          </form>
        </AdminModal>
      ) : null}
    </div>
  );
}
