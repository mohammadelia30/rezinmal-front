"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
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
import { AdminSearch, useSearchFilter } from "@/components/admin/AdminSearch";
import {
  AdminPagination,
  usePagination,
} from "@/components/admin/AdminPagination";
import type { AdminArticleRow } from "@/lib/api/admin";
import {
  AdminActionError,
  checkImageFile,
  createArticle,
  deleteArticle,
  setArticlePublished,
  updateArticle,
  type ArticleInput,
} from "@/lib/admin-store";

const EMPTY = {
  title: "",
  summary: "",
  content: "",
  coverAlt: "",
  metaTitle: "",
  metaDescription: "",
  isPublished: false,
};

/**
 * مقالات بلاگ.
 *
 * پیش از این بلاگ سایت متن ثابت داخل کد بود؛ حالا فروشگاه خودش مقاله
 * می‌نویسد. پیش‌نویس روی سایت دیده نمی‌شود تا وقتی منتشر شود.
 */
export function AdminArticlesPage({
  articles,
}: {
  articles: AdminArticleRow[];
}) {
  const router = useRouter();
  const { query, setQuery, filtered } = useSearchFilter(articles, [
    "title", "summary",
  ]);
  const pager = usePagination(filtered);
  const [form, setForm] = useState(EMPTY);
  const [cover, setCover] = useState<File | null>(null);
  const [currentCover, setCurrentCover] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

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
    setCover(null);
    setCurrentCover("");
    setEditingId(null);
    setOpen(true);
    setError("");
  };

  const openEdit = (row: AdminArticleRow) => {
    setForm({
      title: row.title,
      summary: row.summary,
      content: row.content,
      coverAlt: row.coverAlt,
      metaTitle: row.metaTitle,
      metaDescription: row.metaDescription,
      isPublished: row.isPublished,
    });
    setCover(null);
    setCurrentCover(row.coverUrl);
    setEditingId(row.id);
    setOpen(true);
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("عنوان مقاله را وارد کنید.");
      return;
    }

    // تصویر بدون متن جایگزین، مثل تصویر محصول، پذیرفته نمی‌شود
    if ((cover || currentCover) && !form.coverAlt.trim()) {
      setError("متن جایگزین تصویر مقاله را بنویسید.");
      return;
    }

    const input: ArticleInput = {
      title: form.title.trim(),
      summary: form.summary.trim(),
      content: form.content,
      isPublished: form.isPublished,
      coverAlt: form.coverAlt.trim(),
      metaTitle: form.metaTitle.trim(),
      metaDescription: form.metaDescription.trim(),
      cover,
    };

    const done = await run(() =>
      editingId ? updateArticle(editingId, input) : createArticle(input),
    );
    if (done) setOpen(false);
  };

  const handleDelete = (row: AdminArticleRow) => {
    if (!window.confirm(`مقالهٔ «${row.title}» حذف شود؟`)) return;
    run(() => deleteArticle(row.id));
  };

  return (
    <div>
      <AdminPageHeader
        title="مقالات"
        description="نوشتن، ویرایش و انتشار مقالات بلاگ"
        action={<AdminButton onClick={openCreate}>افزودن مقاله</AdminButton>}
      />

      <AdminSearch
        value={query}
        onChange={setQuery}
        placeholder="جست‌وجو بر اساس عنوان یا خلاصه"
      />

      <AdminError message={error} />

      {filtered.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-muted shadow-[0_4px_20px_rgba(78,42,84,0.06)]">
          {articles.length
            ? "مقاله‌ای با این مشخصات پیدا نشد."
            : "هنوز مقاله‌ای ننوشته‌اید."}
        </p>
      ) : (
        <>
          <AdminTable
            minWidth={760}
            headers={["تصویر", "عنوان", "تاریخ انتشار", "وضعیت", "عملیات"]}
          >
            {pager.items.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[#efe6d4] text-right last:border-b-0"
              >
                <td className="w-20 px-4 py-3">
                  {row.coverUrl ? (
                    <div className="relative size-12 overflow-hidden rounded-lg bg-brand-mist">
                      <Image
                        src={row.coverUrl}
                        alt={row.coverAlt}
                        fill
                        sizes="48px"
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="font-bold text-foreground">{row.title}</span>
                  {row.summary ? (
                    <span className="mt-0.5 block max-w-md truncate text-xs text-muted">
                      {row.summary}
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-muted">
                  {row.isPublished ? row.publishedAt : "—"}
                </td>
                <td className="px-4 py-3">
                  <AdminBadge
                    className={
                      row.isPublished
                        ? "bg-[#e4f5ea] text-[#2f6b45]"
                        : "bg-[#fff3d6] text-[#8a6a1f]"
                    }
                  >
                    {row.isPublished ? "منتشر شده" : "پیش‌نویس"}
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
                      variant="ghost"
                      size="sm"
                      disabled={busy}
                      onClick={() =>
                        run(() => setArticlePublished(row.id, !row.isPublished))
                      }
                    >
                      {row.isPublished ? "بازگشت به پیش‌نویس" : "انتشار"}
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
          title={editingId ? "ویرایش مقاله" : "افزودن مقاله"}
          onClose={() => setOpen(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminError message={error} />

            <AdminField
              label="عنوان مقاله"
              value={form.title}
              onChange={(value) => set("title", value)}
              required
            />

            <AdminTextarea
              label="خلاصه"
              value={form.summary}
              onChange={(value) => set("summary", value.slice(0, 300))}
              rows={2}
            />

            <AdminTextarea
              label="متن مقاله"
              value={form.content}
              onChange={(value) => set("content", value)}
              rows={8}
            />

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
                  تصویر مقاله
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
                  setCover(file);
                }}
              />

              {cover ? (
                <p className="flex items-center justify-between gap-2 rounded-lg bg-[#fbf9f1] px-3 py-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setCover(null)}
                    className="text-[#9b3d3d]"
                    aria-label="حذف از فهرست"
                  >
                    ✕
                  </button>
                  <span className="truncate">{cover.name}</span>
                </p>
              ) : currentCover ? (
                <div className="flex items-center justify-end gap-3">
                  <span className="text-xs text-muted">تصویر فعلی</span>
                  <div className="relative size-16 overflow-hidden rounded-lg bg-brand-mist">
                    <Image
                      src={currentCover}
                      alt={form.coverAlt}
                      fill
                      sizes="64px"
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted">تصویری انتخاب نشده است.</p>
              )}

              {cover || currentCover ? (
                <div className="mt-3">
                  <AdminField
                    label="متن جایگزین تصویر (Alt)"
                    value={form.coverAlt}
                    onChange={(value) => set("coverAlt", value)}
                    placeholder="مثلاً: ریختن رزین روی قالب چوبی"
                    required
                  />
                </div>
              ) : null}
            </div>

            <div className="rounded-xl border border-[#efe6d4] p-3">
              <p className="mb-3 text-right text-sm font-medium text-foreground">
                نمایش در گوگل (سئو)
              </p>
              <div className="space-y-3">
                <AdminField
                  label="عنوان سئو"
                  value={form.metaTitle}
                  onChange={(value) => set("metaTitle", value.slice(0, 70))}
                  placeholder={form.title || "خالی بماند، از عنوان مقاله ساخته می‌شود"}
                />
                <AdminTextarea
                  label="توضیح سئو"
                  value={form.metaDescription}
                  onChange={(value) =>
                    set("metaDescription", value.slice(0, 160))
                  }
                  rows={2}
                />
              </div>
            </div>

            <AdminToggleField
              label="منتشر شود"
              checked={form.isPublished}
              onChange={(value) => set("isPublished", value)}
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
