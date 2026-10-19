export type BrandList = {
  id: number;
  title: string;
  slug?: string;
  logo?: string | null;
  is_active?: boolean;
  sort_order?: number;
};

export type CategoryList = {
  id: number;
  title: string;
  slug?: string;
  parent?: string | number | null;
  image?: string | null;
  is_active?: boolean;
  sort_order?: number;
};

export type CategoryDetail = CategoryList & {
  description?: string;
  children: CategoryList[];
  created_date: string;
  updated_date: string;
};

export type ProductImage = {
  id: number;
  image: string;
  alt?: string;
  is_primary?: boolean;
  sort_order?: number;
};

export type AttributeValueDetail = {
  id: number;
  /** نام ویژگی، مثلاً «رنگ» */
  attribute?: string;
  value: string;
};

export type ProductVariantDetail = {
  id: number;
  sku: string;
  barcode?: string;
  attribute_values?: AttributeValueDetail[];
  price: number;
  /** قیمت بعد از تخفیف محصول/دسته؛ در نسخه‌های قدیمی بک‌اند نیست */
  final_price?: number;
  discount_amount?: number;
  weight?: number | null;
  /** موجودی انبار دارد؛ در نسخه‌های قدیمی بک‌اند نیست */
  in_stock?: boolean;
  is_default?: boolean;
  is_active?: boolean;
};

export type ProductList = {
  id: number;
  title: string;
  slug?: string;
  categories: CategoryList[];
  brand: string;
  status?: number;
  is_featured?: boolean;
  is_active?: boolean;
};

export type ProductDetail = {
  id: number;
  title: string;
  slug?: string;
  categories: CategoryList[];
  brand: BrandList | string | null;
  short_description?: string;
  description?: string;
  status?: number;
  is_featured?: boolean;
  is_active?: boolean;
  meta_title?: string;
  meta_description?: string;
  variants: ProductVariantDetail[];
  images: ProductImage[];
  created_date: string;
  updated_date: string;
};

export type PasswordLogin = {
  phone_number: string;
  password: string;
};

export type RequestOTP = {
  phone_number: string;
};

export type VerifyOTP = {
  phone_number: string;
  code: string;
};

export type AuthTokens = {
  access?: string;
  refresh?: string;
  access_token?: string;
  refresh_token?: string;
};

export type CartItem = {
  id: number;
  variant: number;
  product_title: string;
  sku: string;
  quantity: number;
  price: string;
  total_price: string;
  expires_at?: string | null;
};

export type Cart = {
  id: number;
  items: CartItem[];
  item_count: string;
  total_price: string;
  created_date: string;
  updated_date: string;
};

/** UI card shape used across the storefront */
export type ProductCardModel = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  image: string;
  description?: string;
  rawPrice?: number;
  /** سئو؛ خالی یعنی از عنوان و توضیح محصول ساخته شود */
  metaTitle?: string;
  metaDescription?: string;
  /** متن جایگزین تصویر اصلی؛ برای خواننده‌های صفحه و گوگل */
  imageAlt?: string;
  /** نسخه‌های فعال محصول؛ هرکدام قیمت خودش را دارد */
  variants?: VariantOption[];
  /** قیمت قبل از تخفیف؛ فقط وقتی محصول تخفیف دارد */
  oldPrice?: string;
  discountPercent?: number;
  variantId?: number;
  /** هیچ نسخه‌ای موجود نیست؛ محصول «ناموجود» نشان داده می‌شود */
  soldOut?: boolean;
};

/** یک نسخهٔ قابل خرید: ترکیب ویژگی‌ها با قیمت خودش */
export type VariantOption = {
  id: number;
  /** «رنگ: قرمز، سایز: بزرگ» */
  label: string;
  price: string;
  oldPrice?: string;
  discountPercent?: number;
  rawPrice: number;
  /** موجودی انبار دارد؛ وگرنه قابل خرید نیست */
  inStock: boolean;
};

