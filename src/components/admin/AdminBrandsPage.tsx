"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AdminBadge,
  AdminButton,
  AdminError,
  AdminField,
  AdminModal,
  AdminPageHeader,
  AdminTable,
  AdminTextarea,
  AdminToggleField,
} from "@/components/admin/AdminUI";
import type { AdminBrandRow } from "@/lib/api/admin";
import {
  AdminActionError,
  createBrand,
  deleteBrand,
  updateBrand,
} from "@/lib/admin-store";

const EMPTY = { title: "", description: "", is_active: true };

export function AdminBrandsPage({ brands }: { brands: AdminBrandRow[] }) {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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

  const openCreate = () => {
    setForm(EMPTY);
    setEditingId(null);
    setOpen(true);
    setError("");
  };

  const openEdit = (row: AdminBrandRow) => {
    setForm({
      title: row.title,
      description: row.description,
      is_active: row.isActive,
    });
    setEditingId(row.id);
    setOpen(true);
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("نام برند را وارد کنید.");
      return;
    }

    const input = {
      title: form.title.trim(),
      description: form.description,
      is_active: form.is_active,
    };

    const done = await run(() =>
      editingId ? updateBrand(editingId, input) : createBrand(input),
    );
    if (done) setOpen(false);
  };

  const handleDelete = (row: AdminBrandRow) => {
    if (!window.confirm(`برند «${row.title}» حذف شود؟`)) return;
    run(() => deleteBrand(row.id));
  };

  return (
    <div>
      <AdminPageHeader
        title="برندها"
        description="برندهای محصولات فروشگاه"
        action={<AdminButton onClick={openCreate}>افزودن برند</AdminButton>}
      />

      {!open ? <AdminError message={error} /> : null}

      {brands.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-muted shadow-[0_4px_20px_rgba(78,42,84,0.06)]">
          هنوز برندی ثبت نشده است.
        </p>
      ) : (
        <AdminTable headers={["نام برند", "توضیحات", "وضعیت", "عملیات"]}>
          {brands.map((row) => (
            <tr
              key={row.id}
              className="border-b border-[#efe6d4] text-right last:border-b-0"
            >
              <td className="px-4 py-3 font-bold text-foreground">{row.title}</td>
              <td className="px-4 py-3 text-muted">{row.description || "—"}</td>
              <td className="px-4 py-3">
                <AdminBadge
                  className={
                    row.isActive
                      ? "bg-[#e4f5ea] text-[#2f6b45]"
                      : "bg-[#fde8e8] text-[#9b3d3d]"
                  }
                >
                  {row.isActive ? "فعال" : "غیرفعال"}
                </AdminBadge>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap justify-end gap-1.5">
                  <AdminButton
                    variant="ghost"
                    disabled={busy}
                    onClick={() => openEdit(row)}
                  >
                    ویرایش
                  </AdminButton>
                  <AdminButton
                    variant="danger"
                    disabled={busy}
                    onClick={() => handleDelete(row)}
                  >
                    حذف
                  </AdminButton>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      {open ? (
        <AdminModal
          title={editingId ? "ویرایش برند" : "افزودن برند"}
          onClose={() => setOpen(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminError message={error} />

            <AdminField
              label="نام برند"
              value={form.title}
              onChange={(value) => setForm({ ...form, title: value })}
              required
            />
            <AdminTextarea
              label="توضیحات"
              value={form.description}
              onChange={(value) => setForm({ ...form, description: value })}
            />
            <AdminToggleField
              label="فعال"
              checked={form.is_active}
              onChange={(value) => setForm({ ...form, is_active: value })}
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
