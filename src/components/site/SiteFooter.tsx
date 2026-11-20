import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";
import { CATEGORIES } from "@/lib/products";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-navy-deep text-navy-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo tone="cream" />
          <p className="max-w-sm text-sm text-navy-foreground/70">
            Masana karakter kat. Odaklanmayı, mola vermeyi ve küçük zaferleri kutlamayı hatırlatan masaüstü robotlar.
          </p>
          <SocialLinks />
        </div>
        <div>
          <h3 className="eyebrow mb-4 text-mustard">Kategoriler</h3>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link to="/urunler" search={{ kategori: c.id }} className="text-navy-foreground/80 hover:text-mustard">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="eyebrow mb-4 text-mustard">Hesap</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/hesabim" className="text-navy-foreground/80 hover:text-mustard">Hesabım</Link></li>
            <li><Link to="/sepet" className="text-navy-foreground/80 hover:text-mustard">Sepetim</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-foreground/10">
        <p className="container-page py-5 text-xs text-navy-foreground/50">
          © {new Date().getFullYear()} MotiBot · Bu sitedeki ödemeler simülasyondur, gerçek para çekilmez.
        </p>
      </div>
    </footer>
  );
}
