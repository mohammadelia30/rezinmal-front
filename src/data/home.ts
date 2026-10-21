// عنوان‌های منو تا امروز کلمه‌های بی‌معنی طرح اولیه بودند («سبک کلات»،
// «مهموره»، «مسوری»)، پس مشتری از روی منو نمی‌فهمید فروشگاه کجاست.
export const navLinks = [
  { label: "فروشگاه", href: "/products" },
  { label: "دسته‌بندی‌ها", href: "/categories" },
  { label: "مقالات", href: "/blog" },
  { label: "گالری", href: "#gallery" },
  { label: "ارتباط با ما", href: "#contact" },
] as const;

export const shopNavLinks = [
  { label: "فروشگاه", href: "/products" },
  { label: "دسته‌بندی‌ها", href: "/categories" },
  { label: "مقالات", href: "/blog" },
  { label: "گالری", href: "/#gallery" },
  { label: "ارتباط با ما", href: "/#contact" },
] as const;

export const hero = {
  titleLine1: "زیبایی را خودتان بسازید",
  titleLine2: "با کیت‌های آموزش رزینمال",
  cta: "شروع یادگیری",
} as const;

export const heroSlides = [
  {
    id: "h1",
    src: "/images/hero-main.jpg",
    alt: "ریختن رزین",
  },
  {
    id: "h2",
    src: "/images/hero-thumb-1.jpg",
    alt: "گوشواره رزین",
  },
  {
    id: "h3",
    src: "/images/hero-thumb-2.jpg",
    alt: "زیورآلات رزینی",
  },
  {
    id: "h4",
    src: "/images/hero-extra.jpg",
    alt: "هنر رزین دست‌ساز",
  },
] as const;


export const products = [
  {
    id: "p1",
    title: "ساعت دیواری رزین",
    subtitle: "مورنینگ",
    price: "۵۰۰ تومان",
    image: "/images/product-1.jpg",
  },
  {
    id: "p2",
    title: "هنر قالب سیلیکونی",
    subtitle: "مورنینگ",
    price: "۵۰۰ تومان",
    image: "/images/product-2.jpg",
  },
  {
    id: "p3",
    title: "زیورآلات رزینی",
    subtitle: "مورنینگ",
    price: "۵۰۰ تومان",
    image: "/images/product-3.jpg",
  },
  {
    id: "p4",
    title: "هرم رزینی دکوراتیو",
    subtitle: "مورنینگ",
    price: "۳۰۰ تومان",
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
    title: "تکنیک‌های پیشرفته پورینگ",
    image: "/images/article-3.jpg",
  },
] as const;

export const footerContacts = {
  phone: "۰۲۱ ۳۴۴۲ ۳۶۰",
  address: "گروه رزینمال، تهران",
  email: "info@resinmal.com",
  addressLine: "آدرس: تهران، ولیعصر",
} as const;
