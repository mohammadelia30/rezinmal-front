"use client";

import {
  AdminBadge,
  AdminCard,
  AdminPageHeader,
  AdminTable,
} from "@/components/admin/AdminUI";
import { AdminSearch, useSearchFilter } from "@/components/admin/AdminSearch";
import type { ClubLevelRow, ClubMemberRow } from "@/lib/api/admin";
import { formatProductPrice } from "@/lib/price";

/**
 * باشگاه مشتریان.
 *
 * سطح هر کاربر از عضویت فعالش می‌آید و ارتقا را خود بک‌اند بر اساس
 * مجموع خرید انجام می‌دهد، پس اینجا فقط نمایش داده می‌شود.
 */
export function AdminClubPage({
  levels,
  members,
}: {
  levels: ClubLevelRow[];
  members: ClubMemberRow[];
}) {
  const { query, setQuery, filtered } = useSearchFilter(members, [
    "fullName",
    "phone",
    "levelName",
  ]);

  return (
    <div>
      <AdminPageHeader
        title="باشگاه مشتریان"
        description="سطوح عضویت و اعضای هر سطح"
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {levels.length === 0 ? (
          <AdminCard className="sm:col-span-2 xl:col-span-4">
            <p className="text-center text-sm text-muted">
              هنوز سطحی برای باشگاه تعریف نشده است. سطوح از پنل جنگو ساخته
              می‌شوند.
            </p>
          </AdminCard>
        ) : (
          levels.map((level) => (
            <AdminCard key={level.id}>
              <div className="flex items-start justify-between gap-2">
                <AdminBadge
                  className={
                    level.isActive
                      ? "bg-[#e4f5ea] text-[#2f6b45]"
                      : "bg-[#fde8e8] text-[#9b3d3d]"
                  }
                >
                  {level.isActive ? "فعال" : "غیرفعال"}
                </AdminBadge>
                <div className="text-right">
                  <p className="font-bold text-foreground">{level.name}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    اولویت {level.priority.toLocaleString("fa-IR")}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-right text-2xl font-bold text-brand">
                {level.membersCount.toLocaleString("fa-IR")}
                <span className="ms-1 text-sm font-normal text-muted">عضو</span>
              </p>
              <p className="mt-2 text-right text-xs text-muted">
                از {formatProductPrice(level.minAmount)} یا{" "}
                {level.minCount.toLocaleString("fa-IR")} خرید
              </p>
            </AdminCard>
          ))
        )}
      </div>

      <AdminSearch
        value={query}
        onChange={setQuery}
        placeholder="جست‌وجو بر اساس نام، شماره تلفن یا سطح"
      />

      {filtered.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-muted shadow-[0_4px_20px_rgba(78,42,84,0.06)]">
          {members.length === 0
            ? "هنوز کاربری عضو باشگاه نشده است."
            : "موردی با این جست‌وجو پیدا نشد."}
        </p>
      ) : (
        <AdminTable
          minWidth={860}
          headers={[
            "کاربر",
            "موبایل",
            "سطح",
            "مجموع خرید",
            "تعداد خرید",
            "عضویت از",
          ]}
        >
          {filtered.map((member) => (
            <tr
              key={member.userId}
              className="border-b border-[#efe6d4] text-right last:border-b-0"
            >
              <td className="px-4 py-3 font-bold text-foreground">
                {member.fullName}
              </td>
              <td className="px-4 py-3" dir="ltr">
                {member.phone}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1.5">
                  {member.byAdmin ? (
                    <AdminBadge className="bg-[#fdf3e3] text-[#8a6a1f]">
                      دستی
                    </AdminBadge>
                  ) : null}
                  <AdminBadge className="bg-brand-mist text-brand">
                    {member.levelName}
                  </AdminBadge>
                </div>
              </td>
              <td className="px-4 py-3 font-bold text-brand">
                {formatProductPrice(member.totalAmount)}
              </td>
              <td className="px-4 py-3">
                {member.totalCount.toLocaleString("fa-IR")}
              </td>
              <td className="px-4 py-3 text-muted">{member.since}</td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  );
}
