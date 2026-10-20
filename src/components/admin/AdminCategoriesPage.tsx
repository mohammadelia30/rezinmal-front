"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useRef, useState } from "react";
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
import { AdminSearch, useSearchFilter } from "@/components/admin/AdminSearch";
import {
  AdminPagination,
  usePagination,
} from "@/components/admin/AdminPagination";
import type { AdminCategoryRow } from "@/lib/api/admin";
import {
  AdminActionError,
  checkImageFile,
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
  const { query, setQuery, filtered } = useSearchFilter(categories, [
    "title", "parentTitle",
  ]);
  const pager = usePagination(filtered);
  const [form, setForm] = useState(EMPTY);
  // تصویر انتخاب‌شده تا زدن «ذخیره»؛ خالی یعنی تصویر فعلی بماند
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
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
    setImage(null);
    setCurrentImage("");
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
    setImage(null);
    setCurrentImage(row.imageUrl);
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
      image,
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

      <AdminSearch
        value={query}
        onChange={setQuery}
        placeholder="جست‌وجو بر اساس عنوان دسته‌بندی"
      />

      {!open ? <AdminError message={error} /> : null}

      {filtered.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-muted shadow-[0_4px_20px_rgba(78,42,84,0.06)]">
          هنوز دسته‌بندی‌ای ثبت نشده است.
        </p>
      ) : (
        <>
          <AdminTable headers={["عنوان", "والد", "ترتیب", "وضعیت", "عملیات"]}>
            {pager.items.map((row) => (
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
          <AdminPagination pager={pager} />
        </>
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

            {/* تصویر دسته؛ همراه بقیهٔ فیلدها ذخیره می‌شود */}
            <div className="rounded-xl border border-[#efe6d4] p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <AdminButton
                  variant="ghost"
                  size="sm"
                  disabled={busy}
                  onClick={() => fileInput.current?.click()}
                >
                  انتخاب تصویر
                </AdminButton>
                <span className="text-sm font-medium text-foreground">
                  تصویر دسته‌بندی
                </span>
              </div>

              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  event.target.value = "";
                  if (!file) return;

                  const problem = checkImageFile(file);
                  if (problem) {
                    setError(problem);
                    return;
                  }

                  setError("");
                  setImage(file);
                }}
              />

              {image ? (
                <p className="flex items-center justify-between gap-2 rounded-lg bg-[#fbf9f1] px-3 py-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="text-[#9b3d3d]"
                    aria-label="حذف از فهرست"
                  >
                    ✕
                  </button>
                  <span className="truncate">{image.name}</span>
                </p>
              ) : currentImage ? (
                <div className="flex items-center justify-end gap-3">
                  <span className="text-xs text-muted">تصویر فعلی</span>
                  <div className="relative size-16 overflow-hidden rounded-lg bg-brand-mist">
                    <Image
                      src={currentImage}
                      alt=""
                      fill
                      sizes="64px"
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted">تصویری ثبت نشده است.</p>
              )}
            </div>

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
