"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  orderStatusLabels,
  orderStatusStyles,
  orderStatusTransitions,
  type AdminOrder,
  type AdminOrderStatus,
} from "@/data/admin";
import {
  AdminBadge,
  AdminButton,
  AdminError,
  AdminPageHeader,
  AdminTable,
} from "@/components/admin/AdminUI";
import { AdminSearch, useSearchFilter } from "@/components/admin/AdminSearch";
import {
  AdminActionError,
  changeOrdersStatus,
  type BulkStatusResult,
} from "@/lib/admin-store";
import { API_PATHS } from "@/lib/api/config";
import { formatProductPrice } from "@/lib/price";

const STATUSES = Object.keys(orderStatusLabels) as AdminOrderStatus[];

/** برچسب دکمه برای رفتن به هر وضعیت */
const ACTION_LABELS: Record<AdminOrderStatus, string> = {
  pending_payment: "در انتظار پرداخت",
  confirmed: "تأیید",
  preparing: "آماده‌سازی",
  ready_for_post: "آمادهٔ ارسال",
  delivered_to_post: "تحویل به تیپاکس",
  cancelled: "لغو",
};

const REASON_LABELS: Record<BulkStatusResult["skipped"][number]["reason"], string> = {
  invalid_transition: "این تغییر برای وضعیت فعلی‌شان مجاز نیست",
  unchanged: "از قبل در همین وضعیت بودند",
  not_found: "پیدا نشدند",
  error: "خطا در تغییر وضعیت",
};

function describeResult(result: BulkStatusResult, status: AdminOrderStatus) {
  const lines: string[] = [];

  if (result.changed.length) {
    lines.push(
      `وضعیت ${result.changed.length.toLocaleString("fa-IR")} سفارش به «${orderStatusLabels[status]}» تغییر کرد.`,
    );
  }

  const byReason = new Map<string, string[]>();
  for (const item of result.skipped) {
    const codes = byReason.get(item.reason) ?? [];
    codes.push(item.order_code ?? String(item.id));
    byReason.set(item.reason, codes);
  }
  for (const [reason, codes] of byReason) {
    lines.push(
      `${codes.length.toLocaleString("fa-IR")} سفارش تغییر نکرد، چون ${
        REASON_LABELS[reason as keyof typeof REASON_LABELS]
      }: ${codes.join("، ")}`,
    );
  }

  return lines;
}

export function AdminOrdersPage({ orders }: { orders: AdminOrder[] }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<AdminOrderStatus | "all">("all");
  const byStatus = useMemo(
    () =>
      statusFilter === "all"
        ? orders
        : orders.filter((order) => order.status === statusFilter),
    [orders, statusFilter],
  );
  const { query, setQuery, filtered } = useSearchFilter(byStatus, [
    "code", "customer", "phone", "date",
  ]);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<AdminOrderStatus | "">("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ lines: string[]; partial: boolean } | null>(null);

  const counts = useMemo(() => {
    const map = new Map<AdminOrderStatus, number>();
    for (const order of orders) map.set(order.status, (map.get(order.status) ?? 0) + 1);
    return map;
  }, [orders]);

  // انتخاب فقط در سفارش‌هایی که هنوز روی صفحه‌اند معنا دارد
  const selectedOrders = orders.filter((order) => selected.has(order.id));
  const visibleIds = filtered.map((order) => order.id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));
  const someVisibleSelected = visibleIds.some((id) => selected.has(id));

  // وضعیت‌هایی که دست‌کم برای یکی از سفارش‌های انتخاب‌شده مجازند
  const reachable = STATUSES.filter((status) =>
    selectedOrders.some((order) => orderStatusTransitions[order.status].includes(status)),
  );
  const eligibleCount = bulkStatus
    ? selectedOrders.filter((order) =>
        orderStatusTransitions[order.status].includes(bulkStatus),
      ).length
    : 0;

  const toggle = (id: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAllVisible = () =>
    setSelected((current) => {
      const next = new Set(current);
      if (allVisibleSelected) visibleIds.forEach((id) => next.delete(id));
      else visibleIds.forEach((id) => next.add(id));
      return next;
    });

  const apply = async (ids: string[], status: AdminOrderStatus) => {
    if (
      status === "cancelled" &&
      !window.confirm(
        ids.length > 1
          ? `${ids.length.toLocaleString("fa-IR")} سفارش لغو شوند؟ موجودی آن‌ها به انبار برمی‌گردد.`
          : "سفارش لغو شود؟ موجودی آن به انبار برمی‌گردد.",
      )
    ) {
      return;
    }

    setBusy(true);
    setError("");
    setResult(null);
    try {
      const response = await changeOrdersStatus(ids, status);
      setResult({
        lines: describeResult(response, status),
        partial: response.skipped.length > 0,
      });
      // تغییرکرده‌ها از انتخاب خارج می‌شوند؛ ردشده‌ها می‌مانند تا مدیر ببیند
      const changed = new Set(response.changed.map((item) => String(item.id)));
      setSelected((current) => new Set([...current].filter((id) => !changed.has(id))));
      setBulkStatus("");
      router.refresh();
    } catch (actionError) {
      setError(
        actionError instanceof AdminActionError
          ? actionError.message
          : "تغییر وضعیت ناموفق بود.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pb-24">
      <AdminPageHeader
        title="سفارش‌ها"
        description="مدیریت فروش و وضعیت سفارش‌های فروشگاه"
        action={
          orders.length > 0 ? (
            <a
              href={API_PATHS.ordersPrintList}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-dark"
            >
              چاپ لیست سفارش‌ها
            </a>
          ) : undefined
        }
      />

      <div className="mb-4 flex flex-wrap justify-end gap-2">
        {(["all", ...STATUSES] as const).map((status) => {
          const count = status === "all" ? orders.length : (counts.get(status) ?? 0);
          const active = statusFilter === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              aria-pressed={active}
              className={`min-h-9 rounded-full border px-3 text-xs font-bold transition ${
                active
                  ? "border-brand bg-brand text-white"
                  : "border-[#e6dcc2] bg-white text-muted hover:text-foreground"
              }`}
            >
              {status === "all" ? "همه" : orderStatusLabels[status]}{" "}
              <span className="opacity-75">({count.toLocaleString("fa-IR")})</span>
            </button>
          );
        })}
      </div>

      <AdminSearch
        value={query}
        onChange={setQuery}
        placeholder="جست‌وجو بر اساس کد سفارش، نام مشتری یا شماره تلفن"
      />

      <AdminError message={error} />

      {result ? (
        <div
          role="status"
          className={`mb-3 rounded-xl px-4 py-2.5 text-right text-sm leading-7 ${
            result.partial ? "bg-[#fff3d6] text-[#8a6a1f]" : "bg-[#e4f5ea] text-[#2f6b45]"
          }`}
        >
          {result.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-muted shadow-[0_4px_20px_rgba(78,42,84,0.06)]">
          {orders.length ? "سفارشی با این مشخصات پیدا نشد." : "هنوز سفارشی ثبت نشده است."}
        </p>
      ) : (
        <AdminTable
          minWidth={960}
          headers={["", "کد سفارش", "مشتری", "تاریخ", "مبلغ", "وضعیت", "عملیات"]}
        >
          <tr className="border-b border-[#efe6d4] bg-[#fbf9f1] text-right">
            <td className="px-4 py-2" colSpan={7}>
              <label className="inline-flex min-h-8 cursor-pointer items-center gap-2 text-xs font-medium text-muted">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someVisibleSelected && !allVisibleSelected;
                  }}
                  onChange={toggleAllVisible}
                  className="size-4 accent-brand"
                />
                انتخاب همهٔ {visibleIds.length.toLocaleString("fa-IR")} سفارش این فهرست
              </label>
            </td>
          </tr>

          {filtered.map((order) => {
            const isSelected = selected.has(order.id);
            const next = orderStatusTransitions[order.status];

            return (
              <tr
                key={order.id}
                className={`border-b border-[#efe6d4] text-right last:border-b-0 ${
                  isSelected ? "bg-brand-mist/30" : ""
                }`}
              >
                <td className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggle(order.id)}
                    aria-label={`انتخاب سفارش ${order.code}`}
                    className="size-4 accent-brand"
                  />
                </td>
                <td className="px-4 py-3 font-bold text-foreground">{order.code}</td>
                <td className="px-4 py-3">
                  {order.customer}
                  <span className="mt-0.5 block text-xs text-muted" dir="ltr">
                    {order.phone}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{order.date}</td>
                <td className="px-4 py-3 font-bold text-brand">
                  {formatProductPrice(order.total)}
                </td>
                <td className="px-4 py-3">
                  <AdminBadge className={orderStatusStyles[order.status]}>
                    {orderStatusLabels[order.status]}
                  </AdminBadge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {next.map((status) => (
                      <AdminButton
                        key={status}
                        variant={status === "cancelled" ? "danger" : "ghost"}
                        size="sm"
                        disabled={busy}
                        onClick={() => apply([order.id], status)}
                      >
                        {ACTION_LABELS[status]}
                      </AdminButton>
                    ))}
                    <a
                      href={API_PATHS.orderPrint(order.id)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-9 items-center justify-center rounded-lg border border-[#e6dcc2] px-3 py-1.5 text-xs font-medium whitespace-nowrap text-foreground transition hover:bg-[#f6f1e7]"
                    >
                      چاپ
                    </a>
                  </div>
                </td>
              </tr>
            );
          })}
        </AdminTable>
      )}

      {selectedOrders.length > 0 ? (
        <div className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-3xl rounded-2xl border border-[#e6dcc2] bg-white p-3 shadow-[0_12px_40px_rgba(78,42,84,0.18)] sm:inset-x-6">
          <div className="flex flex-col gap-3 sm:flex-row-reverse sm:items-center sm:justify-between">
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="text-xs font-medium text-muted transition hover:text-foreground"
              >
                لغو انتخاب
              </button>
              <p className="text-sm font-bold text-foreground">
                {selectedOrders.length.toLocaleString("fa-IR")} سفارش انتخاب شده
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row-reverse sm:items-center">
              <select
                value={bulkStatus}
                onChange={(event) => setBulkStatus(event.target.value as AdminOrderStatus | "")}
                disabled={busy || reachable.length === 0}
                aria-label="وضعیت جدید"
                className="min-h-10 rounded-xl border border-[#e6dcc2] bg-[#fbf9f1] px-3 text-sm outline-none focus:border-brand"
              >
                <option value="">
                  {reachable.length ? "تغییر وضعیت به..." : "تغییری برای این سفارش‌ها مجاز نیست"}
                </option>
                {reachable.map((status) => (
                  <option key={status} value={status}>
                    {orderStatusLabels[status]}
                  </option>
                ))}
              </select>
              <AdminButton
                variant={bulkStatus === "cancelled" ? "danger" : "primary"}
                disabled={busy || !bulkStatus}
                onClick={() =>
                  bulkStatus && apply(selectedOrders.map((order) => order.id), bulkStatus)
                }
              >
                {busy
                  ? "در حال اعمال..."
                  : bulkStatus && eligibleCount < selectedOrders.length
                    ? `اعمال روی ${eligibleCount.toLocaleString("fa-IR")} سفارش مجاز`
                    : "اعمال"}
              </AdminButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
