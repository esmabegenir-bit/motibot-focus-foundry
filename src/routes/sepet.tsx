import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { normalizeCoupon } from "@/lib/pricing";
import { OrderSummary } from "@/components/site/OrderSummary";

export const Route = createFileRoute("/sepet")({
  head: () => ({
    meta: [
      { title: "Sepetim · MotiBot" },
      { name: "description", content: "MotiBot alışveriş sepetin." },
      { property: "og:title", content: "Sepetim · MotiBot" },
      { property: "og:description", content: "MotiBot alışveriş sepetin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, setQuantity, remove, coupon, setCoupon } = useCart();
  const [code, setCode] = useState(coupon);

  if (lines.length === 0) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-mustard-soft text-navy">
          <ShoppingBag className="h-9 w-9" />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold text-navy">Sepetin şimdilik boş</h1>
        <p className="mt-2 text-muted-foreground">MotiBot seni bekliyor. Hadi masana karakter kat!</p>
        <Button asChild size="lg" variant="mustard" className="mt-6">
          <Link to="/urunler" search={{ kategori: undefined }}>Alışverişe başla</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="mb-8 text-4xl font-extrabold text-navy">Sepetim</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <ul className="space-y-4">
          {lines.map((l) => (
            <li key={l.productId} className="flex gap-4 rounded-3xl bg-card p-3 shadow-soft sm:p-4">
              <Link to="/urun/$slug" params={{ slug: l.product.slug }} className="shrink-0">
                <img src={l.product.image} alt={l.product.name} className="h-24 w-24 rounded-2xl object-cover sm:h-28 sm:w-28" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link to="/urun/$slug" params={{ slug: l.product.slug }} className="font-bold text-navy hover:underline">
                      {l.product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{formatPrice(l.product.price)}</p>
                  </div>
                  <Button variant="ghost" size="icon" aria-label={`${l.product.name} sepetten çıkar`} onClick={() => remove(l.productId)}>
                    <Trash2 />
                  </Button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded-full border border-border">
                    <Button variant="ghost" size="icon-sm" aria-label="Azalt" onClick={() => setQuantity(l.productId, l.quantity - 1)}>
                      <Minus />
                    </Button>
                    <span className="w-8 text-center text-sm font-bold">{l.quantity}</span>
                    <Button variant="ghost" size="icon-sm" aria-label="Arttır" onClick={() => setQuantity(l.productId, l.quantity + 1)}>
                      <Plus />
                    </Button>
                  </div>
                  <span className="font-display text-lg font-extrabold text-navy">{formatPrice(l.product.price * l.quantity)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <aside className="h-fit space-y-5 rounded-3xl bg-card p-6 shadow-soft lg:sticky lg:top-28">
          <h2 className="text-xl font-extrabold text-navy">Sipariş özeti</h2>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const valid = normalizeCoupon(code);
              if (!code.trim()) {
                setCoupon("");
                return;
              }
              if (valid) {
                setCoupon(valid);
                toast.success("İndirim kodu uygulandı");
              } else {
                toast.error("Bu indirim kodu geçerli değil");
              }
            }}
          >
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="İndirim kodu" className="h-10 rounded-full pl-9" aria-label="İndirim kodu" />
            </div>
            <Button type="submit" variant="secondary" className="h-10">Uygula</Button>
          </form>
          <OrderSummary />
          <Button asChild size="lg" variant="mustard" className="w-full">
            <Link to="/odeme">Ödemeye geç</Link>
          </Button>
          <p className="text-center text-xs text-muted-foreground">Ödeme simülasyondur, gerçek para çekilmez.</p>
        </aside>
      </div>
    </div>
  );
}
