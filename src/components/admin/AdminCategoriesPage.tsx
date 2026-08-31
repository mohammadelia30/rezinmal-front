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
  AdminSelect,
  AdminTable,
  AdminTextarea,
  AdminToggleField,
} from "@/components/admin/AdminUI";
import type { AdminCategoryRow } from "@/lib/api/admin";
import {
  AdminActionError,
  createCategory,
  deleteCategory,
  updateCategory,
  type CategoryInput,
} from "@/lib/admin-store";

const EMPTY = {
  title: "",
  description: "",
  parent: "",
  sort_order: "0",
  is_active: true,
};

export function AdminCategoriesPage({
  categories,
}: {
  categories: AdminCategoryRow[];
}) {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof typeof EMPTY>(
    key: K,
    value: (typeof EMPTY)[K],
  ) => setForm((current) => ({ ...current, [key]: value }));

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

  const openEdit = (row: AdminCategoryRow) => {
    setForm({
      title: row.title,
      description: row.description,
      parent: row.parentId,
      sort_order: String(row.sortOrder),
      is_active: row.isActive,
    });
    setEditingId(row.id);
    setOpen(true);
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("عنوان دسته‌بندی را وارد کنید.");
      return;
    }

    const input: CategoryInput = {
      title: form.title.trim(),
      description: form.description,
      parent: form.parent,
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
    };

    const done = await run(() =>
      editingId ? updateCategory(editingId, input) : createCategory(input),
    );
    if (done) setOpen(false);
  };

  const handleDelete = (row: AdminCategoryRow) => {
    if (!window.confirm(`دسته‌بندی «${row.title}» حذف شود؟`)) return;
    run(() => deleteCategory(row.id));
  };

  return (
    <div>
      <AdminPageHeader
        title="دسته‌بندی‌ها"
        description="ساختار دسته‌بندی محصولات فروشگاه"
        action={<AdminButton onClick={openCreate}>افزودن دسته‌بندی</AdminButton>}
      />

      {!open ? <AdminError message={error} /> : null}

      {categories.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-muted shadow-[0_4px_20px_rgba(78,42,84,0.06)]">
          هنوز دسته‌بندی‌ای ثبت نشده است.
        </p>
      ) : (
        <AdminTable headers={["عنوان", "والد", "ترتیب", "وضعیت", "عملیات"]}>
          {categories.map((row) => (
            <tr
              key={row.id}
              className="border-b border-[#efe6d4] text-right last:border-b-0"
            >
              <td className="px-4 py-3 font-bold text-foreground">{row.title}</td>
              <td className="px-4 py-3 text-muted">{row.parentTitle}</td>
              <td className="px-4 py-3">
                {row.sortOrder.toLocaleString("fa-IR")}
              </td>
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
                    size="sm"
                    disabled={busy}
                    onClick={() => openEdit(row)}
                  >
                    ویرایش
                  </AdminButton>
                  <AdminButton
                    variant="danger"
                    size="sm"
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
          title={editingId ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی"}
          onClose={() => setOpen(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminError message={error} />

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField
                label="عنوان"
                value={form.title}
                onChange={(value) => set("title", value)}
                required
              />
              <AdminField
                label="ترتیب نمایش"
                value={form.sort_order}
                onChange={(value) => set("sort_order", value.replace(/\D/g, ""))}
                dir="ltr"
              />
            </div>

            <AdminSelect
              label="دستهٔ والد"
              value={form.parent}
              onChange={(value) => set("parent", value)}
              placeholder="بدون والد (سطح اول)"
              options={categories
                .filter((item) => item.id !== editingId)
                .map((item) => ({ value: item.id, label: item.title }))}
            />

            <AdminTextarea
              label="توضیحات"
              value={form.description}
              onChange={(value) => set("description", value)}
            />

            <AdminToggleField
              label="فعال"
              checked={form.is_active}
              onChange={(value) => set("is_active", value)}
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
