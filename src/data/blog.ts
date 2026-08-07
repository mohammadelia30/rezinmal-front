export const blogCategories = [
  { id: "tutorial", label: "آموزش" },
  { id: "design", label: "طراحی" },
  { id: "materials", label: "علم مواد" },
  { id: "other", label: "غیره" },
] as const;

export const blogLevels = [
  { id: "beginner", label: "مبتدی" },
  { id: "advanced", label: "پیشرفته" },
] as const;

export const blogExtraFilters = [
  { id: "kit", label: "کیت" },
  { id: "tools", label: "ابزار" },
  { id: "misc", label: "غیره" },
] as const;

export const blogPosts = [
  {
    id: "b1",
    title: "۵ تکنیک حرفه‌ای برای رگه‌های طلا در ژئود",
    excerpt:
      "با این تکنیک‌ها رگه‌های طلایی طبیعی و درخشان روی زیرلیوانی‌های ژئود بسازید.",
    category: "آموزش",
    categoryId: "tutorial",
    author: "استاد سارا",
    price: "۳٫۱۳۰ تومان",
    image: "/images/product-2.jpg",
  },
  {
    id: "b2",
    title: "دکوراسیون منزل با محصولات رزینی: ست نبیولا",
    excerpt:
      "چطور با ست نبیولا فضایی گرم و هنری در خانه بسازید و دکوراسیون را کامل کنید.",
    category: "طراحی",
    categoryId: "design",
    author: "مهندس علوی",
    price: null,
    image: "/images/article-1.jpg",
  },
  {
    id: "b3",
    title: "چگونه از رزین اپوکسی در برابر اشعه UV محافظت کنیم؟",
    excerpt:
      "روش‌های علمی محافظت از رزین اپوکسی در برابر زردشدگی و آسیب اشعه UV.",
    category: "علم مواد",
    categoryId: "materials",
    author: "تیم تحقیق",
    price: null,
    image: "/images/article-2.jpg",
  },
  {
    id: "b4",
    title: "راهنمای انتخاب قالب مناسب برای مبتدی‌ها",
    excerpt:
      "از قالب سیلیکونی ساده تا قالب‌های چندتکه؛ کدام برای شروع بهتر است؟",
    category: "آموزش",
    categoryId: "tutorial",
    author: "استاد سارا",
    price: "۲٫۵۰۰ تومان",
    image: "/images/cat-molds.jpg",
  },
  {
    id: "b5",
    title: "ترکیب رنگ و لایه‌بندی در هنر رزین",
    excerpt:
      "اصول ساخت پالت رنگی هماهنگ و جلوگیری از کدری در پورینگ رزین.",
    category: "طراحی",
    categoryId: "design",
    author: "مهندس علوی",
    price: null,
    image: "/images/article-3.jpg",
  },
  {
    id: "b6",
    title: "نکات ایمنی کار با رزین اپوکسی",
    excerpt:
      "تهویه، دستکش و نگهداری صحیح مواد؛ همه چیز برای کار ایمن با رزین.",
    category: "علم مواد",
    categoryId: "materials",
    author: "تیم تحقیق",
    price: null,
    image: "/images/hero-main.jpg",
  },
] as const;
