"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AdminCard,
  AdminPageHeader,
} from "@/components/admin/AdminUI";
import type { SiteSettingsModel } from "@/lib/api/admin";
import { AdminActionError, saveSiteSettings } from "@/lib/admin-store";

/**
 * تنظیمات فروشگاه.
 *
 * روی رکورد singleton بک‌اند ذخیره می‌شود؛ قبلاً فقط در localStorage
 * همان مرورگر می‌ماند و برای هیچ‌کس دیگری اعمال نمی‌شد.
 */
export function AdminSettingsPage({
  initialSettings,
}: {
  initialSettings: SiteSettingsModel;
}) {
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettingsModel>(initialSettings);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const update = <K extends keyof SiteSettingsModel>(
    key: K,
    value: SiteSettingsModel[K],
  ) => {
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      await saveSiteSettings(settings);
      setSaved(true);
      router.refresh();
    } catch (saveError) {
      setError(
        saveError instanceof AdminActionError
          ? saveError.message
          : "ذخیرهٔ تنظیمات ناموفق بود.",
      );
    } finally {
      setSaving(false);
    }
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
              value={settings.shop_name}
              onChange={(value) => update("shop_name", value)}
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
              value={String(settings.shipping_cost)}
              onChange={(value) =>
                update("shipping_cost", Number(value.replace(/\D/g, "")) || 0)
              }
              dir="ltr"
              type="number"
            />
            <Field
              label="حداقل مبلغ ارسال رایگان"
              value={String(settings.free_shipping_min)}
              onChange={(value) =>
                update("free_shipping_min", Number(value.replace(/\D/g, "")) || 0)
              }
              dir="ltr"
              type="number"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle
              label="پرداخت آنلاین فعال"
              checked={settings.payment_enabled}
              onChange={(checked) => update("payment_enabled", checked)}
            />
            <Toggle
              label="حالت تعمیر و نگهداری"
              checked={settings.maintenance_mode}
              onChange={(checked) => update("maintenance_mode", checked)}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-brand px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-60"
            >
              {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
            </button>
            {saved ? (
              <span className="text-sm font-medium text-[#2f6b45]">
                ذخیره شد
              </span>
            ) : null}
            {error ? (
              <span className="text-sm text-[#9b3d3d]">{error}</span>
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
