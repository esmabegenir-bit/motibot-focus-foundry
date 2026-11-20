import { z } from "zod";

// "Kendi MotiBot'unu Yarat" options. Shared by the designer page, cart and server order pricing.
export type Opt = { id: string; label: string; price: number; note?: string };

export const BASE_MODELS = [
  { id: "lite", label: "MotiBot Lite", price: 4499, note: "Öğrenci Serisi" },
  { id: "pro", label: "MotiBot Pro", price: 8999, note: "Home-Office Serisi · Moti-Dock dâhil" },
] as const satisfies readonly Opt[];

export const BODY_COLORS = [
  { id: "krem", label: "Krem", price: 0 },
  { id: "antrasit", label: "Antrasit", price: 0 },
  { id: "uzay-grisi", label: "Uzay grisi", price: 0 },
] as const satisfies readonly Opt[];

export const SKINS = [
  { id: "yok", label: "Kılıf yok", price: 0 },
  { id: "hardal", label: "Hardal Moti-Skin", price: 349 },
  { id: "lacivert", label: "Lacivert Moti-Skin", price: 349 },
  { id: "adacayi", label: "Adaçayı Moti-Skin", price: 349 },
] as const satisfies readonly Opt[];

export const OUTFITS = [
  { id: "yok", label: "Kıyafet yok", price: 0 },
  { id: "atki", label: "Örgü atkı", price: 199 },
  { id: "papyon", label: "Hardal papyon", price: 149 },
] as const satisfies readonly Opt[];

export const HEADPHONES = [
  { id: "yok", label: "Kulaklık yok", price: 0 },
  { id: "mini", label: "Dekoratif mini kulaklık", price: 249, note: "Ses cihazı değildir" },
] as const satisfies readonly Opt[];

export const GLASSES = [
  { id: "yok", label: "Gözlük yok", price: 0 },
  { id: "yuvarlak", label: "Yuvarlak gözlük", price: 149 },
  { id: "gunes", label: "Güneş gözlüğü", price: 149 },
] as const satisfies readonly Opt[];

export const HATS = [
  { id: "yok", label: "Şapka yok", price: 0 },
  { id: "bere", label: "Ponponlu bere", price: 249 },
  { id: "kep", label: "Mezuniyet kepi", price: 249 },
  { id: "parti", label: "Parti şapkası", price: 199 },
] as const satisfies readonly Opt[];

export const SCREEN_THEMES = [
  { id: "standart", label: "Standart ifadeler", price: 0, note: "Ücretsiz" },
  { id: "retro-pixel", label: "Retro Pixel", price: 99 },
  { id: "study-buddy", label: "Study Buddy", price: 99 },
  { id: "minimal-office", label: "Minimal Office", price: 99 },
  { id: "cozy-moti", label: "Cozy Moti", price: 99 },
  { id: "kutlama-paketi", label: "Kutlama Paketi", price: 99 },
] as const satisfies readonly Opt[];

export const SOUND_PACKS = [
  { id: "standart", label: "Standart Türkçe tepkiler", price: 0, note: "Ücretsiz" },
  { id: "oyun", label: "Oyun sesleri", price: 59 },
  { id: "kutuphane", label: "Sakin kütüphane", price: 59 },
  { id: "kutlama", label: "Kutlama sesleri", price: 59 },
] as const satisfies readonly Opt[];

export const NAMEPLATE_PRICE = 199;

const ids = <T extends readonly Opt[]>(arr: T) => arr.map((o) => o.id) as [T[number]["id"], ...T[number]["id"][]];

export const motiConfigSchema = z.object({
  model: z.enum(ids(BASE_MODELS)),
  body: z.enum(ids(BODY_COLORS)),
  skin: z.enum(ids(SKINS)),
  outfit: z.enum(ids(OUTFITS)),
  headphones: z.enum(ids(HEADPHONES)),
  glasses: z.enum(ids(GLASSES)),
  hat: z.enum(ids(HATS)),
  theme: z.enum(ids(SCREEN_THEMES)),
  sound: z.enum(ids(SOUND_PACKS)),
  nameplate: z.string().trim().max(16),
});

export type MotiConfig = z.infer<typeof motiConfigSchema>;

export const DEFAULT_CONFIG: MotiConfig = {
  model: "lite",
  body: "krem",
  skin: "yok",
  outfit: "yok",
  headphones: "yok",
  glasses: "yok",
  hat: "yok",
  theme: "standart",
  sound: "standart",
  nameplate: "",
};

const find = (arr: readonly Opt[], id: string) => arr.find((o) => o.id === id) ?? arr[0]!;

export function configParts(c: MotiConfig): Opt[] {
  const parts: Opt[] = [
    find(BASE_MODELS, c.model),
    find(BODY_COLORS, c.body),
    find(SKINS, c.skin),
    find(OUTFITS, c.outfit),
    find(HEADPHONES, c.headphones),
    find(GLASSES, c.glasses),
    find(HATS, c.hat),
    find(SCREEN_THEMES, c.theme),
    find(SOUND_PACKS, c.sound),
  ];
  if (c.nameplate.trim()) parts.push({ id: "isimlik", label: `Moti-Name isimlik: “${c.nameplate.trim()}”`, price: NAMEPLATE_PRICE });
  return parts;
}

export function configPrice(c: MotiConfig): number {
  return configParts(c).reduce((s, p) => s + p.price, 0);
}

export function configName(c: MotiConfig): string {
  const base = find(BASE_MODELS, c.model).label;
  return c.nameplate.trim() ? `${base} · “${c.nameplate.trim()}”` : `Kişisel ${base}`;
}

export function configSummary(c: MotiConfig): string {
  return configParts(c)
    .slice(1)
    .filter((p) => !p.id.startsWith("yok") && p.id !== "yok" && !(p.price === 0 && (p.id === "standart")))
    .map((p) => p.label)
    .join(", ");
}

export function configKey(c: MotiConfig): string {
  return "custom:" + Object.values(c).join("|");
}
