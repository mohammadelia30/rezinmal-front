"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type InboxItem = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

/**
 * صندوق پیام.
 *
 * همان اندپوینت برای مشتری و مدیر استفاده می‌شود؛ بک‌اند بر اساس
 * گیرنده فیلتر می‌کند، پس هر کس فقط پیام‌های خودش را می‌بیند.
 * هشدار موجودی کم هم از همین مسیر به مدیر می‌رسد.
 */
export function NotificationInbox({
  items,
  emptyMessage = "پیامی ندارید.",
}: {
  items: InboxItem[];
  emptyMessage?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const unread = items.filter((item) => !item.isRead).length;

  const post = async (path: string) => {
    setBusy(true);
    try {
      await fetch(path, { method: "POST", credentials: "same-origin" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      {unread > 0 ? (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(78,42,84,0.06)]">
          <button
            type="button"
            disabled={busy}
            onClick={() => post("/api/notifications/read-all")}
            className="min-h-9 rounded-lg border border-[#e6dcc2] px-3 py-1.5 text-xs font-medium transition hover:bg-[#f6f1e7] disabled:opacity-60"
          >
            علامت‌گذاری همه به‌عنوان خوانده‌شده
          </button>
          <p className="text-sm font-bold text-foreground">
            {unread.toLocaleString("fa-IR")} پیام خوانده‌نشده
          </p>
        </div>
      ) : null}

      {items.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-muted shadow-[0_4px_20px_rgba(78,42,84,0.06)]">
          {emptyMessage}
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className={`rounded-2xl border p-4 text-right shadow-[0_4px_20px_rgba(78,42,84,0.06)] transition ${
                item.isRead
                  ? "border-[#efe6d4] bg-white"
                  : "border-brand/30 bg-[#fbf7fd]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {!item.isRead ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => post(`/api/notifications/${item.id}/read`)}
                    className="min-h-9 shrink-0 rounded-lg border border-[#e6dcc2] px-3 py-1.5 text-xs font-medium transition hover:bg-[#f6f1e7] disabled:opacity-60"
                  >
                    خواندم
                  </button>
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    {item.message}
                  </p>
                  <p className="mt-2 text-xs text-muted">{item.createdAt}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
