import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatPrice, getCategory, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
      <Link to="/urun/$slug" params={{ slug: product.slug }} className="relative block aspect-square overflow-hidden bg-cream-deep">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-mustard px-3 py-1 text-xs font-bold text-mustard-foreground">
            {product.badge}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="eyebrow text-muted-foreground">{getCategory(product.category)?.name}</p>
        <Link to="/urun/$slug" params={{ slug: product.slug }}>
          <h3 className="text-lg font-bold leading-tight text-navy">{product.name}</h3>
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.short}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-xl font-extrabold text-navy">{formatPrice(product.price)}</span>
          <Button
            size="sm"
            variant="mustard"
            className="h-10 px-4"
            onClick={() => {
              add(product.id);
              toast.success(`${product.name} sepete eklendi`);
            }}
          >
            <Plus /> Sepete ekle
          </Button>
        </div>
      </div>
    </article>
  );
}
