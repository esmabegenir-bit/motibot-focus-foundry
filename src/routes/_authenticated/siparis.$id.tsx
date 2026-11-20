import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { orderQueryOptions, type OrderItem } from "@/lib/account";
import { formatPrice } from "@/lib/products";

export const Route = createFileRoute("/_authenticated/siparis/$id")({
  loader: async ({ context, params }) => {
    const order = await context.queryClient.ensureQueryData(orderQueryOptions(params.id));
    if (!order) throw notFound();
  },
  head: () => ({
    meta: [
      { title: "Siparişin alındı · MotiBot" },
      { name: "description", content: "MotiBot sipariş özetin." },
      { property: "og:title", content: "Siparişin alındı · MotiBot" },
      { property: "og:description", content: "MotiBot sipariş özetin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { id } = Route.useParams();
  const { data: order } = useSuspenseQuery(orderQueryOptions(id));
  if (!order) return null;
  const items = (order.items as unknown as OrderItem[]) ?? [];

  return (
    <div className="container-page max-w-2xl py-12">
      <div className="rounded-[2rem] bg-card p-6 text-center shadow-soft sm:p-10">
        <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
        <h1 className="mt-4 text-3xl font-extrabold text-navy">Teşekkürler, siparişin alındı!</h1>
        <p className="mt-2 text-muted-foreground">
          Sipariş no: <strong className="text-foreground">#{order.id.slice(0, 8).toUpperCase()}</strong> · Kart ****{order.card_last4}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Bu bir simülasyondur; kartından para çekilmedi.</p>

        <ul className="mt-8 space-y-2 text-left text-sm">
          {items.map((i, idx) => (
            <li key={idx} className="flex justify-between border-b border-border pb-2">
              <span>{i.name} × {i.quantity}</span>
              <span className="font-semibold">{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
          <li className="flex justify-between pt-1"><span className="text-muted-foreground">Ara toplam</span><span>{formatPrice(Number(order.subtotal))}</span></li>
          {Number(order.discount) > 0 && (
            <li className="flex justify-between text-success"><span>İndirim ({order.coupon_code})</span><span>−{formatPrice(Number(order.discount))}</span></li>
          )}
          <li className="flex justify-between"><span className="text-muted-foreground">Kargo</span><span>{Number(order.shipping) === 0 ? "Ücretsiz" : formatPrice(Number(order.shipping))}</span></li>
          <li className="flex justify-between pt-2 text-base font-bold"><span>Toplam</span><span className="font-display text-xl text-navy">{formatPrice(Number(order.total))}</span></li>
        </ul>

        <div className="mt-6 rounded-2xl bg-muted p-4 text-left text-sm">
          <p className="font-semibold">{order.shipping_name}</p>
          <p className="text-muted-foreground">{order.address}, {order.city}</p>
          <p className="text-muted-foreground">{order.phone}</p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="mustard"><Link to="/urunler" search={{ kategori: undefined }}>Alışverişe devam et</Link></Button>
          <Button asChild variant="outline"><Link to="/hesabim">Siparişlerim</Link></Button>
        </div>
      </div>
    </div>
  );
}
