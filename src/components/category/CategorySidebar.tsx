"use client";

import { filterMeta } from "@/data/categories";

export type CategoryFilterItem = {
  id: string;
  label: string;
};

type CategorySidebarProps = {
  activeId: string;
  onSelect: (id: string) => void;
  filters: CategoryFilterItem[];
};

export function CategorySidebar({
  activeId,
  onSelect,
  filters,
}: CategorySidebarProps) {
  return (
    <aside className="h-full bg-white px-3.5 py-4 lg:min-h-[604px] lg:border-e lg:border-[#efe6f4]">
      <h2 className="mb-3 text-right text-[12.5px] font-bold text-[#3d2246]">
        دسته‌بندی اصلی
      </h2>

      <ul className="space-y-1">
        {filters.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={`flex w-full items-center justify-between gap-2 rounded-md px-1.5 py-1.5 text-right text-xs transition ${
                  active
                    ? "bg-[#f0e6f6] text-[#3d2246]"
                    : "text-[#4a4050] hover:bg-[#f8f2fb]"
                }`}
              >
                <span className="flex-1 text-right">{item.label}</span>
                <span
                  className={`size-[10px] shrink-0 rounded-full border ${
                    active
                      ? "border-[#7b3b86] bg-[#7b3b86]"
                      : "border-[#b9a5c4] bg-white"
                  }`}
                  aria-hidden
                />
              </button>
            </li>
          );
        })}
      </ul>

      <div className="my-4 h-px bg-[#efe6f4]" />

      <h3 className="mb-3 text-right text-[12.5px] font-bold text-[#3d2246]">
        قیمت
      </h3>
      <div className="relative mb-2 px-1">
        <div className="h-1 rounded-full bg-[#efe0f5]">
          <div className="relative mx-auto h-1 w-[70%] rounded-full bg-[#7b3b86]">
            <span className="absolute start-0 top-1/2 size-3.5 -translate-y-1/2 rounded-full border-2 border-white bg-[#7b3b86] shadow" />
            <span className="absolute end-0 top-1/2 size-3.5 -translate-y-1/2 rounded-full border-2 border-white bg-[#7b3b86] shadow" />
          </div>
        </div>
      </div>
      <div className="mb-4 flex items-center justify-between text-[11px] text-[#6b5b73]">
        <span>۲٬۰۰۰ تومان</span>
        <span>۳٬۰۰۰ تومان</span>
      </div>

      {filterMeta.map((item) => (
        <div key={item.id}>
          <div className="my-3 h-px bg-[#efe6f4]" />
          <h3 className="text-right text-[12.5px] font-bold text-[#3d2246]">
            {item.title}
          </h3>
          {item.value ? (
            <p className="mt-1.5 text-right text-xs text-[#6b5b73]">
              {item.value}
            </p>
          ) : null}
        </div>
      ))}
    </aside>
  );
}
