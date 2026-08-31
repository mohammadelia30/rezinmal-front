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
import type {
  AdminBrandRow,
  AdminCategoryRow,
  AdminProductDetail,
} from "@/lib/api/admin";
import {
  AdminActionError,
  createProduct,
  deleteProduct,
  deleteProductImage,
  setProductActive,
  updateProduct,
  updateVariantPrice,
  uploadProductImage,
  type ProductInput,
} from "@/lib/admin-store";
import { formatProductPrice } from "@/lib/price";

const EMPTY_FORM = {
  title: "",
  short_description: "",
  description: "",
  brand: "",
  categories: [] as string[],
  status: "",
  is_featured: false,
  is_active: true,
  price: "",
  sku: "",
};

type FormState = typeof EMPTY_FORM;

export function AdminProductsPage({
  products,
  categories,
  brands,
}: {
  products: AdminProductDetail[];
  categories: AdminCategoryRow[];
  brands: AdminBrandRow[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<AdminProductDetail | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
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
      price: String(product.price),
      sku: product.sku,
    });
    setEditing(product);
    setError("");
  };

  const closeForm = () => {
    setCreating(false);
    setEditing(null);
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
  });

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("عنوان محصول را وارد کنید.");
      return;
    }
    const price = Number(form.price);
    if (!price || price <= 0) {
      setError("قیمت معتبر وارد کنید.");
      return;
    }

    const done = await run(async () => {
      await createProduct(toInput(), {
        sku: form.sku.trim() || `SKU-${Date.now()}`,
        price,
      });
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

    const price = Number(form.price);
    const done = await run(async () => {
      await updateProduct(editing.id, toInput());
      if (editing.variantId && price > 0 && price !== editing.price) {
        await updateVariantPrice(editing.variantId, price);
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

  const handleUpload = async (file: File) => {
    if (!editing) return;
    await run(() =>
      uploadProductImage(editing.id, file, editing.images.length === 0),
    );
    closeForm();
  };

  const categoryOptions = categories.map((item) => ({
    value: item.id,
    label: item.title,
  }));

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
        <AdminField
          label="قیمت (تومان)"
          value={form.price}
          onChange={(value) => set("price", value.replace(/\D/g, ""))}
          dir="ltr"
          required={mode === "create"}
        />
        <AdminField
          label="کد کالا (SKU)"
          value={form.sku}
          onChange={(value) => set("sku", value)}
          dir="ltr"
          placeholder="خالی بماند، خودکار ساخته می‌شود"
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

      <div className="text-right">
        <span className="mb-1.5 block text-sm font-medium text-foreground">
          دسته‌بندی‌ها
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

      {mode === "edit" && editing ? (
        <div className="rounded-xl border border-[#efe6d4] p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <AdminButton
              variant="ghost"
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
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleUpload(file);
              event.target.value = "";
            }}
          />
          {editing.images.length === 0 ? (
            <p className="text-xs text-muted">تصویری ثبت نشده است.</p>
          ) : (
            <div className="flex flex-wrap justify-end gap-2">
              {editing.images.map((image) => (
                <div key={image.id} className="relative">
                  <div className="relative size-16 overflow-hidden rounded-lg bg-brand-mist">
                    <Image
                      src={image.url}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      run(async () => {
                        await deleteProductImage(image.id);
                        closeForm();
                      })
                    }
                    className="absolute -left-1 -top-1 rounded-full bg-white px-1.5 text-xs text-[#9b3d3d] shadow"
                    aria-label="حذف تصویر"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

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

      {!creating && !editing ? <AdminError message={error} /> : null}

      {products.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-muted shadow-[0_4px_20px_rgba(78,42,84,0.06)]">
          هنوز محصولی ثبت نشده است. با دکمهٔ «افزودن محصول» شروع کنید.
        </p>
      ) : (
        <AdminTable minWidth={720} headers={["محصول", "قیمت", "وضعیت", "عملیات"]}>
          {products.map((product) => (
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
