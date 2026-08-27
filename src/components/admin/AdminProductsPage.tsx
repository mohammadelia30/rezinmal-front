"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { adminProducts } from "@/data/admin";
import {
  AdminBadge,
  AdminPageHeader,
  AdminTable,
} from "@/components/admin/AdminUI";
import {
  readProductActiveMap,
  writeProductActive,
} from "@/lib/admin-store";
import { formatProductPrice } from "@/lib/price";

export function AdminProductsPage() {
  const [activeMap, setActiveMap] = useState<Record<string, boolean>>({});

  const refresh = useCallback(() => {
    setActiveMap(readProductActiveMap());
  }, []);

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener("admin:store-change", onChange);
    return () => window.removeEventListener("admin:store-change", onChange);
  }, [refresh]);

  const isActive = (id: string, fallback: boolean) =>
    activeMap[id] ?? fallback;

  return (
    <div>
      <AdminPageHeader
        title="محصولات"
        description="مدیریت موجودی و وضعیت نمایش محصولات"
      />

      <AdminTable
        headers={[
          "محصول",
          "قیمت",
          "موجودی",
          "فروش",
          "وضعیت",
          "عملیات",
        ]}
      >
        {adminProducts.map((product) => {
          const active = isActive(product.id, product.active);
          const lowStock = product.stock <= 3;

          return (
            <tr
              key={product.id}
              className="border-b border-[#efe6d4] text-right last:border-b-0"
            >
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-3">
                  <div>
                    <p className="font-bold text-foreground">{product.title}</p>
                    {lowStock ? (
                      <p className="mt-0.5 text-xs text-[#9b3d3d]">موجودی کم</p>
                    ) : null}
                  </div>
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-brand-mist">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 font-bold text-brand">
                {formatProductPrice(product.price)}
              </td>
              <td className="px-4 py-3">
                {product.stock.toLocaleString("fa-IR")}
              </td>
              <td className="px-4 py-3">
                {product.sold.toLocaleString("fa-IR")}
              </td>
              <td className="px-4 py-3">
                <AdminBadge
                  className={
                    active
                      ? "bg-[#e4f5ea] text-[#2f6b45]"
                      : "bg-[#fde8e8] text-[#9b3d3d]"
                  }
                >
                  {active ? "فعال" : "غیرفعال"}
                </AdminBadge>
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => {
                    writeProductActive(product.id, !active);
                    refresh();
                  }}
                  className="rounded-lg border border-[#e6dcc2] px-3 py-1.5 text-xs font-medium transition hover:bg-[#f6f1e7]"
                >
                  {active ? "غیرفعال کردن" : "فعال کردن"}
                </button>
              </td>
            </tr>
          );
        })}
      </AdminTable>
    </div>
  );
}
