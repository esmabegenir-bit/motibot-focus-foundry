import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, UserRound } from "lucide-react";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { CATEGORIES } from "@/lib/products";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function SiteHeader() {
  const { count } = useCart();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="bg-navy text-navy-foreground">
        <p className="container-page py-1.5 text-center text-xs font-medium">
          1.500 TL üzeri <span className="text-mustard">ücretsiz kargo</span> · İlk siparişe{" "}
          <span className="font-bold text-mustard">MOTI10</span> ile %10 indirim
        </p>
      </div>
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menüyü aç">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background">
              <SheetHeader>
                <SheetTitle className="font-display text-navy">Menü</SheetTitle>
              </SheetHeader>
              <nav className="mt-2 flex flex-col gap-1 px-4">
                <Link to="/urunler" search={{ kategori: undefined }} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 font-semibold hover:bg-muted">
                  Tüm ürünler
                </Link>
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.id}
                    to="/urunler"
                    search={{ kategori: c.id }}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-3 font-semibold hover:bg-muted"
                  >
                    {c.name}
                  </Link>
                ))}
                <Link to="/hesabim" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 font-semibold hover:bg-muted">
                  {user ? "Hesabım" : "Giriş yap / Kayıt ol"}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Logo />
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to="/urunler"
              search={{ kategori: c.id }}
              className="rounded-full px-3 py-2 text-sm font-semibold text-foreground/80 transition hover:bg-muted hover:text-foreground"
              activeProps={{ className: "bg-muted text-foreground" }}
              activeOptions={{ includeSearch: true }}
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {user ? (
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/hesabim">
                <UserRound /> Hesabım
              </Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/auth" search={{ redirect: undefined, mode: undefined }}>
                <UserRound /> Giriş yap
              </Link>
            </Button>
          )}
          <Button asChild variant="default" size="sm" className="relative h-10 px-4">
            <Link to="/sepet" aria-label={`Sepet, ${count} ürün`}>
              <ShoppingBag />
              <span className="hidden sm:inline">Sepet</span>
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-mustard px-1 text-[11px] font-bold text-mustard-foreground">
                  {count}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
