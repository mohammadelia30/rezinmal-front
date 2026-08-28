"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminProduct } from "@/data/admin";
import {
  AdminBadge,
  AdminPageHeader,
  AdminTable,
} from "@/components/admin/AdminUI";
import { AdminActionError, setProductActive } from "@/lib/admin-store";
import { formatProductPrice } from "@/lib/price";

export function AdminProductsPage({ products }: { products: AdminProduct[] }) {
  const router = useRouter();
  const [error, setError] = useState("");

  const toggleActive = async (id: string, next: boolean) => {
    setError("");
    try {
      await setProductActive(id, next);
      router.refresh();
    } catch (actionError) {
      setError(
        actionError instanceof AdminActionError
          ? actionError.message
          : "تغییر وضعیت محصول ناموفق بود.",
      );
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="محصولات"
        description="مدیریت موجودی و وضعیت نمایش محصولات"
      />

      {error ? (
        <p className="mb-4 text-right text-sm text-red-500">{error}</p>
      ) : null}

      <AdminTable
        headers={["محصول", "قیمت", "وضعیت", "عملیات"]}
      >
        {products.map((product) => {
          const active = product.active;

          return (
            <tr
              key={product.id}
              className="border-b border-[#efe6d4] text-right last:border-b-0"
            >
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-3">
                  <div>
                    <p className="font-bold text-foreground">{product.title}</p>
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
                  onClick={() => toggleActive(product.id, !active)}
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
