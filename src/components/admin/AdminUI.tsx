import type { ReactNode } from "react";

export function AdminStatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_4px_20px_rgba(78,42,84,0.06)]">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold text-brand sm:text-3xl">{value}</p>
      {hint ? <p className="mt-2 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function AdminBadge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${className}`}
    >
      {children}
    </span>
  );
}

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="text-right">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function AdminCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(78,42,84,0.06)] sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function AdminTable({
  headers,
  children,
  minWidth = 640,
}: {
  headers: string[];
  children: ReactNode;
  /** عرض حداقلی جدول؛ جدول‌های پرستون به فضای بیشتری نیاز دارند */
  minWidth?: number;
}) {
  return (
    <div className="overflow-x-auto overscroll-x-contain rounded-2xl bg-white shadow-[0_4px_20px_rgba(78,42,84,0.06)]">
      <table className="w-full text-sm" style={{ minWidth: `${minWidth}px` }}>
        <thead>
          <tr className="border-b border-[#efe6d4] bg-[#fbf9f1] text-right">
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 font-bold text-foreground whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function AdminEmpty({ message }: { message: string }) {
  return (
    <AdminCard className="py-10 text-center text-sm text-muted">{message}</AdminCard>
  );
}

// ==========================================================
// اجزای مشترک فرم‌ها و عملیات
// ==========================================================

export function AdminButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled,
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "ghost" | "danger";
  /** sm برای عملیات داخل جدول، md برای دکمه‌های اصلی */
  size?: "sm" | "md";
  disabled?: boolean;
  title?: string;
}) {
  const styles = {
    primary: "bg-brand text-white hover:bg-brand-dark",
    ghost: "border border-[#e6dcc2] text-foreground hover:bg-[#f6f1e7]",
    danger: "border border-[#e6dcc2] text-[#8a3a3a] hover:bg-[#fff5f5]",
  }[variant];

  // روی موبایل هدف لمس نباید کوچک‌تر از ۳۶ پیکسل شود
  const sizing =
    size === "sm"
      ? "min-h-9 rounded-lg px-3 py-1.5 text-xs"
      : "min-h-10 rounded-xl px-4 py-2.5 text-sm";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center justify-center font-medium whitespace-nowrap transition disabled:opacity-60 ${sizing} ${styles}`}
    >
      {children}
    </button>
  );
}

export function AdminField({
  label,
  value,
  onChange,
  type = "text",
  dir,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  dir?: "ltr" | "rtl";
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-right">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </span>
      <input
        type={type}
        value={value}
        dir={dir}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-[#e6dcc2] bg-[#fbf9f1] px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
      />
    </label>
  );
}

export function AdminTextarea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block text-right">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-[#e6dcc2] bg-[#fbf9f1] px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
      />
    </label>
  );
}

export function AdminSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <label className="block text-right">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-[#e6dcc2] bg-[#fbf9f1] px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AdminToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#efe6d4] bg-[#fbf9f1] px-4 py-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 accent-[#4e2a54]"
      />
      <span className="text-sm font-medium text-foreground">{label}</span>
    </label>
  );
}

/** پنجرهٔ فرم؛ برای افزودن و ویرایش استفاده می‌شود. */
export function AdminModal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-3 sm:p-8">
      <div className="my-auto w-full max-w-2xl rounded-2xl bg-white p-4 shadow-xl sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="flex size-9 items-center justify-center rounded-lg text-muted transition hover:bg-[#f6f1e7]"
          >
            ✕
          </button>
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

export function AdminError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p className="mb-3 rounded-xl bg-[#fde8e8] px-4 py-2.5 text-right text-sm text-[#9b3d3d]">
      {message}
    </p>
  );
}
