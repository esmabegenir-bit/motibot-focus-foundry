import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BellRing, Gift, Plus, Timer, Truck } from "lucide-react";
import { toast } from "sonner";
import heroImage from "@/assets/hero-motibot.jpg";
import storyImage from "@/assets/brand-story.jpg";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { INSTAGRAM_URL, TIKTOK_URL, TikTokIcon } from "@/components/site/SocialLinks";
import { Instagram } from "lucide-react";
import { CATEGORIES, PRODUCTS, formatPrice, getProduct } from "@/lib/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MotiBot · Masana karakter kat | Masaüstü motivasyon robotu" },
      {
        name: "description",
        content:
          "Odaklanmanı, mola vermeni ve hedeflerini hatırlatan masaüstü robotlar. MotiBot Lite ve MotiBot Pro ile masana karakter kat.",
      },
      { property: "og:title", content: "MotiBot · Masana karakter kat" },
      {
        property: "og:description",
        content: "Masaüstü motivasyon ve odaklanma robotları, aksesuarlar, dijital paketler ve hediye setleri.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const CATEGORY_IMAGES: Record<string, string> = {
  robotlar: getProduct("motibot-lite")?.image ?? "",
  aksesuarlar: getProduct("ahsap-sarj-standi")?.image ?? "",
  "dijital-urunler": getProduct("odak-ses-paketi")?.image ?? "",
  "hediye-setleri": getProduct("baslangic-hediye-seti")?.image ?? "",
};

function Index() {
  const { add } = useCart();
  const lite = getProduct("motibot-lite");
  const pro = getProduct("motibot-pro");
  const others = PRODUCTS.filter((p) => p.category !== "robotlar");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero text-navy-foreground">
        <div className="dot-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="container-page relative grid items-center gap-10 py-14 md:grid-cols-2 md:py-24">
          <div className="space-y-6">
            <p className="eyebrow inline-flex items-center gap-2 rounded-full border border-navy-foreground/20 px-3 py-1.5 text-mustard">
              <span className="h-1.5 w-1.5 rounded-full bg-mustard" /> Masaüstü motivasyon robotu
            </p>
            <h1 className="text-5xl font-extrabold leading-[0.95] sm:text-6xl lg:text-7xl">
              Masana <span className="text-mustard">karakter</span> kat.
            </h1>
            <p className="max-w-md text-lg text-navy-foreground/75">
              MotiBot odaklanmanı, mola vermeni ve küçük zaferlerini kutlamayı hatırlatan, masandaki en sevimli çalışma arkadaşı.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="mustard">
                <Link to="/urunler" search={{ kategori: "robotlar" }}>
                  Robotları keşfet <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline-cream">
                <a href="#hikayemiz">Hikâyemiz</a>
              </Button>
            </div>
            <dl className="grid max-w-md grid-cols-3 gap-4 pt-4">
              {[
                ["12K+", "mutlu masa"],
                ["4.9", "ortalama puan"],
                ["%38", "daha uzun odak"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-2xl font-extrabold text-mustard">{v}</dt>
                  <dd className="text-xs text-navy-foreground/60">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-mustard/20 blur-2xl" aria-hidden="true" />
            <img
              src={heroImage}
              alt="Ahşap bir çalışma masasında gülümseyen krem renkli MotiBot"
              className="relative aspect-[4/3] w-full rounded-[2rem] object-cover shadow-lift"
              width={1536}
              height={1024}
            />
            <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-cream p-3 pr-5 text-navy shadow-lift">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mustard">
                <Timer className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Bugünkü odak</p>
                <p className="font-display font-bold">3 sa 25 dk</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-mustard-foreground/70">Kategoriler</p>
            <h2 className="text-3xl font-extrabold text-navy sm:text-4xl">Ne arıyorsun?</h2>
          </div>
          <Link to="/urunler" search={{ kategori: undefined }} className="hidden text-sm font-semibold text-navy hover:underline sm:block">
            Tüm ürünler →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to="/urunler"
              search={{ kategori: c.id }}
              className="group relative overflow-hidden rounded-3xl bg-cream-deep shadow-soft"
            >
              <img src={CATEGORY_IMAGES[c.id]} alt="" className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-card/95 p-3 backdrop-blur">
                <p className="font-display font-bold text-navy">{c.name}</p>
                <p className="hidden text-xs text-muted-foreground sm:block">{c.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured robots */}
      <section className="container-page pb-16">
        <div className="mb-8">
          <p className="eyebrow text-mustard-foreground/70">Öne çıkanlar</p>
          <h2 className="text-3xl font-extrabold text-navy sm:text-4xl">İki robot, tek amaç: odak.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[lite, pro].map((p, idx) =>
            p ? (
              <article
                key={p.id}
                className={
                  idx === 0
                    ? "grid overflow-hidden rounded-[2rem] bg-card shadow-soft sm:grid-cols-2"
                    : "grid overflow-hidden rounded-[2rem] bg-navy text-navy-foreground shadow-soft sm:grid-cols-2"
                }
              >
                <Link to="/urun/$slug" params={{ slug: p.slug }} className="block bg-cream-deep">
                  <img src={p.image} alt={p.name} className="aspect-square h-full w-full object-cover" loading="lazy" />
                </Link>
                <div className="flex flex-col gap-3 p-6">
                  <span className="w-fit rounded-full bg-mustard px-3 py-1 text-xs font-bold text-mustard-foreground">{p.badge}</span>
                  <h3 className="text-2xl font-extrabold">{p.name}</h3>
                  <p className={idx === 0 ? "text-sm text-muted-foreground" : "text-sm text-navy-foreground/70"}>{p.short}</p>
                  <ul className="space-y-1 text-sm">
                    {p.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-mustard" /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                    <span className="font-display text-2xl font-extrabold">{formatPrice(p.price)}</span>
                    <Button
                      variant="mustard"
                      onClick={() => {
                        add(p.id);
                        toast.success(`${p.name} sepete eklendi`);
                      }}
                    >
                      <Plus /> Sepete ekle
                    </Button>
                  </div>
                </div>
              </article>
            ) : null,
          )}
        </div>
      </section>

      {/* Campaign */}
      <section className="container-page pb-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-campaign p-8 text-mustard-foreground shadow-mustard sm:p-12">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-navy/10" aria-hidden="true" />
          <div className="absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-cream/30" aria-hidden="true" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4">
              <p className="eyebrow">Kasım odak kampanyası</p>
              <h2 className="text-3xl font-extrabold sm:text-5xl">
                Odaklanmaya bugün başla, <br className="hidden sm:block" /> %10 indirim bizden.
              </h2>
              <p className="max-w-lg text-base text-mustard-foreground/80">
                Sepette <strong className="rounded-md bg-navy px-2 py-0.5 text-navy-foreground">MOTI10</strong> kodunu kullan,
                tüm ürünlerde %10 indirim kazan. 1.500 TL üzeri siparişlerde kargo bizden.
              </p>
              <Button asChild size="lg" variant="default">
                <Link to="/urunler" search={{ kategori: undefined }}>
                  Alışverişe başla <ArrowRight />
                </Link>
              </Button>
            </div>
            <ul className="grid gap-3">
              {[
                { icon: Gift, t: "MOTI10 ile %10 indirim" },
                { icon: Truck, t: "1.500 TL üzeri ücretsiz kargo" },
                { icon: BellRing, t: "Dijital ürünler anında teslim" },
              ].map(({ icon: Icon, t }) => (
                <li key={t} className="flex items-center gap-3 rounded-2xl bg-cream/70 p-4 font-semibold">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-mustard">
                    <Icon className="h-5 w-5" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Brand story */}
      <section id="hikayemiz" className="container-page scroll-mt-28 pb-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <img
            src={storyImage}
            alt="MotiBot tasarım atölyesinde robot eskizleri ve prototipler"
            className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-soft"
            loading="lazy"
          />
          <div className="space-y-5">
            <p className="eyebrow text-mustard-foreground/70">Marka hikâyemiz</p>
            <h2 className="text-3xl font-extrabold text-navy sm:text-4xl">Bir masa, bir eskiz ve çok fazla dağılan dikkat.</h2>
            <p className="text-muted-foreground">
              MotiBot, İstanbul'da küçük bir atölyede, uzun gecelerde odaklanmakta zorlanan iki tasarımcının fikriyle doğdu.
              Telefon bildirimleri, bitmeyen sekmeler, unutulan molalar… Bize sert bir alarm değil, yanımızda duran sevimli bir
              arkadaş lazımdı.
            </p>
            <p className="text-muted-foreground">
              Yüzlerce eskiz ve onlarca prototipten sonra ortaya çıkan MotiBot; gülümseyen gözleriyle seni çalışmaya davet eden,
              mola vaktini hatırlatan ve hedefini bitirdiğinde seninle sevinen bir masa dostu. Amacımız basit:
              <strong className="text-navy"> her masaya biraz karakter, her güne biraz daha odak.</strong>
            </p>
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                ["2021", "ilk eskiz"],
                ["47", "prototip"],
                ["81", "ile teslimat"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-2xl bg-card p-4 text-center shadow-soft">
                  <p className="font-display text-2xl font-extrabold text-navy">{v}</p>
                  <p className="text-xs text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* More products */}
      <section className="container-page pb-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-mustard-foreground/70">Tamamlayıcılar</p>
            <h2 className="text-3xl font-extrabold text-navy sm:text-4xl">Aksesuarlar, dijital paketler ve hediyeler</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {others.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Social */}
      <section className="container-page">
        <div className="relative overflow-hidden rounded-[2rem] bg-navy p-8 text-navy-foreground sm:p-12">
          <div className="dot-grid absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="space-y-2">
              <p className="eyebrow text-mustard">Topluluğa katıl</p>
              <h2 className="text-3xl font-extrabold sm:text-4xl">MotiBot'un masa maceralarını takip et</h2>
              <p className="text-navy-foreground/70">Odak ipuçları, masa düzenleri ve MotiBot'un en komik anları.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-cream px-5 py-4 font-bold text-navy transition hover:-translate-y-0.5"
              >
                <Instagram className="h-6 w-6" /> Instagram'da takip et
              </a>
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-mustard px-5 py-4 font-bold text-mustard-foreground transition hover:-translate-y-0.5"
              >
                <TikTokIcon className="h-6 w-6" /> TikTok'ta izle
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
