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


