"use client";

import { useCallback, useEffect, useState } from "react";
import {
  allPermissions,
  permissionLabels,
  type AdminPermission,
  type AdminRole,
} from "@/data/admin";
import {
  AdminCard,
  AdminPageHeader,
} from "@/components/admin/AdminUI";
import { adminDemoAccounts } from "@/lib/admin-auth";
import { readRoles, writeRoles } from "@/lib/admin-store";

export function AdminRolesPage() {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [saved, setSaved] = useState(false);

  const refresh = useCallback(() => {
    const next = readRoles();
    setRoles(next);
    setSelectedId((current) => current || next[0]?.id || "");
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const selected = roles.find((role) => role.id === selectedId) ?? null;

  const togglePermission = (permission: AdminPermission) => {
    if (!selected) return;

    const has = selected.permissions.includes(permission);
    const nextPermissions = has
      ? selected.permissions.filter((item) => item !== permission)
      : [...selected.permissions, permission];

    const nextRoles = roles.map((role) =>
      role.id === selected.id
        ? { ...role, permissions: nextPermissions }
        : role,
    );

    writeRoles(nextRoles);
    setRoles(nextRoles);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div>
      <AdminPageHeader
        title="نقش‌ها و دسترسی‌ها"
        description="تعریف نقش‌های مدیریتی و سطح دسترسی هر نقش"
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {adminDemoAccounts.map((account) => (
          <AdminCard key={account.username} className="p-4">
            <p className="text-right font-bold text-foreground">
              {account.displayName}
            </p>
            <p className="mt-1 text-right text-xs leading-6 text-muted">
              {account.description}
            </p>
            <p className="mt-2 text-right text-[11px] text-brand" dir="ltr">
              {account.username} / {account.password}
            </p>
          </AdminCard>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
        <AdminCard className="h-fit p-3">
          <ul className="space-y-1">
            {roles.map((role) => (
              <li key={role.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(role.id)}
                  className={`w-full rounded-xl px-4 py-3 text-right text-sm font-medium transition ${
                    selectedId === role.id
                      ? "bg-brand text-white"
                      : "text-[#4a3a50] hover:bg-brand-mist"
                  }`}
                >
                  {role.name}
                </button>
              </li>
            ))}
          </ul>
        </AdminCard>

        {selected ? (
          <AdminCard>
            <div className="mb-5 text-right">
              <h2 className="text-lg font-bold text-foreground">
                {selected.name}
              </h2>
              <p className="mt-1 text-sm text-muted">{selected.description}</p>
              {saved ? (
                <p className="mt-2 text-xs font-medium text-[#2f6b45]">
                  تغییرات ذخیره شد
                </p>
              ) : null}
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {allPermissions.map((permission) => {
                const checked = selected.permissions.includes(permission);
                return (
                  <label
                    key={permission}
                    className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#efe6d4] bg-[#fbf9f1] px-4 py-3"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePermission(permission)}
                      className="size-4 accent-[var(--brand)]"
                    />
                    <span className="text-sm font-medium text-foreground">
                      {permissionLabels[permission]}
                    </span>
                  </label>
                );
              })}
            </div>
          </AdminCard>
        ) : null}
      </div>
    </div>
  );
}
