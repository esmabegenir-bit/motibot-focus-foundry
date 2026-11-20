import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/sifre-sifirla")({
  head: () => ({
    meta: [
      { title: "Yeni şifre belirle · MotiBot" },
      { name: "description", content: "MotiBot hesabın için yeni şifre belirle." },
      { property: "og:title", content: "Yeni şifre belirle · MotiBot" },
      { property: "og:description", content: "MotiBot hesabın için yeni şifre belirle." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error("Şifre güncellenemedi. Bağlantının süresi dolmuş olabilir.");
      return;
    }
    toast.success("Şifren güncellendi");
    void navigate({ to: "/hesabim" });
  }

  return (
    <div className="container-page flex min-h-[60vh] items-center justify-center py-12">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-5 rounded-3xl bg-card p-8 shadow-soft">
        <h1 className="text-2xl font-extrabold text-navy">Yeni şifreni belirle</h1>
        <div className="space-y-1.5">
          <Label htmlFor="new-password">Yeni şifre</Label>
          <Input id="new-password" type="password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-xl" autoComplete="new-password" />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? "Kaydediliyor…" : "Şifreyi güncelle"}
        </Button>
      </form>
    </div>
  );
}
