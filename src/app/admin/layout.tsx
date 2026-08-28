import type { ReactNode } from "react";

/**
 * لایهٔ بیرونی پنل مدیریت. عمداً خالی است تا صفحهٔ ورود
 * (/admin/login) پشت دروازهٔ احراز هویت قرار نگیرد؛ دروازه در
 * گروه (dashboard) اعمال می‌شود.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
