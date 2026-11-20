import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { useCart } from "@/lib/cart";
import { PRODUCTS, formatPrice, getCategory, getProduct } from "@/lib/products";

export const Route = createFileRoute("/urun/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { slug: product.slug, name: product.name, short: product.short };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} · MotiBot` },
          { name: "description", content: loaderData.short },
          { property: "og:title", content: `${loaderData.name} · MotiBot` },
          { property: "og:description", content: loaderData.short },
          { property: "og:type", content: "product" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Ürün bulunamadı · MotiBot" }, { name: "robots", content: "noindex" }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useLoaderData();
  const product = getProduct(slug);
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  if (!product) return null;
  const related = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).concat(
    PRODUCTS.filter((p) => p.category !== product.category),
  ).slice(0, 3);

  return (
    <div className="container-page py-8 sm:py-12">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link to="/urunler" search={{ kategori: undefined }} className="hover:text-navy">Ürünler</Link>
        {" / "}
        <Link to="/urunler" search={{ kategori: product.category }} className="hover:text-navy">
          {getCategory(product.category)?.name}
        </Link>
      </nav>
      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-[2rem] bg-cream-deep shadow-soft">
          <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-mustard px-3 py-1 text-xs font-bold text-mustard-foreground">
              {product.badge}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-5">
          <div>
            <p className="eyebrow text-mustard-foreground/70">{getCategory(product.category)?.name}</p>
            <h1 className="mt-1 text-4xl font-extrabold text-navy sm:text-5xl">{product.name}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{product.short}</p>
          </div>
          <p className="font-display text-4xl font-extrabold text-navy">{formatPrice(product.price)}</p>
          <p className="leading-relaxed text-foreground/80">{product.description}</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm font-medium">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mustard text-mustard-foreground">
                  <Check className="h-3 w-3" />
                </span>
                {f}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center rounded-full border border-border bg-card">
              <Button variant="ghost" size="icon" aria-label="Azalt" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                <Minus />
              </Button>
              <span className="w-8 text-center font-bold" aria-live="polite">{qty}</span>
              <Button variant="ghost" size="icon" aria-label="Arttır" onClick={() => setQty((q) => Math.min(10, q + 1))}>
                <Plus />
              </Button>
            </div>
            <Button
              size="lg"
              variant="mustard"
              className="flex-1 sm:flex-none"
              onClick={() => {
                add(product.id, qty);
                toast.success(`${qty} adet ${product.name} sepete eklendi`, {
                  action: { label: "Sepete git", onClick: () => (window.location.href = "/sepet") },
                });
              }}
            >
              <Plus /> Sepete ekle
            </Button>
          </div>
          <div className="grid gap-3 rounded-2xl bg-card p-4 text-sm shadow-soft sm:grid-cols-2">
            <p className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-mustard" />
              {product.digital ? "Dijital teslim, kargo yok" : "1.500 TL üzeri ücretsiz kargo"}
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-mustard" /> 2 yıl MotiBot garantisi
            </p>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-extrabold text-navy">Bunlar da hoşuna gidebilir</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
