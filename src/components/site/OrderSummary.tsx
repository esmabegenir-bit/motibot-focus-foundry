import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { FREE_SHIPPING_THRESHOLD, computeTotals } from "@/lib/pricing";

export function OrderSummary({ compact = false }: { compact?: boolean }) {
  const { lines, coupon } = useCart();
  const totals = computeTotals(
    lines.map((l) => ({ price: l.product.price, quantity: l.quantity, digital: l.product.digital })),
    coupon,
  );
  const remaining = FREE_SHIPPING_THRESHOLD - totals.subtotal;
  const hasPhysical = lines.some((l) => !l.product.digital);
  return (
    <div className="space-y-3 text-sm">
      {!compact && hasPhysical && remaining > 0 && (
        <p className="rounded-xl bg-mustard-soft px-3 py-2 font-medium text-mustard-foreground">
          Ücretsiz kargo için {formatPrice(remaining)} daha ekle.
        </p>
      )}
      <div className="flex justify-between"><span className="text-muted-foreground">Ara toplam</span><span className="font-semibold">{formatPrice(totals.subtotal)}</span></div>
      {totals.discount > 0 && (
        <div className="flex justify-between text-success"><span>İndirim ({totals.couponApplied})</span><span className="font-semibold">−{formatPrice(totals.discount)}</span></div>
      )}
      <div className="flex justify-between"><span className="text-muted-foreground">Kargo</span><span className="font-semibold">{totals.shipping === 0 ? "Ücretsiz" : formatPrice(totals.shipping)}</span></div>
      <div className="flex justify-between border-t border-border pt-3 text-base"><span className="font-bold">Toplam</span><span className="font-display text-xl font-extrabold text-navy">{formatPrice(totals.total)}</span></div>
    </div>
  );
}

