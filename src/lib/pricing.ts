// Pure cart pricing rules, shared by the cart UI and the server-side order function.
export const SHIPPING_FEE = 99;
export const FREE_SHIPPING_THRESHOLD = 1500;
export const COUPONS: Record<string, number> = { MOTI10: 0.1 };

export type PricedLine = { price: number; quantity: number; digital: boolean };

export type Totals = {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponApplied: string | null;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export function normalizeCoupon(code: string | null | undefined): string | null {
  const c = (code ?? "").trim().toUpperCase();
  return c && c in COUPONS ? c : null;
}

export function computeTotals(lines: PricedLine[], coupon?: string | null): Totals {
  const subtotal = round2(lines.reduce((s, l) => s + l.price * l.quantity, 0));
  const couponApplied = normalizeCoupon(coupon);
  const rate = couponApplied ? (COUPONS[couponApplied] ?? 0) : 0;
  const discount = round2(subtotal * rate);
  const hasPhysical = lines.some((l) => !l.digital && l.quantity > 0);
  const shipping =
    lines.length === 0 || !hasPhysical || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return { subtotal, discount, shipping, total: round2(subtotal - discount + shipping), couponApplied };
}
