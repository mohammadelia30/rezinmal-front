"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/favorites";

export function FavoritesStatCard() {
  const { count } = useFavorites();

  return (
    <Link
      href="/dashboard/favorites"
      className="block rounded-2xl bg-white p-5 shadow-[0_4px_20px_rgba(78,42,84,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(78,42,84,0.1)]"
    >
      <p className="text-sm text-muted">علاقه‌مندی‌ها</p>
      <p className="mt-2 text-3xl font-bold text-brand">{count}</p>
      <p className="mt-2 text-xs text-muted">محصولات ذخیره‌شده</p>
    </Link>
  );
}
