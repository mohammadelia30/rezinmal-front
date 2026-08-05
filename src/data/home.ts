export const navLinks = [
  { label: "فروشگاه", href: "#shop" },
  { label: "آموزش", href: "#articles" },
  { label: "گالری", href: "#gallery" },
  { label: "محصولات", href: "#products" },
  { label: "ارتباط با ما", href: "#contact" },
] as const;

export const heroImages = {
  main: "/images/hero-main.jpg",
  thumb1: "/images/hero-thumb-1.jpg",
  thumb2: "/images/hero-thumb-2.jpg",
} as const;

export const categories = [
  {
    id: "resin",
    title: "رنگ و رزین بوردش",
    image: "/images/cat-resin.jpg",
  },
  {
    id: "molds",
    title: "قالب‌های سیلیکونی",
    image: "/images/cat-molds.jpg",
  },
  {
    id: "tools",
    title: "ابزارآلات",
    image: "/images/cat-tools.jpg",
  },
  {
    id: "kits",
    title: "کیت‌های آموزشی",
    image: "/images/cat-kits.jpg",
  },
] as const;

export const products = [
  {
    id: "p1",
    title: "تکنیک‌های آمتیست",
    subtitle: "مورینگ",
    price: "۵۰۰ تومان",
    image: "/images/product-1.jpg",
  },
  {
    id: "p2",
    title: "هنر ویترای",
    subtitle: "مورینگ",
    price: "۵۰۰ تومان",
    image: "/images/product-2.jpg",
  },
  {
    id: "p3",
    title: "زیورآلات رزینی",
    subtitle: "مورینگ",
    price: "۵۰۰ تومان",
    image: "/images/product-3.jpg",
  },
  {
    id: "p4",
    title: "هرم رزینی دکوراتیو",
    subtitle: "مورینگ",
    price: "۵۰۰ تومان",
    image: "/images/product-4.jpg",
  },
] as const;

export const articles = [
  {
    id: "a1",
    title: "تکنیک‌های پیشرفته پورینگ",
    image: "/images/article-1.jpg",
  },
  {
    id: "a2",
    title: "راهنمای انتخاب قالب مناسب",
    image: "/images/article-2.jpg",
  },
  {
    id: "a3",
    title: "ترکیب رنگ در هنر رزین",
    image: "/images/article-3.jpg",
  },
] as const;
