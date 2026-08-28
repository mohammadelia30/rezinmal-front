export type TokenResponse = {
  message?: string;
  phone_number?: string;
  is_verified?: boolean;
  has_password?: boolean;
  tokens?: {
    access: string;
    refresh?: string;
  };
};

/**
 * پیام خطای بک‌اند را به شکل خوانا درمی‌آورد.
 * DRF بسته به نوع خطا `detail`، لیست پیام‌ها یا دیکشنری فیلدها برمی‌گرداند.
 */
export function backendErrorMessage(
  body: unknown,
  fallback: string,
): string {
  if (!body || typeof body !== "object") return fallback;

  const record = body as Record<string, unknown>;

  if (typeof record.detail === "string") return record.detail;

  if (Array.isArray(record.errors)) {
    const first = record.errors[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object") {
      const detail = (first as Record<string, unknown>).detail;
      if (typeof detail === "string") return detail;
    }
  }

  for (const value of Object.values(record)) {
    if (typeof value === "string") return value;
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  }

  return fallback;
}
