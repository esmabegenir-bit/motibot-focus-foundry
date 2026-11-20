import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CreditCard, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderSummary } from "@/components/site/OrderSummary";
import { supabase } from "@/integrations/supabase/client";
import { profileQueryOptions } from "@/lib/account";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { placeOrder } from "@/lib/orders.functions";

export const Route = createFileRoute("/_authenticated/odeme")({
  loader: ({ context }) => context.queryClient.ensureQueryData(profileQueryOptions(context.user.id)),
  head: () => ({
    meta: [
      { title: "Ödeme · MotiBot" },
      { name: "description", content: "MotiBot siparişini tamamla." },
      { property: "og:title", content: "Ödeme · MotiBot" },
      { property: "og:description", content: "MotiBot siparişini tamamla." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const formatCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

function CheckoutPage() {
  const { user } = Route.useRouteContext();
  const { data: profile } = useSuspenseQuery(profileQueryOptions(user.id));
  const { lines, coupon, clear } = useCart();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const submitOrder = useServerFn(placeOrder);
  const [busy, setBusy] = useState(false);
  const [saveInfo, setSaveInfo] = useState(true);
  const [ship, setShip] = useState({
    name: profile?.full_name ?? "",
    phone: profile?.phone ?? "",
    address: profile?.address ?? "",
    city: profile?.city ?? "",
  });
  const [card, setCard] = useState({ holder: "", number: "", expiry: "", cvc: "" });

  if (lines.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-3xl font-extrabold text-navy">Sepetin boş</h1>
        <p className="mt-2 text-muted-foreground">Ödeme yapmak için önce sepetine ürün ekle.</p>
        <Button asChild variant="mustard" size="lg" className="mt-6">
          <Link to="/urunler" search={{ kategori: undefined }}>Ürünlere göz at</Link>
        </Button>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      // Simulated bank delay
      await new Promise((r) => setTimeout(r, 1200));
      const result = await submitOrder({
        data: {
          items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
          ...(coupon ? { coupon } : {}),
          shipping: ship,
          card: {
            holder: card.holder,
            number: card.number.replace(/\s/g, ""),
            expiry: card.expiry,
            cvc: card.cvc,
          },
        },
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      if (saveInfo) {
        const { error } = await supabase
          .from("profiles")
          .update({ full_name: ship.name, phone: ship.phone, address: ship.address, city: ship.city })
          .eq("id", user.id);
        if (error) console.error("profile update failed", error);
        void queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
      }
      void queryClient.invalidateQueries({ queryKey: ["orders", user.id] });
      clear();
      void navigate({ to: "/siparis/$id", params: { id: result.orderId } });
    } catch (err) {
      console.error(err);
      toast.error("Bilgileri kontrol edip tekrar dener misin?");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="mb-2 text-4xl font-extrabold text-navy">Ödeme</h1>
      <p className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Lock className="h-4 w-4" /> Bu bir ödeme simülasyonudur, kartından para çekilmez.
      </p>
      <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="space-y-4 rounded-3xl bg-card p-6 shadow-soft">
            <h2 className="text-xl font-extrabold text-navy">Teslimat bilgileri</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Ad soyad</Label>
                <Input id="name" required minLength={3} value={ship.name} onChange={(e) => setShip({ ...ship, name: e.target.value })} className="h-11 rounded-xl" autoComplete="name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" required type="tel" minLength={10} placeholder="05xx xxx xx xx" value={ship.phone} onChange={(e) => setShip({ ...ship, phone: e.target.value })} className="h-11 rounded-xl" autoComplete="tel" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="address">Adres</Label>
                <Input id="address" required minLength={10} value={ship.address} onChange={(e) => setShip({ ...ship, address: e.target.value })} className="h-11 rounded-xl" autoComplete="street-address" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city">Şehir</Label>
                <Input id="city" required minLength={2} value={ship.city} onChange={(e) => setShip({ ...ship, city: e.target.value })} className="h-11 rounded-xl" autoComplete="address-level1" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={saveInfo} onCheckedChange={(v) => setSaveInfo(v === true)} />
              Bu bilgileri sonraki siparişlerim için kaydet
            </label>
          </section>

          <section className="space-y-4 rounded-3xl bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-navy">Kart bilgileri</h2>
              <CreditCard className="h-5 w-5 text-mustard" />
            </div>
            <p className="rounded-xl bg-mustard-soft px-3 py-2 text-xs font-medium text-mustard-foreground">
              Test kartı: <strong>4242 4242 4242 4242</strong>, ileri bir tarih ve herhangi 3 hane. Reddedilen ödemeyi görmek için{" "}
              <strong>4000 0000 0000 0002</strong> kullan.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="holder">Kart üzerindeki isim</Label>
                <Input id="holder" required minLength={3} value={card.holder} onChange={(e) => setCard({ ...card, holder: e.target.value })} className="h-11 rounded-xl" autoComplete="cc-name" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="number">Kart numarası</Label>
                <Input id="number" required inputMode="numeric" pattern="(\d{4} ){3}\d{4}" title="16 haneli kart numarası" value={card.number} onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })} className="h-11 rounded-xl tracking-widest" placeholder="0000 0000 0000 0000" autoComplete="cc-number" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="expiry">Son kullanma (AA/YY)</Label>
                <Input id="expiry" required inputMode="numeric" pattern="(0[1-9]|1[0-2])/\d{2}" title="AA/YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} className="h-11 rounded-xl" placeholder="12/28" autoComplete="cc-exp" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" required inputMode="numeric" pattern="\d{3}" title="3 haneli güvenlik kodu" maxLength={3} value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "") })} className="h-11 rounded-xl" placeholder="123" autoComplete="cc-csc" />
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit space-y-5 rounded-3xl bg-card p-6 shadow-soft lg:sticky lg:top-28">
          <h2 className="text-xl font-extrabold text-navy">Siparişin</h2>
          <ul className="space-y-3">
            {lines.map((l) => (
              <li key={l.productId} className="flex items-center gap-3 text-sm">
                <img src={l.product.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                <span className="flex-1">
                  {l.product.name} <span className="text-muted-foreground">× {l.quantity}</span>
                </span>
                <span className="font-semibold">{formatPrice(l.product.price * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <OrderSummary compact />
          <Button type="submit" size="lg" variant="mustard" className="w-full" disabled={busy}>
            {busy ? "Ödeme işleniyor…" : "Ödemeyi tamamla"}
          </Button>
        </aside>
      </form>
    </div>
  );
}
