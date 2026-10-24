"use client";

import { AdminButton } from "@/components/admin/AdminUI";
import type { AdminAttribute, AdminProductVariant } from "@/lib/api/admin";
import type { VariantInput } from "@/lib/admin-store";
import { toEnglishDigits } from "@/lib/digits";

/**
 * نسخه‌های یک محصول در فرم پنل.
 *
 * قیمت و موجودی در بک‌اند روی نسخه ثبت می‌شود، پس «رنگ آبی ۱۲۰ هزار و
 * رنگ قرمز ۱۵۰ هزار» یعنی دو نسخه با ویژگی‌های متفاوت. ویژگی‌ها
 * آزادند: مدیر خودش «رنگ»، «سایز» یا هر چیز دیگری را می‌نویسد و
 * نام‌هایی که قبلاً ثبت شده پیشنهاد می‌شود.
 */

/** یک ویژگی روی سطر فرم؛ رنگ فقط برای ویژگی‌های رنگ پر می‌شود */
export type VariantAttributeRow = {
  name: string;
  value: string;
  colorHex: string;
};

/** رنگِ پیش‌فرض کادر انتخاب رنگ، تا مدیر از صفر شروع نکند */
const FIRST_COLOR = "#c0392b";

/**
 * آیا این ویژگی رنگ است؟
 *
 * کد رنگ روی مقدار ویژگی ذخیره می‌شود و فقط برای رنگ معنا دارد؛ کنار
 * «سایز: بزرگ» کادر انتخاب رنگ گیج‌کننده است.
 */
export const isColorAttribute = (name: string) =>
  /رنگ|colour|color/i.test(name.trim());

/** سطر فرم؛ همهٔ عددها متن‌اند تا تایپ‌کردن طبیعی باشد */
export type VariantRow = {
  /** کلید ثابت برای React؛ نسخهٔ تازه هنوز شناسهٔ سرور ندارد */
  key: string;
  id: string;
  inventoryId: string;
  attributes: VariantAttributeRow[];
  price: string;
  stock: string;
  minimumStock: string;
  sku: string;
  barcode: string;
  weight: string;
  isDefault: boolean;
  isActive: boolean;
};

let rowCount = 0;

const nextKey = () => {
  rowCount += 1;
  return `variant-${rowCount}`;
};

const toDigits = (value: string) =>
  toEnglishDigits(value).replace(/[^\d]/g, "");

export function emptyVariantRow(isDefault: boolean): VariantRow {
  return {
    key: nextKey(),
    id: "",
    inventoryId: "",
    attributes: [],
    price: "",
    stock: "",
    minimumStock: "",
    sku: "",
    barcode: "",
    weight: "",
    isDefault,
    isActive: true,
  };
}

/** نسخهٔ تازه‌ای که از اول ویژگی «رنگ» دارد */
export function colorVariantRow(isDefault: boolean): VariantRow {
  return {
    ...emptyVariantRow(isDefault),
    attributes: [{ name: "رنگ", value: "", colorHex: FIRST_COLOR }],
  };
}

export function toVariantRows(
  variants: AdminProductVariant[],
): VariantRow[] {
  if (variants.length === 0) return [emptyVariantRow(true)];

  return variants.map((variant, index) => ({
    key: nextKey(),
    id: variant.id,
    inventoryId: variant.inventoryId,
    attributes: variant.attributes.map((item) => ({ ...item })),
    price: String(variant.price),
    stock: String(variant.stock),
    minimumStock: String(variant.minimumStock),
    sku: variant.sku,
    barcode: variant.barcode,
    weight: variant.weight == null ? "" : String(variant.weight),
    // محصول‌های قدیمی ممکن است هیچ نسخهٔ پیش‌فرضی نداشته باشند
    isDefault: variant.isDefault || (index === 0 && !variants.some((v) => v.isDefault)),
    isActive: variant.isActive,
  }));
}

const filledAttributes = (row: VariantRow) =>
  row.attributes.filter((item) => item.name.trim() && item.value.trim());

/** رنگ نمایشی سطر، برای نقطهٔ کنار عنوان نسخه */
const rowColor = (row: VariantRow) =>
  row.attributes.find((item) => item.colorHex.trim())?.colorHex ?? "";

const attributeSignature = (row: VariantRow) =>
  filledAttributes(row)
    .map((item) => `${item.name.trim()}:${item.value.trim()}`)
    .sort()
    .join("، ");

/** پیام خطای فرم؛ خالی یعنی مشکلی نیست */
export function variantRowsError(rows: VariantRow[]): string {
  if (rows.length === 0) {
    return "حداقل یک نسخه لازم است؛ قیمت محصول روی نسخه ثبت می‌شود.";
  }

  for (const row of rows) {
    const price = Number(row.price);
    if (!price || price <= 0) {
      return "برای هر نسخه یک قیمت معتبر وارد کنید.";
    }

    const halfFilled = row.attributes.find(
      (item) => Boolean(item.name.trim()) !== Boolean(item.value.trim()),
    );
    if (halfFilled) {
      return "نام ویژگی و مقدارش را کامل کنید، مثلاً «رنگ» و «آبی».";
    }
  }

  if (rows.length > 1) {
    // بدون ویژگی، مشتری دو نسخه را از هم تشخیص نمی‌دهد
    if (rows.some((row) => filledAttributes(row).length === 0)) {
      return "وقتی محصول چند نسخه دارد، هر نسخه باید ویژگی داشته باشد، مثلاً «رنگ: آبی».";
    }

    const signatures = rows.map(attributeSignature);
    const duplicate = signatures.find(
      (item, index) => signatures.indexOf(item) !== index,
    );
    if (duplicate) {
      return `دو نسخه ویژگی‌های یکسان دارند: ${duplicate}`;
    }
  }

  const codes = rows
    .map((row) => row.sku.trim())
    .filter(Boolean);
  const duplicateCode = codes.find(
    (item, index) => codes.indexOf(item) !== index,
  );
  if (duplicateCode) {
    return `کد کالای «${duplicateCode}» برای دو نسخه تکرار شده است.`;
  }

  return "";
}

export function toVariantInputs(rows: VariantRow[]): VariantInput[] {
  return rows.map((row) => ({
    id: row.id,
    inventoryId: row.inventoryId,
    attributes: filledAttributes(row),
    sku: row.sku,
    price: Number(row.price) || 0,
    barcode: row.barcode,
    weight: row.weight ? Number(row.weight) : null,
    stock: Number(row.stock) || 0,
    minimumStock: Number(row.minimumStock) || 0,
    isDefault: row.isDefault,
    isActive: row.isActive,
  }));
}

const INPUT_CLASS =
  "min-h-9 w-full rounded-lg border border-[#e6dcc2] bg-white px-2.5 py-1.5 text-right text-xs outline-none transition focus:border-brand";

function Cell({
  label,
  value,
  onChange,
  placeholder,
  dir,
  list,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dir?: "ltr" | "rtl";
  list?: string;
}) {
  return (
    <label className="block text-right">
      <span className="mb-1 block text-[11px] font-medium text-muted">
        {label}
      </span>
      <input
        value={value}
        dir={dir}
        list={list}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={INPUT_CLASS}
      />
    </label>
  );
}

/**
 * کادر انتخاب رنگ یک مقدار ویژگی.
 *
 * رنگ اختیاری است: تا مدیر «انتخاب رنگ» را نزند هیچ کدی ثبت نمی‌شود و
 * همان نام رنگ به مشتری نشان داده می‌شود.
 */
function ColorCell({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-right">
      <span className="mb-1 block text-[11px] font-medium text-muted">
        رنگ نمایشی
      </span>
      {value ? (
        <span className="flex min-h-9 items-center justify-end gap-2 rounded-lg border border-[#e6dcc2] bg-white px-2.5 py-1">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange("")}
            className="text-xs text-[#9b3d3d]"
            aria-label="حذف رنگ"
            title="حذف رنگ"
          >
            ✕
          </button>
          <span dir="ltr" className="flex-1 text-left text-xs text-muted">
            {value.toUpperCase()}
          </span>
          <input
            type="color"
            value={value}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
            className="size-6 shrink-0 cursor-pointer rounded border border-[#e6dcc2] bg-white"
          />
        </span>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(FIRST_COLOR)}
          className="min-h-9 w-full rounded-lg border border-dashed border-[#e6dcc2] bg-white px-2.5 py-1.5 text-xs text-muted transition hover:border-brand hover:text-brand"
        >
          انتخاب رنگ
        </button>
      )}
    </label>
  );
}

export function AdminProductVariants({
  rows,
  attributes,
  disabled,
  onChange,
}: {
  rows: VariantRow[];
  attributes: AdminAttribute[];
  disabled: boolean;
  onChange: (rows: VariantRow[]) => void;
}) {
  const update = (index: number, change: Partial<VariantRow>) =>
    onChange(
      rows.map((row, position) =>
        position === index ? { ...row, ...change } : row,
      ),
    );

  const remove = (index: number) => {
    const remaining = rows.filter((_, position) => position !== index);
    // اگر نسخهٔ پیش‌فرض حذف شد، اولی جایش را می‌گیرد
    if (remaining.length > 0 && !remaining.some((row) => row.isDefault)) {
      remaining[0] = { ...remaining[0], isDefault: true };
    }
    onChange(remaining);
  };

  const setDefault = (index: number) =>
    onChange(
      rows.map((row, position) => ({
        ...row,
        isDefault: position === index,
      })),
    );

  const valuesOf = (name: string) =>
    attributes.find((item) => item.title.trim() === name.trim())?.values ?? [];

  const knownColor = (name: string, value: string) =>
    valuesOf(name).find(
      (item) => item.value.trim() === value.trim(),
    )?.colorHex ?? "";

  return (
    <div className="rounded-xl border border-[#efe6d4] p-3">
      <div className="mb-1 flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1">
          {/* راه کوتاه برای کار همیشگی: یک محصول با چند رنگ. ویژگی
              «رنگ» از قبل پر است و فقط نام رنگ و موجودی می‌ماند. */}
          <AdminButton
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() =>
              onChange([...rows, colorVariantRow(rows.length === 0)])
            }
          >
            افزودن رنگ
          </AdminButton>
          <AdminButton
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() =>
              onChange([...rows, emptyVariantRow(rows.length === 0)])
            }
          >
            افزودن نسخه
          </AdminButton>
        </div>
        <span className="text-sm font-medium text-foreground">
          نسخه‌ها و ویژگی‌ها
        </span>
      </div>
      <p className="mb-3 text-right text-xs text-muted">
        هر رنگ یا سایز یک نسخه است و قیمت و موجودی خودش را دارد. برای
        محصول چندرنگ، «افزودن رنگ» را بزنید و برای هر رنگ موجودی‌اش را
        بنویسید؛ همان رنگ‌ها در صفحهٔ محصول به‌شکل پالت انتخاب می‌شوند.
        اگر محصول فقط یک حالت دارد، همین یک نسخه کافی است.
      </p>

      {/* موجودی صفر یعنی بک‌اند خرید را رد می‌کند؛ بدون این هشدار،
          محصول عادی به نظر می‌رسید و مشتری تازه سر پرداخت خطا می‌گرفت */}
      {rows.length > 0 && rows.every((row) => !Number(row.stock)) ? (
        <p className="mb-3 rounded-xl bg-[#fdf3e3] px-3 py-2 text-right text-xs leading-6 text-[#8a5a17]">
          موجودی همهٔ نسخه‌ها صفر است؛ این محصول در سایت «ناموجود» نشان داده
          می‌شود و مشتری نمی‌تواند آن را بخرد. برای فروش، «موجودی انبار» هر
          نسخه را پر کنید.
        </p>
      ) : null}

      <datalist id="variant-attribute-names">
        {attributes.map((attribute) => (
          <option key={attribute.id} value={attribute.title} />
        ))}
      </datalist>

      <div className="space-y-3">
        {rows.map((row, index) => (
          <div
            key={row.key}
            className={`rounded-xl border p-3 transition ${
              row.isDefault
                ? "border-brand bg-brand-mist/40"
                : "border-[#e6dcc2] bg-[#fbf9f1]"
            }`}
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {rows.length > 1 ? (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => remove(index)}
                    className="rounded-lg px-2 py-1 text-xs text-[#9b3d3d] transition hover:bg-[#fde8e8]"
                  >
                    حذف نسخه
                  </button>
                ) : null}
                <label className="flex items-center gap-1.5 text-xs text-foreground">
                  <input
                    type="checkbox"
                    checked={row.isActive}
                    disabled={disabled}
                    onChange={(event) =>
                      update(index, { isActive: event.target.checked })
                    }
                  />
                  فعال
                </label>
                <label className="flex items-center gap-1.5 text-xs text-foreground">
                  <input
                    type="radio"
                    name="default-variant"
                    checked={row.isDefault}
                    disabled={disabled}
                    onChange={() => setDefault(index)}
                  />
                  نمایش پیش‌فرض
                </label>
              </div>
              <span className="flex items-center gap-2 text-xs font-bold text-foreground">
                {!Number(row.stock) ? (
                  <span className="rounded-full bg-[#efe9dd] px-2 py-0.5 text-[11px] font-medium text-muted">
                    ناموجود
                  </span>
                ) : null}
                {attributeSignature(row) ||
                  `نسخهٔ ${(index + 1).toLocaleString("fa-IR")}`}
                {rowColor(row) ? (
                  <span
                    aria-hidden
                    className="size-4 shrink-0 rounded-full border border-[#d9cfbb]"
                    style={{ backgroundColor: rowColor(row) }}
                  />
                ) : null}
              </span>
            </div>

            <div className="mb-2 space-y-2">
              {row.attributes.map((pair, pairIndex) => (
                <div
                  key={pairIndex}
                  className="flex items-end gap-2"
                >
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() =>
                      update(index, {
                        attributes: row.attributes.filter(
                          (_, position) => position !== pairIndex,
                        ),
                      })
                    }
                    className="mb-1 shrink-0 text-xs text-[#9b3d3d]"
                    aria-label="حذف ویژگی"
                    title="حذف ویژگی"
                  >
                    ✕
                  </button>
                  <div
                    className={`grid flex-1 gap-2 ${
                      isColorAttribute(pair.name)
                        ? "sm:grid-cols-3"
                        : "sm:grid-cols-2"
                    }`}
                  >
                    <Cell
                      label="ویژگی"
                      value={pair.name}
                      list="variant-attribute-names"
                      placeholder="مثلاً رنگ"
                      onChange={(value) =>
                        update(index, {
                          attributes: row.attributes.map((item, position) =>
                            position === pairIndex
                              ? { ...item, name: value }
                              : item,
                          ),
                        })
                      }
                    />
                    <Cell
                      label="مقدار"
                      value={pair.value}
                      list={`variant-values-${row.key}-${pairIndex}`}
                      placeholder="مثلاً آبی"
                      onChange={(value) =>
                        update(index, {
                          attributes: row.attributes.map((item, position) =>
                            position === pairIndex
                              ? {
                                  ...item,
                                  value,
                                  // رنگی که قبلاً برای همین مقدار ثبت
                                  // شده خودش می‌آید؛ وگرنه مدیر باید
                                  // «آبی» را هر بار دوباره رنگ کند
                                  colorHex:
                                    knownColor(pair.name, value) ||
                                    item.colorHex,
                                }
                              : item,
                          ),
                        })
                      }
                    />
                    {isColorAttribute(pair.name) ? (
                      <ColorCell
                        value={pair.colorHex}
                        disabled={disabled}
                        onChange={(value) =>
                          update(index, {
                            attributes: row.attributes.map((item, position) =>
                              position === pairIndex
                                ? { ...item, colorHex: value }
                                : item,
                            ),
                          })
                        }
                      />
                    ) : null}
                    <datalist id={`variant-values-${row.key}-${pairIndex}`}>
                      {valuesOf(pair.name).map((item) => (
                        <option key={item.id} value={item.value} />
                      ))}
                    </datalist>
                  </div>
                </div>
              ))}

              <AdminButton
                variant="ghost"
                size="sm"
                disabled={disabled}
                onClick={() =>
                  update(index, {
                    attributes: [
                      ...row.attributes,
                      { name: "", value: "", colorHex: "" },
                    ],
                  })
                }
              >
                افزودن ویژگی
              </AdminButton>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <Cell
                label="قیمت (تومان)"
                value={row.price}
                dir="ltr"
                onChange={(value) => update(index, { price: toDigits(value) })}
              />
              <Cell
                label="موجودی انبار"
                value={row.stock}
                dir="ltr"
                placeholder="۰"
                onChange={(value) => update(index, { stock: toDigits(value) })}
              />
              <Cell
                label="هشدار کمبود موجودی"
                value={row.minimumStock}
                dir="ltr"
                placeholder="۰"
                onChange={(value) =>
                  update(index, { minimumStock: toDigits(value) })
                }
              />
              <Cell
                label="کد کالا (SKU)"
                value={row.sku}
                dir="ltr"
                placeholder="خودکار ساخته می‌شود"
                onChange={(value) => update(index, { sku: value })}
              />
              <Cell
                label="بارکد"
                value={row.barcode}
                dir="ltr"
                placeholder="اختیاری"
                onChange={(value) => update(index, { barcode: value.trim() })}
              />
              <Cell
                label="وزن (گرم)"
                value={row.weight}
                dir="ltr"
                placeholder="اختیاری"
                onChange={(value) => update(index, { weight: toDigits(value) })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
