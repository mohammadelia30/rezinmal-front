"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AdminBadge,
  AdminButton,
  AdminError,
  AdminPageHeader,
  AdminTable,
} from "@/components/admin/AdminUI";
import type { AdminRoleRow, AdminUserRow } from "@/lib/api/admin";
import {
  AdminActionError,
  setUserActive,
  setUserRoles,
  setUserStaff,
} from "@/lib/admin-store";
import { formatProductPrice } from "@/lib/price";

/**
 * مدیریت کاربران.
 *
 * هر تغییر مستقیماً به بک‌اند می‌رود؛ سرور هم اجازهٔ لازم را بررسی
 * می‌کند و مانع می‌شود کاربر دسترسی مدیریتی خودش را بردارد.
 */
export function AdminUsersPage({
  users,
  roles,
}: {
  users: AdminUserRow[];
  roles: AdminRoleRow[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const run = async (id: string, action: () => Promise<void>) => {
    setError("");
    setBusyId(id);
    try {
      await action();
      router.refresh();
    } catch (actionError) {
      setError(
        actionError instanceof AdminActionError
          ? actionError.message
          : "انجام عملیات ناموفق بود.",
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="کاربران"
        description="لیست مشتریان ثبت‌نام‌شده و سطح دسترسی آن‌ها"
      />

      <AdminError message={error} />

      {users.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-muted shadow-[0_4px_20px_rgba(78,42,84,0.06)]">
          هنوز کاربری ثبت‌نام نکرده است.
        </p>
      ) : (
        <AdminTable
          minWidth={900}
          headers={[
            "نام",
            "موبایل",
            "سفارش",
            "مجموع خرید",
            "نقش",
            "وضعیت",
            "عملیات",
          ]}
        >
          {users.map((user) => {
            const fullName =
              `${user.firstName} ${user.lastName}`.trim() || "—";
            const busy = busyId === user.id;

            return (
              <tr
                key={user.id}
                className="border-b border-[#efe6d4] text-right last:border-b-0"
              >
                <td className="px-4 py-3 font-bold text-foreground">
                  {fullName}
                </td>
                <td className="px-4 py-3" dir="ltr">
                  {user.phone}
                </td>
                <td className="px-4 py-3">
                  {user.ordersCount.toLocaleString("fa-IR")}
                </td>
                <td className="px-4 py-3 font-bold text-brand">
                  {formatProductPrice(user.totalSpent)}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={user.roleIds[0] ?? ""}
                    disabled={busy}
                    onChange={(event) =>
                      run(user.id, () =>
                        setUserRoles(
                          user.id,
                          event.target.value ? [event.target.value] : [],
                        ),
                      )
                    }
                    className="rounded-lg border border-[#e6dcc2] bg-[#fbf9f1] px-2 py-1.5 text-xs outline-none focus:border-brand"
                  >
                    <option value="">بدون نقش</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center justify-end gap-1.5">
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
                      <AdminBadge className="bg-brand-mist text-brand">
                        مدیر
                      </AdminBadge>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-end gap-1.5">
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      disabled={busy}
                      onClick={() =>
                        run(user.id, () =>
                          setUserActive(user.id, !user.isActive),
                        )
                      }
                    >
                      {user.isActive ? "مسدود کردن" : "رفع مسدودی"}
                    </AdminButton>
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      disabled={busy}
                      onClick={() =>
                        run(user.id, () =>
                          setUserStaff(user.id, !user.isStaff),
                        )
                      }
                    >
                      {user.isStaff ? "سلب دسترسی مدیر" : "دسترسی مدیر"}
                    </AdminButton>
                  </div>
                </td>
              </tr>
            );
          })}
        </AdminTable>
      )}
    </div>
  );
}
