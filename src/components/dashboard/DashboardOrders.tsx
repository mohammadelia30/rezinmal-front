import Image from "next/image";
import {
  orderStatusLabels,
  orderStatusStyles,
  type DashboardOrder,
} from "@/data/dashboard";

export function DashboardOrders({ orders }: { orders: DashboardOrder[] }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-5 shadow-[0_4px_20px_rgba(78,42,84,0.06)] sm:p-6">
        <h2 className="text-right text-lg font-bold text-foreground">
          سفارش‌های من
        </h2>
        <p className="mt-1 text-right text-sm text-muted">
          وضعیت و جزئیات سفارش‌های اخیر خود را مشاهده کنید.
        </p>
      </div>

      {orders.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-muted shadow-[0_4px_20px_rgba(78,42,84,0.06)]">
          هنوز سفارشی ثبت نکرده‌اید.
        </p>
      ) : null}

      {orders.map((order) => (
        <article
          key={order.id}
          className="rounded-2xl bg-white p-5 shadow-[0_4px_20px_rgba(78,42,84,0.06)] sm:p-6"
        >
          <div className="flex flex-col gap-3 border-b border-[#efe6d4] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-right">
              <h3 className="font-bold text-foreground">{order.code}</h3>
              <p className="mt-1 text-sm text-muted">تاریخ: {order.date}</p>
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${orderStatusStyles[order.status]}`}
              >
                {orderStatusLabels[order.status]}
              </span>
              <p className="text-sm font-bold text-brand">{order.total}</p>
            </div>
          </div>

          <ul className="mt-4 space-y-3">
            {order.items.map((item) => (
              <li
                key={`${order.id}-${item.id}`}
                className="flex items-center gap-3 rounded-xl bg-[#fbf9f1] p-3"
              >
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1 text-right">
                  <p className="font-bold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    تعداد: {item.quantity}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-bold text-brand">
                  {item.price}
                </p>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
