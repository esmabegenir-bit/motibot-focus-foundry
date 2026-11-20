import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/site/ProductCard";
import { CATEGORIES, PRODUCTS, getCategory, type CategoryId } from "@/lib/products";
import { cn } from "@/lib/utils";

type Search = { kategori?: CategoryId | undefined };

export const Route = createFileRoute("/urunler")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const k = search["kategori"];
    return typeof k === "string" && CATEGORIES.some((c) => c.id === k) ? { kategori: k as CategoryId } : {};
  },
  head: () => ({
    meta: [
      { title: "Ürünler · MotiBot" },
      { name: "description", content: "MotiBot robotları, aksesuarları, dijital ürünleri ve hediye setleri." },
      { property: "og:title", content: "Ürünler · MotiBot" },
      { property: "og:description", content: "Robotlar, aksesuarlar, dijital ürünler ve hediye setleri tek yerde." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { kategori } = Route.useSearch();
  const category = kategori ? getCategory(kategori) : undefined;
  const list = kategori ? PRODUCTS.filter((p) => p.category === kategori) : PRODUCTS;

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-8 space-y-2">
        <p className="eyebrow text-mustard-foreground/70">Mağaza</p>
        <h1 className="text-4xl font-extrabold text-navy sm:text-5xl">{category?.name ?? "Tüm ürünler"}</h1>
        <p className="text-muted-foreground">{category?.tagline ?? "Masana karakter katacak her şey burada."}</p>
      </div>

      <div className="-mx-5 mb-8 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
        <Link
          to="/urunler"
          search={{ kategori: undefined }}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition",
            !kategori ? "border-navy bg-navy text-navy-foreground" : "border-border bg-card text-navy hover:border-navy",
          )}
        >
          Tümü
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            to="/urunler"
            search={{ kategori: c.id }}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition",
              kategori === c.id ? "border-navy bg-navy text-navy-foreground" : "border-border bg-card text-navy hover:border-navy",
            )}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
