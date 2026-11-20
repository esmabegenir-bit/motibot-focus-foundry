import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LovableMark } from "@lovable.dev/cloud-auth-js/react";
import heroImage from "@/assets/motibot-lite.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

type Search = { redirect?: string | undefined; mode?: "giris" | "kayit" | undefined };

function safeRedirect(value: string | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/hesabim";
  return value;
}

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const out: Search = {};
    if (typeof s["redirect"] === "string") out.redirect = s["redirect"];
    if (s["mode"] === "giris" || s["mode"] === "kayit") out.mode = s["mode"];
    return out;
  },
  head: () => ({
    meta: [
      { title: "Giriş yap veya kayıt ol · MotiBot" },
      { name: "description", content: "MotiBot hesabına giriş yap ya da yeni hesap oluştur." },
      { property: "og:title", content: "Giriş yap · MotiBot" },
      { property: "og:description", content: "MotiBot hesabına giriş yap ya da yeni hesap oluştur." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const GOOGLE_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" width="18" height="18">
    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
    <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
  </svg>
);

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { user, ready } = useAuth();
  const [mode, setMode] = useState<"giris" | "kayit">(search.mode ?? "giris");
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const target = safeRedirect(search.redirect);

  useEffect(() => {
    if (ready && user) void navigate({ to: target, replace: true });
  }, [ready, user, navigate, target]);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "kayit") {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { emailRedirectTo: window.location.origin + target, data: { full_name: form.fullName } },
        });
        if (error) throw error;
        if (!data.session) setSentTo(form.email);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) throw error;
        toast.success("Tekrar hoş geldin!");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Bir hata oluştu";
      toast.error(
        msg.includes("Invalid login") ? "E-posta veya şifre hatalı" : msg.includes("already registered") ? "Bu e-posta zaten kayıtlı" : msg,
      );
    } finally {
      setBusy(false);
    }
  }

  async function social(provider: "google" | "lovable") {
    if (search.redirect) window.sessionStorage.setItem("motibot-after-login", target);
    const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin + "/auth" });
    if (result.error) toast.error("Giriş yapılamadı, lütfen tekrar deneyin.");
  }

  useEffect(() => {
    if (ready && user) {
      const stored = window.sessionStorage.getItem("motibot-after-login");
      if (stored) {
        window.sessionStorage.removeItem("motibot-after-login");
        void navigate({ to: safeRedirect(stored), replace: true });
      }
    }
  }, [ready, user, navigate]);

  async function forgot() {
    if (!form.email) {
      toast.error("Önce e-posta adresini yaz");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: `${window.location.origin}/sifre-sifirla`,
    });
    if (error) toast.error(error.message);
    else toast.success("Şifre sıfırlama bağlantısı e-postana gönderildi");
  }

  return (
    <div className="container-page grid min-h-[75vh] items-center gap-10 py-10 md:grid-cols-2">
      <div className="hidden overflow-hidden rounded-[2rem] bg-cream-deep shadow-soft md:block">
        <img src={heroImage} alt="MotiBot Lite" className="aspect-square w-full object-cover" />
      </div>
      <div className="mx-auto w-full max-w-md">
        {sentTo ? (
          <div className="space-y-4 rounded-3xl bg-card p-8 text-center shadow-soft">
            <h1 className="text-2xl font-extrabold text-navy">E-postanı kontrol et</h1>
            <p className="text-muted-foreground">
              <strong className="text-foreground">{sentTo}</strong> adresine bir onay bağlantısı gönderdik. Bağlantıya tıkladığında hesabın açılacak.
            </p>
            <Button variant="outline" onClick={() => { setSentTo(null); setMode("giris"); }}>Giriş ekranına dön</Button>
          </div>
        ) : (
          <div className="space-y-6 rounded-3xl bg-card p-6 shadow-soft sm:p-8">
            <div>
              <h1 className="text-3xl font-extrabold text-navy">{mode === "giris" ? "Tekrar hoş geldin" : "Aramıza katıl"}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === "giris" ? "Siparişlerini görmek ve ödeme yapmak için giriş yap." : "Hesap oluştur, siparişlerini kolayca takip et."}
              </p>
            </div>
            <div className="grid grid-cols-2 rounded-full bg-muted p-1">
              {(["giris", "kayit"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={cn(
                    "rounded-full py-2 text-sm font-semibold transition",
                    mode === m ? "bg-navy text-navy-foreground shadow-soft" : "text-muted-foreground",
                  )}
                >
                  {m === "giris" ? "Giriş yap" : "Kayıt ol"}
                </button>
              ))}
            </div>
            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => void social("google")}
                className="inline-flex h-11 items-center justify-center gap-[10px] btn-google rounded-full px-3 text-sm font-medium"
              >
                {GOOGLE_SVG}
                Continue with Google
              </button>
              <Button type="button" variant="outline" className="h-11" onClick={() => void social("lovable")}>
                <LovableMark />
                Continue with Lovable
              </Button>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> veya e-posta ile <span className="h-px flex-1 bg-border" />
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              {mode === "kayit" && (
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Ad soyad</Label>
                  <Input id="fullName" required minLength={3} value={form.fullName} onChange={update("fullName")} className="h-11 rounded-xl" autoComplete="name" />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">E-posta</Label>
                <Input id="email" type="email" required value={form.email} onChange={update("email")} className="h-11 rounded-xl" autoComplete="email" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Şifre</Label>
                  {mode === "giris" && (
                    <button type="button" onClick={() => void forgot()} className="text-xs font-semibold text-navy hover:underline">
                      Şifremi unuttum
                    </button>
                  )}
                </div>
                <Input id="password" type="password" required minLength={6} value={form.password} onChange={update("password")} className="h-11 rounded-xl" autoComplete={mode === "giris" ? "current-password" : "new-password"} />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={busy}>
                {busy ? "Lütfen bekle…" : mode === "giris" ? "Giriş yap" : "Hesap oluştur"}
              </Button>
            </form>
            <p className="text-center text-xs text-muted-foreground">
              Devam ederek <Link to="/" className="underline">MotiBot</Link> kullanım koşullarını kabul edersin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
