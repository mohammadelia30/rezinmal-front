"use client";

import { useCallback, useEffect, useState } from "react";

export type AddressRow = {
  id: string;
  title: string;
  receiverName: string;
  phoneNumber: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  isDefault: boolean;
};

const EMPTY = {
  title: "",
  receiver_name: "",
  phone_number: "",
  province: "",
  city: "",
  address: "",
  postal_code: "",
  is_default: false,
};

/** عنوان‌های پیشنهادی تا کاربر مجبور نباشد از صفر بنویسد */
const TITLE_SUGGESTIONS = ["خانه", "محل کار", "دفتر", "منزل پدری"];

function Field({
  label,
  value,
  onChange,
  placeholder,
  dir,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <label className="block text-right">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>
      <input
        value={value}
        dir={dir}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full rounded-xl border border-[#e6dcc2] bg-[#fbf9f1] px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
      />
    </label>
  );
}

/**
 * آدرس‌های کاربر.
 *
 * روی اندپوینت آدرس بک‌اند سوار است که از قبل فیلد «عنوان» داشت؛
 * همان چیزی که برای تفکیک خانه و محل کار لازم است.
 */
export function DashboardAddresses() {
  const [rows, setRows] = useState<AddressRow[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/accounts/addresses", {
        credentials: "same-origin",
        cache: "no-store",
      });
      if (!response.ok) {
        setRows([]);
        return;
      }
      const data = (await response.json()) as Record<string, unknown>[];
      setRows(
        (Array.isArray(data) ? data : []).map((item) => ({
          id: String(item.id),
          title: String(item.title ?? ""),
          receiverName: String(item.receiver_name ?? ""),
          phoneNumber: String(item.phone_number ?? ""),
          province: String(item.province ?? ""),
          city: String(item.city ?? ""),
          address: String(item.address ?? ""),
          postalCode: String(item.postal_code ?? ""),
          isDefault: Boolean(item.is_default),
        })),
      );
    } catch {
      setError("دریافت آدرس‌ها ناموفق بود.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("عنوان آدرس را وارد کنید، مثلاً خانه یا محل کار.");
      return;
    }
    if (!form.address.trim()) {
      setError("نشانی را وارد کنید.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const response = await fetch(
        editingId
          ? `/api/accounts/addresses/${editingId}`
          : "/api/accounts/addresses",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify(form),
        },
      );

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as Record<
          string,
          unknown
        > | null;
        const first =
          data && typeof data === "object"
            ? Object.values(data).find(
                (value) => typeof value === "string" || Array.isArray(value),
              )
            : null;
        setError(
          Array.isArray(first)
            ? String(first[0])
            : typeof first === "string"
              ? first
              : "ذخیرهٔ آدرس ناموفق بود.",
        );
        return;
      }

      setOpen(false);
      setEditingId(null);
      setForm(EMPTY);
      await load();
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (row: AddressRow) => {
    if (!window.confirm(`آدرس «${row.title}» حذف شود؟`)) return;

    setBusy(true);
    try {
      await fetch(`/api/accounts/addresses/${row.id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      await load();
    } finally {
      setBusy(false);
    }
  };

  const openEdit = (row: AddressRow) => {
    setForm({
      title: row.title,
      receiver_name: row.receiverName,
      phone_number: row.phoneNumber,
      province: row.province,
      city: row.city,
      address: row.address,
      postal_code: row.postalCode,
      is_default: row.isDefault,
    });
    setEditingId(row.id);
    setOpen(true);
    setError("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-[0_4px_20px_rgba(78,42,84,0.06)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <button
          type="button"
          onClick={() => {
            setForm(EMPTY);
            setEditingId(null);
            setError("");
            setOpen(true);
          }}
          className="min-h-10 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-dark"
        >
          افزودن آدرس
        </button>
        <div className="text-right">
          <h2 className="text-lg font-bold text-foreground">آدرس‌های من</h2>
          <p className="mt-1 text-sm text-muted">
            آدرس‌های خود را با عنوان ذخیره کنید تا هنگام خرید سریع انتخاب شوند.
          </p>
        </div>
      </div>

      {error && !open ? (
        <p className="rounded-xl bg-[#fde8e8] px-4 py-2.5 text-right text-sm text-[#9b3d3d]">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-muted shadow-[0_4px_20px_rgba(78,42,84,0.06)]">
          در حال بارگذاری...
        </p>
      ) : rows.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-muted shadow-[0_4px_20px_rgba(78,42,84,0.06)]">
          هنوز آدرسی ثبت نکرده‌اید.
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className="rounded-2xl bg-white p-5 text-right shadow-[0_4px_20px_rgba(78,42,84,0.06)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => openEdit(row)}
                    className="min-h-9 rounded-lg border border-[#e6dcc2] px-3 py-1.5 text-xs font-medium transition hover:bg-[#f6f1e7] disabled:opacity-60"
                  >
                    ویرایش
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => remove(row)}
                    className="min-h-9 rounded-lg border border-[#e6dcc2] px-3 py-1.5 text-xs font-medium text-[#8a3a3a] transition hover:bg-[#fff5f5] disabled:opacity-60"
                  >
                    حذف
                  </button>
                </div>
                <div>
                  <div className="flex items-center justify-end gap-2">
                    {row.isDefault ? (
                      <span className="rounded-full bg-brand-mist px-2.5 py-1 text-[11px] font-bold text-brand">
                        پیش‌فرض
                      </span>
                    ) : null}
                    <p className="font-bold text-foreground">{row.title}</p>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    {[row.province, row.city, row.address]
                      .filter(Boolean)
                      .join("، ")}
                  </p>
                  {row.receiverName || row.phoneNumber ? (
                    <p className="mt-1 text-xs text-muted">
                      {row.receiverName}
                      {row.phoneNumber ? ` — ${row.phoneNumber}` : ""}
                    </p>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-3 sm:p-8">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white p-4 shadow-xl sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="بستن"
                className="flex size-9 items-center justify-center rounded-lg text-muted transition hover:bg-[#f6f1e7]"
              >
                ✕
              </button>
              <h2 className="text-lg font-bold text-foreground">
                {editingId ? "ویرایش آدرس" : "افزودن آدرس"}
              </h2>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {error ? (
                <p className="rounded-xl bg-[#fde8e8] px-4 py-2.5 text-right text-sm text-[#9b3d3d]">
                  {error}
                </p>
              ) : null}

              <div>
                <Field
                  label="عنوان آدرس"
                  value={form.title}
                  onChange={(value) => setForm({ ...form, title: value })}
                  placeholder="مثلاً خانه"
                />
                <div className="mt-2 flex flex-wrap justify-end gap-1.5">
                  {TITLE_SUGGESTIONS.map((title) => (
                    <button
                      key={title}
                      type="button"
                      onClick={() => setForm({ ...form, title })}
                      className="rounded-lg border border-[#e6dcc2] px-3 py-1 text-xs text-muted transition hover:bg-[#f6f1e7]"
                    >
                      {title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="نام تحویل‌گیرنده"
                  value={form.receiver_name}
                  onChange={(value) =>
                    setForm({ ...form, receiver_name: value })
                  }
                />
                <Field
                  label="شماره تماس"
                  value={form.phone_number}
                  onChange={(value) =>
                    setForm({ ...form, phone_number: value })
                  }
                  dir="ltr"
                />
                <Field
                  label="استان"
                  value={form.province}
                  onChange={(value) => setForm({ ...form, province: value })}
                />
                <Field
                  label="شهر"
                  value={form.city}
                  onChange={(value) => setForm({ ...form, city: value })}
                />
              </div>

              <label className="block text-right">
                <span className="mb-1.5 block text-sm font-medium text-foreground">
                  نشانی کامل
                </span>
                <textarea
                  value={form.address}
                  rows={3}
                  onChange={(event) =>
                    setForm({ ...form, address: event.target.value })
                  }
                  className="w-full rounded-xl border border-[#e6dcc2] bg-[#fbf9f1] px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
                />
              </label>

              <Field
                label="کد پستی"
                value={form.postal_code}
                onChange={(value) => setForm({ ...form, postal_code: value })}
                dir="ltr"
              />

              <label className="flex cursor-pointer items-center justify-end gap-3 rounded-xl border border-[#efe6d4] bg-[#fbf9f1] px-4 py-2.5">
                <input
                  type="checkbox"
                  checked={form.is_default}
                  onChange={(event) =>
                    setForm({ ...form, is_default: event.target.checked })
                  }
                  className="size-4 accent-[#4e2a54]"
                />
                <span className="text-sm font-medium text-foreground">
                  آدرس پیش‌فرض
                </span>
              </label>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={busy}
                  className="min-h-10 rounded-xl border border-[#e6dcc2] px-4 py-2.5 text-sm font-medium transition hover:bg-[#f6f1e7] disabled:opacity-60"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="min-h-10 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-dark disabled:opacity-60"
                >
                  {busy ? "در حال ذخیره..." : "ذخیره"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
