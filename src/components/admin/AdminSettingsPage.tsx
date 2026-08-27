"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminSettings } from "@/data/admin";
import {
  AdminCard,
  AdminPageHeader,
} from "@/components/admin/AdminUI";
import { readSettings, writeSettings } from "@/lib/admin-store";

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [saved, setSaved] = useState(false);

  const refresh = useCallback(() => {
    setSettings(readSettings());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (!settings) return null;

  const update = <K extends keyof AdminSettings>(
    key: K,
    value: AdminSettings[K],
  ) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    writeSettings(settings);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <AdminPageHeader
        title="تنظیمات فروشگاه"
        description="اطلاعات عمومی، ارسال و وضعیت سیستم"
      />

      <AdminCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="نام فروشگاه"
              value={settings.shopName}
              onChange={(value) => update("shopName", value)}
            />
            <Field
              label="تلفن"
              value={settings.phone}
              onChange={(value) => update("phone", value)}
            />
            <Field
              label="ایمیل"
              value={settings.email}
              onChange={(value) => update("email", value)}
              dir="ltr"
            />
            <Field
              label="آدرس"
              value={settings.address}
              onChange={(value) => update("address", value)}
            />
            <Field
              label="هزینه ارسال (تومان)"
              value={String(settings.shippingCost)}
              onChange={(value) =>
                update("shippingCost", Number(value.replace(/\D/g, "")) || 0)
              }
              dir="ltr"
              type="number"
            />
            <Field
              label="حداقل مبلغ ارسال رایگان"
              value={String(settings.freeShippingMin)}
              onChange={(value) =>
                update("freeShippingMin", Number(value.replace(/\D/g, "")) || 0)
              }
              dir="ltr"
              type="number"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle
              label="پرداخت آنلاین فعال"
              checked={settings.paymentEnabled}
              onChange={(checked) => update("paymentEnabled", checked)}
            />
            <Toggle
              label="حالت تعمیر و نگهداری"
              checked={settings.maintenanceMode}
              onChange={(checked) => update("maintenanceMode", checked)}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-xl bg-brand px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark"
            >
              ذخیره تنظیمات
            </button>
            {saved ? (
              <span className="text-sm font-medium text-[#2f6b45]">
                ذخیره شد
              </span>
            ) : null}
          </div>
        </form>
      </AdminCard>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  dir,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  dir?: "ltr" | "rtl";
  type?: string;
}) {
  return (
    <div className="text-right">
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        type={type}
        value={value}
        dir={dir}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-[#e6dcc2] bg-[#fbf9f1] px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
      />
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#efe6d4] bg-[#fbf9f1] px-4 py-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 accent-[var(--brand)]"
      />
      <span className="text-sm font-medium text-foreground">{label}</span>
    </label>
  );
}
