"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminError,
  AdminField,
  AdminModal,
  AdminPageHeader,
  AdminSelect,
  AdminTable,
  AdminToggleField,
} from "@/components/admin/AdminUI";
import { AdminSearch, useSearchFilter } from "@/components/admin/AdminSearch";
import type { ClubLevelRow, ClubMemberRow } from "@/lib/api/admin";
import {
  AdminActionError,
  createClubLevel,
  deleteClubLevel,
  updateClubLevel,
} from "@/lib/admin-store";
import { formatProductPrice } from "@/lib/price";

/** مقادیر مجاز level_type در بک‌اند؛ هر کدام فقط یک بار قابل استفاده است. */
const LEVEL_TYPES = [
  { value: "gold", label: "طلایی" },
  { value: "silver", label: "نقره‌ای" },
  { value: "bronze", label: "برنزی" },
];

const EMPTY_LEVEL = {
  name: "",
  levelType: "",
  priority: "1",
  minAmount: "0",
  minCount: "0",
  isActive: true,
};

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
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_LEVEL);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const { query, setQuery, filtered } = useSearchFilter(members, [
    "fullName",
    "phone",
    "levelName",
  ]);

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
    setForm(EMPTY_LEVEL);
    setEditingId(null);
    setOpen(true);
    setError("");
  };

  const openEdit = (level: ClubLevelRow) => {
    setForm({
      name: level.name,
      levelType: level.levelType,
      priority: String(level.priority),
      minAmount: String(level.minAmount),
      minCount: String(level.minCount),
      isActive: level.isActive,
    });
    setEditingId(level.id);
    setOpen(true);
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("نام سطح را وارد کنید.");
      return;
    }
    if (!form.levelType) {
      setError("نوع سطح را انتخاب کنید.");
      return;
    }

    const input = {
      name: form.name.trim(),
      levelType: form.levelType,
      priority: Number(form.priority) || 0,
      minAmount: Number(form.minAmount) || 0,
      minCount: Number(form.minCount) || 0,
      isActive: form.isActive,
    };

    const done = await run(() =>
      editingId ? updateClubLevel(editingId, input) : createClubLevel(input),
    );
    if (done) setOpen(false);
  };

  const handleDelete = (level: ClubLevelRow) => {
    if (!window.confirm(`سطح «${level.name}» حذف شود؟`)) return;
    run(() => deleteClubLevel(level.id));
  };

  // هر نوع فقط یک بار قابل استفاده است، پس نوع‌های گرفته‌شده حذف می‌شوند.
  const takenTypes = new Set(
    levels
      .filter((level) => level.id !== editingId)
      .map((level) => level.levelType),
  );
  const availableTypes = LEVEL_TYPES.filter(
    (type) => !takenTypes.has(type.value),
  );

  return (
    <div>
      <AdminPageHeader
        title="باشگاه مشتریان"
        description="سطوح عضویت و اعضای هر سطح"
        action={
          availableTypes.length > 0 || editingId ? (
            <AdminButton onClick={openCreate}>افزودن سطح</AdminButton>
          ) : undefined
        }
      />

      <AdminError message={error} />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {levels.length === 0 ? (
          <AdminCard className="sm:col-span-2 xl:col-span-4">
            <p className="text-center text-sm text-muted">
              هنوز سطحی تعریف نشده است. با دکمهٔ «افزودن سطح» شروع کنید.
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
              <div className="mt-3 flex justify-end gap-1.5">
                <AdminButton
                  variant="ghost"
                  size="sm"
                  disabled={busy}
                  onClick={() => openEdit(level)}
                >
                  ویرایش
                </AdminButton>
                <AdminButton
                  variant="danger"
                  size="sm"
                  disabled={busy}
                  onClick={() => handleDelete(level)}
                >
                  حذف
                </AdminButton>
              </div>
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

      {open ? (
        <AdminModal
          title={editingId ? "ویرایش سطح" : "افزودن سطح"}
          onClose={() => setOpen(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminError message={error} />

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField
                label="نام سطح"
                value={form.name}
                onChange={(value) => setForm({ ...form, name: value })}
                required
              />
              <AdminSelect
                label="نوع سطح"
                value={form.levelType}
                onChange={(value) => setForm({ ...form, levelType: value })}
                placeholder="انتخاب کنید"
                options={
                  editingId
                    ? LEVEL_TYPES.filter(
                        (type) =>
                          type.value === form.levelType ||
                          !takenTypes.has(type.value),
                      )
                    : availableTypes
                }
              />
              <AdminField
                label="اولویت (عدد بزرگ‌تر = سطح بالاتر)"
                value={form.priority}
                onChange={(value) =>
                  setForm({ ...form, priority: value.replace(/\D/g, "") })
                }
                dir="ltr"
              />
              <AdminField
                label="حداقل مبلغ خرید (تومان)"
                value={form.minAmount}
                onChange={(value) =>
                  setForm({ ...form, minAmount: value.replace(/\D/g, "") })
                }
                dir="ltr"
              />
              <AdminField
                label="حداقل تعداد خرید"
                value={form.minCount}
                onChange={(value) =>
                  setForm({ ...form, minCount: value.replace(/\D/g, "") })
                }
                dir="ltr"
              />
            </div>

            <AdminToggleField
              label="فعال"
              checked={form.isActive}
              onChange={(value) => setForm({ ...form, isActive: value })}
            />

            <p className="text-right text-xs text-muted">
              هر نوع سطح فقط یک بار قابل تعریف است، پس حداکثر سه سطح
              می‌توانید داشته باشید.
            </p>

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
