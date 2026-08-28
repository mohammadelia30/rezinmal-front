"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { permissionLabels, type AdminPermission } from "@/data/admin";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminUI";
import { PANEL_PERMISSIONS, toPanelPermission } from "@/lib/admin-auth";
import type { AdminRoleRow } from "@/lib/api/admin";
import {
  AdminActionError,
  createRole,
  deleteRole,
  setRolePermissions,
} from "@/lib/admin-store";

/**
 * نقش‌ها و دسترسی‌ها.
 *
 * هر نقش یک Group جنگو است و هر دسترسی یک Permission واقعی؛ پس
 * محدودیت‌ها روی سرور هم اعمال می‌شوند، نه فقط در نمایش منو.
 */
export function AdminRolesPage({ roles }: { roles: AdminRoleRow[] }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(roles[0]?.id ?? "");
  const [newRoleName, setNewRoleName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const selected = roles.find((role) => role.id === selectedId) ?? roles[0] ?? null;

  const run = async (action: () => Promise<void>) => {
    setError("");
    setBusy(true);
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
      setBusy(false);
    }
  };

  const togglePermission = (codename: string) => {
    if (!selected) return;

    const has = selected.permissions.includes(codename);
    const next = has
      ? selected.permissions.filter((item) => item !== codename)
      : [...selected.permissions, codename];

    return run(() => setRolePermissions(selected.id, next));
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    const name = newRoleName.trim();
    if (!name) {
      setError("نام نقش را وارد کنید.");
      return;
    }
    await run(() => createRole(name));
    setNewRoleName("");
  };

  return (
    <div>
      <AdminPageHeader
        title="نقش‌ها و دسترسی‌ها"
        description="تعریف نقش‌های مدیریتی و سطح دسترسی هر نقش"
      />

      {error ? (
        <p className="mb-4 text-right text-sm text-red-500">{error}</p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <AdminCard className="lg:col-span-1">
          <h2 className="mb-3 text-right text-lg font-bold text-foreground">
            نقش‌ها
          </h2>

          {roles.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted">
              هنوز نقشی تعریف نشده است.
            </p>
          ) : (
            <ul className="space-y-2">
              {roles.map((role) => (
                <li key={role.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(role.id)}
                    className={`w-full rounded-xl border px-4 py-3 text-right transition ${
                      selected?.id === role.id
                        ? "border-brand bg-brand-mist"
                        : "border-[#efe6d4] hover:bg-[#fbf9f1]"
                    }`}
                  >
                    <p className="font-bold text-foreground">{role.name}</p>
                    <p className="mt-1 text-xs text-muted">
                      {role.usersCount.toLocaleString("fa-IR")} کاربر —{" "}
                      {role.permissions.length.toLocaleString("fa-IR")} دسترسی
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={handleCreate} className="mt-4 space-y-2">
            <input
              value={newRoleName}
              onChange={(event) => setNewRoleName(event.target.value)}
              placeholder="نام نقش جدید"
              className="w-full rounded-xl border border-[#e6dcc2] bg-[#fbf9f1] px-4 py-2.5 text-right text-sm outline-none focus:border-brand"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-60"
            >
              افزودن نقش
            </button>
          </form>
        </AdminCard>

        <AdminCard className="lg:col-span-2">
          {selected ? (
            <>
              <div className="mb-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => run(() => deleteRole(selected.id))}
                  className="rounded-lg border border-[#e6dcc2] px-3 py-1.5 text-xs font-medium text-[#8a3a3a] transition hover:bg-[#fff5f5] disabled:opacity-60"
                >
                  حذف نقش
                </button>
                <h2 className="text-lg font-bold text-foreground">
                  دسترسی‌های «{selected.name}»
                </h2>
              </div>

              <ul className="grid gap-2 sm:grid-cols-2">
                {PANEL_PERMISSIONS.map((codename) => {
                  const label =
                    permissionLabels[
                      toPanelPermission(codename) as AdminPermission
                    ] ?? codename;
                  const checked = selected.permissions.includes(codename);

                  return (
                    <li key={codename}>
                      <label className="flex cursor-pointer items-center justify-end gap-3 rounded-xl border border-[#efe6d4] px-4 py-3 transition hover:bg-[#fbf9f1]">
                        <span className="text-sm text-foreground">{label}</span>
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={busy}
                          onChange={() => togglePermission(codename)}
                          className="size-4 accent-[#4e2a54]"
                        />
                      </label>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <p className="py-10 text-center text-sm text-muted">
              برای مشاهدهٔ دسترسی‌ها یک نقش بسازید.
            </p>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
