export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

export type DashboardOrder = {
  id: string;
  code: string;
  date: string;
  status: OrderStatus;
  total: string;
  items: {
    id: string;
    title: string;
    image: string;
    quantity: number;
    price: string;
  }[];
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  processing: "در حال پردازش",
  shipped: "ارسال شده",
  delivered: "تحویل شده",
  cancelled: "لغو شده",
};

export const orderStatusStyles: Record<OrderStatus, string> = {
  processing: "bg-[#fff3d6] text-[#8a6a1f]",
  shipped: "bg-brand-mist text-brand",
  delivered: "bg-[#e4f5ea] text-[#2f6b45]",
  cancelled: "bg-[#fde8e8] text-[#9b3d3d]",
};

export const dashboardOrders: DashboardOrder[] = [
  {
    id: "o1",
    code: "RM-10428",
    date: "۱۴۰۴/۰۵/۱۲",
    status: "processing",
    total: "۱٬۳۰۰٬۰۰۰ تومان",
    items: [
      {
        id: "p1",
        title: "ساعت دیواری رزین",
        image: "/images/product-1.jpg",
        quantity: 1,
        price: "۵۰۰٬۰۰۰ تومان",
      },
      {
        id: "p4",
        title: "هرم رزینی دکوراتیو",
        image: "/images/product-4.jpg",
        quantity: 2,
        price: "۸۰۰٬۰۰۰ تومان",
      },
    ],
  },
  {
    id: "o2",
    code: "RM-10391",
    date: "۱۴۰۴/۰۴/۲۸",
    status: "delivered",
    total: "۵۰۰٬۰۰۰ تومان",
    items: [
      {
        id: "p2",
        title: "هنر قالب سیلیکونی",
        image: "/images/product-2.jpg",
        quantity: 1,
        price: "۵۰۰٬۰۰۰ تومان",
      },
    ],
  },
  {
    id: "o3",
    code: "RM-10355",
    date: "۱۴۰۴/۰۴/۰۵",
    status: "shipped",
    total: "۵۰۰٬۰۰۰ تومان",
    items: [
      {
        id: "p3",
        title: "زیورآلات رزینی",
        image: "/images/product-3.jpg",
        quantity: 1,
        price: "۵۰۰٬۰۰۰ تومان",
      },
    ],
  },
];

export const dashboardStats = {
  totalOrders: dashboardOrders.length,
  activeOrders: dashboardOrders.filter(
    (order) => order.status === "processing" || order.status === "shipped",
  ).length,
  deliveredOrders: dashboardOrders.filter((order) => order.status === "delivered")
    .length,
};
