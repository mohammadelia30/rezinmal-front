export const categoryFilters = [
  { id: "coasters", label: "زیرلیوانی‌ها" },
  { id: "clocks", label: "ساعت دیواری" },
  { id: "jewelry", label: "زیورآلات" },
  { id: "trays", label: "سینی" },
  { id: "other", label: "غیره" },
] as const;

export const filterMeta = [
  { id: "color", title: "رنگ پایه", value: "رنگ‌های مختلف" },
  { id: "effect", title: "افکت", value: "ورق طلا، رنگدانه‌های متالیک" },
  { id: "edge", title: "جنس لبه", value: "فلز رزین" },
  { id: "misc", title: "غیره", value: "" },
] as const;

export const categoryTitles: Record<string, string> = {
  coasters: "دسته‌بندی: زیرلیوانی‌های ژئود رزینمال",
  clocks: "دسته‌بندی: ساعت دیواری رزینمال",
  jewelry: "دسته‌بندی: زیورآلات رزینمال",
  trays: "دسته‌بندی: سینی‌های رزینمال",
  other: "دسته‌بندی: سایر محصولات رزینمال",
};

export const categoryProducts = [
  {
    id: "c1",
    title: "مجموعه زیرلیوانی ژئود «ستاره شب»",
    price: "۳۵٬۰۰۰ تومان",
    rating: "4.8",
    image: "/images/product-2.jpg",
  },
  {
    id: "c2",
    title: "زیرلیوانی تک ورگه طلا",
    price: "۲۱٬۰۰۰ تومان",
    rating: "4.8",
    image: "/images/product-1.jpg",
  },
  {
    id: "c3",
    title: "زیرلیوانی تک ورگه طلا",
    price: "۲۱٬۰۰۰ تومان",
    rating: "4.8",
    image: "/images/product-3.jpg",
  },
  {
    id: "c4",
    title: "زیرلیوانی هندسی رزینی",
    price: "۲۱٬۰۰۰ تومان",
    rating: "4.8",
    image: "/images/product-4.jpg",
  },
  {
    id: "c5",
    title: "مجموعه زیرلیوانی ژئود «ستاره شب»",
    price: "۳۵٬۰۰۰ تومان",
    rating: "4.8",
    image: "/images/hero-extra.jpg",
  },
  {
    id: "c6",
    title: "زیرلیوانی تک دره رگ طلا",
    price: "۲۱٬۰۰۰ تومان",
    rating: "4.8",
    image: "/images/cat-resin.jpg",
  },
  {
    id: "c7",
    title: "زیرلیوانی هندسی رزینی",
    price: "۲۱٬۰۰۰ تومان",
    rating: "4.8",
    image: "/images/product-2.jpg",
  },
  {
    id: "c8",
    title: "زیرلیوانی هندسی رزینی",
    price: "۲۱٬۰۰۰ تومان",
    rating: "4.8",
    image: "/images/hero-thumb-1.jpg",
  },
] as const;
