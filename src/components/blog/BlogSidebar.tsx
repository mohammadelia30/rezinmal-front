"use client";

import {
  blogCategories,
  blogExtraFilters,
  blogLevels,
} from "@/data/blog";

type BlogSidebarProps = {
  categoryId: string;
  levelId: string;
  extraId: string;
  onCategoryChange: (id: string) => void;
  onLevelChange: (id: string) => void;
  onExtraChange: (id: string) => void;
};

function RadioRow({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-right text-xs transition ${
        active
          ? "bg-[#f0e6f6] text-[#3d2246]"
          : "text-[#4a4050] hover:bg-[#f8f2fb]"
      }`}
    >
      <span className="flex-1 text-right">{label}</span>
      <span
        className={`size-[11px] shrink-0 rounded-full border ${
          active
            ? "border-[#7b3b86] bg-[#7b3b86]"
            : "border-[#b9a5c4] bg-white"
        }`}
        aria-hidden
      />
    </button>
  );
}

export function BlogSidebar({
  categoryId,
  levelId,
  extraId,
  onCategoryChange,
  onLevelChange,
  onExtraChange,
}: BlogSidebarProps) {
  return (
    <aside className="h-full border-e border-[#efe6f4] bg-[#f7f4f9] px-3.5 py-3 lg:min-h-[680px]">
      <h2 className="mb-2 text-right text-[12.5px] font-bold text-[#3d2246]">
        دسته‌بندی مقالات
      </h2>
      <div className="space-y-1">
        {blogCategories.map((item) => (
          <RadioRow
            key={item.id}
            label={item.label}
            active={categoryId === item.id}
            onClick={() => onCategoryChange(item.id)}
          />
        ))}
      </div>

      <div className="my-3 h-px bg-[#e7dceb]" />

      <h3 className="mb-2 text-right text-[12.5px] font-bold text-[#3d2246]">
        تاریخ؛ سطح
      </h3>
      <div className="space-y-1">
        {blogLevels.map((item) => (
          <RadioRow
            key={item.id}
            label={item.label}
            active={levelId === item.id}
            onClick={() => onLevelChange(item.id)}
          />
        ))}
      </div>

      <div className="my-3 h-px bg-[#e7dceb]" />

      <h3 className="mb-1 text-right text-[12.5px] font-bold text-[#3d2246]">
        محصول مرتبط
      </h3>
      <p className="mb-2 text-right text-[11px] text-[#8a7a96]">
        محصولات ساختنی
      </p>
      <div className="space-y-1">
        {blogExtraFilters.map((item) => (
          <RadioRow
            key={item.id}
            label={item.label}
            active={extraId === item.id}
            onClick={() => onExtraChange(item.id)}
          />
        ))}
      </div>
    </aside>
  );
}
