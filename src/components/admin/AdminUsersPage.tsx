import { adminUsers } from "@/data/admin";
import {
  AdminBadge,
  AdminPageHeader,
  AdminTable,
} from "@/components/admin/AdminUI";
import { formatProductPrice } from "@/lib/price";

export function AdminUsersPage() {
  return (
    <div>
      <AdminPageHeader
        title="کاربران"
        description="لیست مشتریان ثبت‌نام‌شده در فروشگاه"
      />

      <AdminTable
        headers={[
          "نام",
          "موبایل",
          "تعداد سفارش",
          "مجموع خرید",
          "عضویت",
          "وضعیت",
        ]}
      >
        {adminUsers.map((user) => (
          <tr
            key={user.id}
            className="border-b border-[#efe6d4] text-right last:border-b-0"
          >
            <td className="px-4 py-3 font-bold text-foreground">
              {user.firstName} {user.lastName}
            </td>
            <td className="px-4 py-3" dir="ltr">
              {user.phone}
            </td>
            <td className="px-4 py-3">
              {user.ordersCount.toLocaleString("fa-IR")}
            </td>
            <td className="px-4 py-3 font-bold text-brand">
              {formatProductPrice(user.totalSpent)}
            </td>
            <td className="px-4 py-3 text-muted">{user.joinedAt}</td>
            <td className="px-4 py-3">
              <AdminBadge
                className={
                  user.status === "active"
                    ? "bg-[#e4f5ea] text-[#2f6b45]"
                    : "bg-[#fde8e8] text-[#9b3d3d]"
                }
              >
                {user.status === "active" ? "فعال" : "مسدود"}
              </AdminBadge>
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
