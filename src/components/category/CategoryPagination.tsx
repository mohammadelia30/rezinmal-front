type CategoryPaginationProps = {
  page: number;
  total: number;
  onChange: (page: number) => void;
};

export function CategoryPagination({
  page,
  total,
  onChange,
}: CategoryPaginationProps) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {pages.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`flex size-8 items-center justify-center rounded-lg text-sm font-bold transition ${
            item === page
              ? "bg-brand text-white"
              : "border border-[#e6d8ef] bg-white text-[#5b2a63] hover:bg-[#f8f2fb]"
          }`}
        >
          {item}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(Math.min(total, page + 1))}
        disabled={page >= total}
        className="rounded-lg border border-[#e6d8ef] bg-white px-3 py-1.5 text-sm text-[#5b2a63] transition hover:bg-[#f8f2fb] disabled:opacity-40"
      >
        بعدی
      </button>
    </div>
  );
}
