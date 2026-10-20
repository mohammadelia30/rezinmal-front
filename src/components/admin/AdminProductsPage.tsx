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
import {
  AdminProductVariants,
  emptyVariantRow,
  toVariantInputs,
  toVariantRows,
  variantRowsError,
  type VariantRow,
} from "@/components/admin/AdminProductVariants";
import type {
  AdminAttribute,
  AdminBrandRow,
  AdminCategoryRow,
  AdminProductDetail,
} from "@/lib/api/admin";
import {
  AdminActionError,
  PRODUCT_STATUS,
  checkImageFile,
  createProduct,
  deleteProduct,
  deleteProductImage,
  saveProductVariants,
  setProductActive,
  updateProduct,
  uploadProductImage,
  type ProductInput,
} from "@/lib/admin-store";
import { formatProductPrice } from "@/lib/price";

// قیمت، موجودی و کد کالا روی نسخه‌اند نه روی محصول، پس در فرم هم
// همان‌جا گرفته می‌شوند
const EMPTY_FORM = {
  title: "",
  short_description: "",
  description: "",
  brand: "",
  categories: [] as string[],
  status: "2",
  is_featured: false,
  is_active: true,
  meta_title: "",
  meta_description: "",
};

type FormState = typeof EMPTY_FORM;

/** تصویر انتخاب‌شده تا زدن «ذخیره»، همراه متن جایگزینش */
type PendingImage = { file: File; alt: string };

export function AdminProductsPage({
  products,
  categories,
  brands,
  attributes,
}: {
  products: AdminProductDetail[];
  categories: AdminCategoryRow[];
  brands: AdminBrandRow[];
  attributes: AdminAttribute[];
}) {
  const router = useRouter();
  const { query, setQuery, filtered } = useSearchFilter(products, [
    "title", "sku",
  ]);
  const pager = usePagination(filtered);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<AdminProductDetail | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  // نسخه‌های محصول؛ هر رنگ یا سایز با قیمت و موجودی خودش
  const [variantRows, setVariantRows] = useState<VariantRow[]>([]);
  // تصویرهای انتخاب‌شده تا زدن «ذخیره» همین‌جا می‌مانند: هنگام ساخت
  // محصول هنوز شناسه‌ای وجود ندارد، و هنگام ویرایش هم آپلود فوری یعنی
  // فرم بسته شود و بقیهٔ تغییرهای همان فرم از دست برود.
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  // تصویرهای موجود که مدیر حذفشان کرده ولی هنوز ذخیره نزده است
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

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
    setForm(EMPTY_FORM);
    setVariantRows([emptyVariantRow(true)]);
    setPendingImages([]);
    setRemovedImageIds([]);
    setCreating(true);
    setError("");
  };

  const openEdit = (product: AdminProductDetail) => {
    setForm({
      title: product.title,
      short_description: product.shortDescription,
      description: product.description,
      brand: product.brandId,
      categories: product.categoryIds,
      status: product.status,
      is_featured: product.isFeatured,
      is_active: product.isActive,
      meta_title: product.metaTitle,
      meta_description: product.metaDescription,
    });
    setVariantRows(toVariantRows(product.variants));
    setEditing(product);
    setPendingImages([]);
    setRemovedImageIds([]);
    setError("");
  };

  const closeForm = () => {
    setCreating(false);
    setEditing(null);
    setVariantRows([]);
    setPendingImages([]);
    setRemovedImageIds([]);
    setError("");
  };

  const toInput = (): ProductInput => ({
    title: form.title.trim(),
    short_description: form.short_description,
    description: form.description,
    brand: form.brand,
    categories: form.categories,
    status: form.status,
    is_featured: form.is_featured,
    is_active: form.is_active,
    meta_title: form.meta_title.trim(),
    meta_description: form.meta_description.trim(),
  });

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("عنوان محصول را وارد کنید.");
      return;
    }
    const variantProblem = variantRowsError(variantRows);
    if (variantProblem) {
      setError(variantProblem);
      return;
    }
    if (form.categories.length === 0) {
      setError("حداقل یک دسته‌بندی انتخاب کنید.");
      return;
    }

    const missingAlt = pendingImages.find((image) => !image.alt.trim());
    if (missingAlt) {
      setError(
        `برای «${missingAlt.file.name}» متن جایگزین تصویر را بنویسید.`,
      );
      return;
    }

    const done = await run(async () => {
      const productId = await createProduct(
        toInput(),
        toVariantInputs(variantRows),
        attributes,
      );

      for (const [index, image] of pendingImages.entries()) {
        await uploadProductImage(
          String(productId),
          image.file,
          index === 0,
          image.alt,
        );
      }
    });
    if (done) closeForm();
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing) return;

    if (!form.title.trim()) {
      setError("عنوان محصول را وارد کنید.");
      return;
    }
    const variantProblem = variantRowsError(variantRows);
    if (variantProblem) {
      setError(variantProblem);
      return;
    }
    if (form.categories.length === 0) {
      setError("حداقل یک دسته‌بندی انتخاب کنید.");
      return;
    }

    const missing = pendingImages.find((image) => !image.alt.trim());
    if (missing) {
      setError(`برای «${missing.file.name}» متن جایگزین تصویر را بنویسید.`);
      return;
    }

    // نسخه‌هایی که مدیر از فرم برداشته، از محصول هم حذف می‌شوند
    const removedVariantIds = editing.variants
      .filter((variant) => !variantRows.some((row) => row.id === variant.id))
      .map((variant) => variant.id);

    const done = await run(async () => {
      await updateProduct(editing.id, toInput());
      await saveProductVariants(
        editing.id,
        toVariantInputs(variantRows),
        removedVariantIds,
        attributes,
      );

      for (const imageId of removedImageIds) {
        await deleteProductImage(imageId);
      }

      // اگر همهٔ تصویرهای قبلی حذف شده‌اند، اولین تصویر تازه باید
      // تصویر اصلی محصول شود
      const remaining = editing.images.filter(
        (image) => !removedImageIds.includes(image.id),
      ).length;

      for (const [index, image] of pendingImages.entries()) {
        await uploadProductImage(
          editing.id,
          image.file,
          remaining === 0 && index === 0,
          image.alt,
        );
      }
    });
    if (done) closeForm();
  };

  const handleDelete = (product: AdminProductDetail) => {
    if (
      !window.confirm(
        `محصول «${product.title}» حذف شود؟ این کار برگشت‌پذیر نیست.`,
      )
    ) {
      return;
    }
    run(() => deleteProduct(product.id));
  };

  const categoryOptions = categories.map((item) => ({
    value: item.id,
    label: item.title,
  }));

  // تصویر اصلی وقتی از بین تصویرهای تازه انتخاب می‌شود که محصول
  // تصویر باقی‌مانده‌ای نداشته باشد
  const firstIsPrimary =
    !editing ||
    editing.images.filter((image) => !removedImageIds.includes(image.id))
      .length === 0;

  const formBody = (mode: "create" | "edit") => (
    <form
      onSubmit={mode === "create" ? handleCreate : handleUpdate}
      className="space-y-4"
    >
      <AdminError message={error} />

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminField
          label="عنوان محصول"
          value={form.title}
          onChange={(value) => set("title", value)}
          required
        />
        <AdminSelect
          label="وضعیت انتشار"
          value={form.status}
          onChange={(value) => set("status", value)}
          options={PRODUCT_STATUS}
        />
        <AdminSelect
          label="برند"
          value={form.brand}
          onChange={(value) => set("brand", value)}
          placeholder="بدون برند"
          options={brands.map((item) => ({
            value: item.id,
            label: item.title,
          }))}
        />
      </div>

      <AdminProductVariants
        rows={variantRows}
        attributes={attributes}
        disabled={busy}
        onChange={setVariantRows}
      />

      <AdminTextarea
        label="توضیح کوتاه"
        value={form.short_description}
        onChange={(value) => set("short_description", value)}
        rows={2}
      />
      <AdminTextarea
        label="توضیحات"
        value={form.description}
        onChange={(value) => set("description", value)}
      />

      {/* سئو: همان چیزی که در نتیجهٔ گوگل و پیش‌نمایش لینک دیده می‌شود */}
      <div className="rounded-xl border border-[#efe6d4] p-3">
        <p className="mb-3 text-right text-sm font-medium text-foreground">
          نمایش در گوگل (سئو)
        </p>

        <div className="space-y-3">
          <div>
            <AdminField
              label="عنوان سئو"
              value={form.meta_title}
              onChange={(value) => set("meta_title", value.slice(0, 70))}
              placeholder={form.title || "خالی بماند، از عنوان محصول ساخته می‌شود"}
            />
            <p className="mt-1 text-right text-xs text-muted">
              {form.meta_title.length.toLocaleString("fa-IR")} از ۷۰ کاراکتر
            </p>
          </div>

          <div>
            <AdminTextarea
              label="توضیح سئو"
              value={form.meta_description}
              onChange={(value) => set("meta_description", value.slice(0, 160))}
              rows={2}
            />
            <p className="mt-1 text-right text-xs text-muted">
              {form.meta_description.length.toLocaleString("fa-IR")} از ۱۶۰
              کاراکتر — خالی بماند، از توضیح کوتاه محصول استفاده می‌شود.
            </p>
          </div>
        </div>
      </div>

      <div className="text-right">
        <span className="mb-1.5 block text-sm font-medium text-foreground">
          دسته‌بندی‌ها <span className="text-red-500">*</span>
        </span>
        {categoryOptions.length === 0 ? (
          <p className="text-xs text-muted">
            هنوز دسته‌بندی‌ای تعریف نشده است.
          </p>
        ) : (
          <div className="flex flex-wrap justify-end gap-2">
            {categoryOptions.map((option) => {
              const checked = form.categories.includes(option.value);
              return (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-xl border px-3 py-1.5 text-xs transition ${
                    checked
                      ? "border-brand bg-brand-mist text-brand"
                      : "border-[#e6dcc2] hover:bg-[#fbf9f1]"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={checked}
                    onChange={() =>
                      set(
                        "categories",
                        checked
                          ? form.categories.filter((id) => id !== option.value)
                          : [...form.categories, option.value],
                      )
                    }
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <AdminToggleField
          label="نمایش در صفحهٔ اصلی"
          checked={form.is_featured}
          onChange={(value) => set("is_featured", value)}
        />
        <AdminToggleField
          label="فعال"
          checked={form.is_active}
          onChange={(value) => set("is_active", value)}
        />
      </div>

      <div className="rounded-xl border border-[#efe6d4] p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <AdminButton
            variant="ghost"
            size="sm"
            disabled={busy}
            onClick={() => fileInput.current?.click()}
          >
            افزودن تصویر
          </AdminButton>
          <span className="text-sm font-medium text-foreground">تصاویر</span>
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            event.target.value = "";
            if (!files.length) return;

            // همین‌جا بررسی می‌شود تا مدیر بعد از انتظار آپلود با خطا
            // روبه‌رو نشود
            const problem = files.map(checkImageFile).find(Boolean);
            if (problem) {
              setError(problem);
              return;
            }

            setError("");
            setPendingImages((current) => [
              ...current,
              ...files.map((file) => ({ file, alt: "" })),
            ]);
          }}
        />

        {editing ? (
          editing.images.length === 0 ? (
            <p className="mb-2 text-xs text-muted">تصویری ثبت نشده است.</p>
          ) : (
            <div className="mb-2 flex flex-wrap justify-end gap-2">
              {editing.images.map((image) => {
                const removed = removedImageIds.includes(image.id);

                return (
                  <div key={image.id} className="relative">
                    <div
                      className={`relative size-16 overflow-hidden rounded-lg bg-brand-mist transition ${
                        removed ? "opacity-35" : ""
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    {/* حذف تا زدن «ذخیره» اعمال نمی‌شود، پس برگشت‌پذیر است */}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        setRemovedImageIds((current) =>
                          removed
                            ? current.filter((id) => id !== image.id)
                            : [...current, image.id],
                        )
                      }
                      className="absolute -left-1 -top-1 rounded-full bg-white px-1.5 text-xs shadow"
                      aria-label={removed ? "برگرداندن تصویر" : "حذف تصویر"}
                      title={removed ? "برگرداندن تصویر" : "حذف تصویر"}
                    >
                      {removed ? "↺" : "✕"}
                    </button>
                  </div>
                );
              })}
            </div>
          )
        ) : null}

        {pendingImages.length > 0 ? (
          <ul className="space-y-1 text-right">
            {pendingImages.map((image, index) => (
              <li
                key={`${image.file.name}-${index}`}
                className="rounded-lg bg-[#fbf9f1] px-3 py-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPendingImages((current) =>
                        current.filter((_, position) => position !== index),
                      )
                    }
                    className="text-[#9b3d3d]"
                    aria-label="حذف از فهرست"
                  >
                    ✕
                  </button>
                  <span className="truncate">
                    {image.file.name}
                    {index === 0 && firstIsPrimary ? " (تصویر اصلی)" : ""}
                  </span>
                </div>

                {/* alt برای خواننده‌های صفحه و گوگل؛ بدون آن ذخیره انجام
                    نمی‌شود، پس عنوان واقعی دارد نه فقط متن داخل کادر */}
                <label className="mt-2 block text-right">
                  <span className="mb-1 block text-xs font-medium text-foreground">
                    متن جایگزین تصویر (Alt)
                    <span className="text-red-500"> *</span>
                  </span>
                  <input
                    value={image.alt}
                    onChange={(event) =>
                      setPendingImages((current) =>
                        current.map((item, position) =>
                          position === index
                            ? { ...item, alt: event.target.value }
                            : item,
                        ),
                      )
                    }
                    placeholder="مثلاً: قالب سیلیکونی ماه تولد، نمای جلو"
                    className="min-h-9 w-full rounded-lg border border-[#e6dcc2] bg-white px-2.5 py-1.5 text-right text-xs outline-none transition focus:border-brand"
                  />
                  <span className="mt-1 block text-[11px] leading-5 text-muted">
                    خودِ تصویر را توصیف کنید، نه فهرست کلمات کلیدی.
                  </span>
                </label>
              </li>
            ))}
          </ul>
        ) : null}

        <p className="mt-2 text-xs text-muted">
          {pendingImages.length > 0 || removedImageIds.length > 0
            ? "تغییر تصویرها با زدن «ذخیره» اعمال می‌شود."
            : "تصویر انتخاب کنید؛ همراه بقیهٔ تغییرها ذخیره می‌شود."}
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <AdminButton variant="ghost" onClick={closeForm} disabled={busy}>
          انصراف
        </AdminButton>
        <AdminButton type="submit" disabled={busy}>
          {busy ? "در حال ذخیره..." : "ذخیره"}
        </AdminButton>
      </div>
    </form>
  );

  return (
    <div>
      <AdminPageHeader
        title="محصولات"
        description="افزودن، ویرایش و مدیریت وضعیت محصولات"
        action={<AdminButton onClick={openCreate}>افزودن محصول</AdminButton>}
      />

      <AdminSearch
        value={query}
        onChange={setQuery}
        placeholder="جست‌وجو بر اساس نام محصول یا کد کالا"
      />

      {!creating && !editing ? <AdminError message={error} /> : null}

      {filtered.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-muted shadow-[0_4px_20px_rgba(78,42,84,0.06)]">
          هنوز محصولی ثبت نشده است. با دکمهٔ «افزودن محصول» شروع کنید.
        </p>
      ) : (
        <>
          <AdminTable minWidth={720} headers={["محصول", "قیمت", "وضعیت", "عملیات"]}>
            {pager.items.map((product) => (
              <tr
                key={product.id}
                className="border-b border-[#efe6d4] text-right last:border-b-0"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <p className="font-bold text-foreground">{product.title}</p>
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-brand-mist">
                      <Image
                        src={
                          product.images.find((image) => image.isPrimary)?.url ??
                          product.images[0]?.url ??
                          "/images/product-1.jpg"
                        }
                        alt={product.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-bold text-brand">
                  {formatProductPrice(product.price)}
                  {/* محصول چند نسخه‌ای یک قیمت ندارد؛ بازهٔ قیمت را نشان
                      می‌دهیم تا فهرست گمراه‌کننده نباشد */}
                  {product.variants.length > 1 ? (
                    <span className="mt-1 block text-xs font-normal text-muted">
                      {product.variants.length.toLocaleString("fa-IR")} نسخه، تا{" "}
                      {formatProductPrice(
                        Math.max(...product.variants.map((item) => item.price)),
                      )}
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <AdminBadge
                    className={
                      product.isActive
                        ? "bg-[#e4f5ea] text-[#2f6b45]"
                        : "bg-[#fde8e8] text-[#9b3d3d]"
                    }
                  >
                    {product.isActive ? "فعال" : "غیرفعال"}
                  </AdminBadge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-end gap-1.5">
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      disabled={busy}
                      onClick={() => openEdit(product)}
                    >
                      ویرایش
                    </AdminButton>
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      disabled={busy}
                      onClick={() =>
                        run(() => setProductActive(product.id, !product.isActive))
                      }
                    >
                      {product.isActive ? "غیرفعال" : "فعال"}
                    </AdminButton>
                    <AdminButton
                      variant="danger"
                      size="sm"
                      disabled={busy}
                      onClick={() => handleDelete(product)}
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

      {creating ? (
        <AdminModal title="افزودن محصول" onClose={closeForm}>
          {formBody("create")}
        </AdminModal>
      ) : null}

      {editing ? (
        <AdminModal title={`ویرایش: ${editing.title}`} onClose={closeForm}>
          {formBody("edit")}
        </AdminModal>
      ) : null}
    </div>
  );
}
