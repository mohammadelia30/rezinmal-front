export function parseProductPrice(price: string) {
  const digits = price
    .replace(/[^\d۰-۹]/g, "")
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)));

  return Number(digits) || 0;
}

export function formatProductPrice(amount: number) {
  return `${amount.toLocaleString("fa-IR")} تومان`;
}
