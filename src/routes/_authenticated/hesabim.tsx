import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { LogOut, Package } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { ordersQueryOptions, profileQueryOptions, type OrderItem } from "@/lib/account";
import { formatPrice } from "@/lib/products";

export const Route = createFileRoute("/_authenticated/hesabim")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(profileQueryOptions(context.user.id)),
      context.queryClient.ensureQueryData(ordersQueryOptions(context.user.id)),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Hesabım · MotiBot" },
      { name: "description", content: "MotiBot hesap bilgilerin ve siparişlerin." },
      { property: "og:title", content: "Hesabım · MotiBot" },
      { property: "og:description", content: "MotiBot hesap bilgilerin ve siparişlerin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

const dateFmt = new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" });

function AccountPage() {
  const { user } = Route.useRouteContext();
  const { data: profile } = useSuspenseQuery(profileQueryOptions(user.id));
  const { data: orders } = useSuspenseQuery(ordersQueryOptions(user.id));
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? "",
    phone: profile?.phone ?? "",
    address: profile?.address ?? "",
    city: profile?.city ?? "",
  });
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({ id: user.id, ...form });
    setSaving(false);
    if (error) {
      toast.error("Bilgiler kaydedilemedi");
      return;
    }
    toast.success("Bilgilerin güncellendi");
    void queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", search: { redirect: undefined, mode: undefined }, replace: true });
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-mustard-foreground/70">Hesabım</p>
          <h1 className="text-4xl font-extrabold text-navy">Merhaba{form.full_name ? `, ${form.full_name.split(" ")[0]}` : ""}!</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Button variant="outline" onClick={() => void signOut()}>
          <LogOut /> Çıkış yap
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <form onSubmit={save} className="h-fit space-y-4 rounded-3xl bg-card p-6 shadow-soft">
          <h2 className="text-xl font-extrabold text-navy">Bilgilerim</h2>
          <div className="space-y-1.5">
            <Label htmlFor="p-name">Ad soyad</Label>
            <Input id="p-name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="h-11 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-phone">Telefon</Label>
            <Input id="p-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-11 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-address">Adres</Label>
            <Input id="p-address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="h-11 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-city">Şehir</Label>
            <Input id="p-city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="h-11 rounded-xl" />
          </div>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </Button>
        </form>

        <section className="space-y-4">
          <h2 className="text-xl font-extrabold text-navy">Siparişlerim</h2>
          {orders.length === 0 ? (
            <div className="rounded-3xl bg-card p-8 text-center shadow-soft">
              <Package className="mx-auto h-8 w-8 text-mustard" />
              <p className="mt-3 font-semibold">Henüz siparişin yok</p>
              <Button asChild variant="mustard" className="mt-4">
                <Link to="/urunler" search={{ kategori: undefined }}>Alışverişe başla</Link>
              </Button>
            </div>
          ) : (
            orders.map((o) => {
              const items = (o.items as unknown as OrderItem[]) ?? [];
              return (
                <Link
                  key={o.id}
                  to="/siparis/$id"
                  params={{ id: o.id }}
                  className="block rounded-3xl bg-card p-5 shadow-soft transition hover:shadow-lift"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-bold text-navy">#{o.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">{dateFmt.format(new Date(o.created_at))}</p>
                    </div>
                    <span className="rounded-full bg-mustard-soft px-3 py-1 text-xs font-bold text-mustard-foreground">Ödendi · Hazırlanıyor</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {items.map((i) => `${i.name} × ${i.quantity}`).join(", ")}
                  </p>
                  <p className="mt-2 font-display text-lg font-extrabold text-navy">{formatPrice(Number(o.total))}</p>
                </Link>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
}
