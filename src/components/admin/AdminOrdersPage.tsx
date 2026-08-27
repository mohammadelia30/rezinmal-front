import {
  adminOrders,
  orderStatusLabels,
  orderStatusStyles,
} from "@/data/admin";
import {
  AdminBadge,
  AdminPageHeader,
  AdminTable,
} from "@/components/admin/AdminUI";
import { formatProductPrice } from "@/lib/price";

export function AdminOrdersPage() {
  return (
    <div>
      <AdminPageHeader
        title="سفارش‌ها"
        description="مدیریت فروش و وضعیت سفارش‌های فروشگاه"
      />

      <AdminTable
        headers={[
          "کد سفارش",
          "مشتری",
          "موبایل",
          "تاریخ",
          "اقلام",
          "مبلغ",
          "وضعیت",
        ]}
      >
        {adminOrders.map((order) => (
          <tr
            key={order.id}
            className="border-b border-[#efe6d4] text-right last:border-b-0"
          >
            <td className="px-4 py-3 font-bold text-foreground">{order.code}</td>
            <td className="px-4 py-3">{order.customer}</td>
            <td className="px-4 py-3" dir="ltr">
              {order.phone}
            </td>
            <td className="px-4 py-3 text-muted">{order.date}</td>
            <td className="px-4 py-3">
              {order.itemsCount.toLocaleString("fa-IR")}
            </td>
            <td className="px-4 py-3 font-bold text-brand">
              {formatProductPrice(order.total)}
            </td>
            <td className="px-4 py-3">
              <AdminBadge className={orderStatusStyles[order.status]}>
                {orderStatusLabels[order.status]}
              </AdminBadge>
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
