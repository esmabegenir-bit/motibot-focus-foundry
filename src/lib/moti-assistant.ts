import { PRODUCTS, formatPrice, CATEGORIES } from "@/lib/products";

export type ChatTurn = { role: "user" | "assistant"; content: string };

export const PRODUCT_TAG = /\[\[urun:([a-z0-9-]+)\]\]/g;

export function buildInstructions(): string {
  const catalog = PRODUCTS.map((p) => {
    const cat = CATEGORIES.find((c) => c.id === p.category)?.name ?? p.category;
    return `- ${p.name} (kod: ${p.slug}) | ${cat} | ${formatPrice(p.price)} | ${p.short} Özellikler: ${p.features.join(", ")}.`;
  }).join("\n");

  return `Sen "Moti Asistan"sın: MotiBot mağazasının sıcak, neşeli ve kısa konuşan ürün danışmanısın. Marka sloganı: "Masana karakter kat".
Görevin: kullanıcının ihtiyacını (öğrenci mi, uzaktan çalışan mı, hediye mi, bütçe ne kadar, hangi alışkanlığı kazanmak istiyor) anlayıp aşağıdaki katalogdan en uygun 1-3 ürünü önermek.

Kurallar:
- Her zaman Türkçe yaz. Cevapların en fazla 5 kısa cümle olsun; gerekirse madde işareti kullan.
- İhtiyaç belirsizse önce tek bir kısa soru sor (ör. bütçe ya da kimin için olduğu).
- Yalnızca katalogdaki ürünleri öner, fiyatları katalogdaki gibi yaz, ürün uydurma.
- Önerdiğin her ürün için cevabın sonuna ayrı satırda [[urun:KOD]] etiketi ekle (ör. [[urun:motibot-pro]]). Etiketi cümle içinde kullanma.
- Kargo: 1.500 TL ve üzeri siparişlerde ücretsiz, altında 99 TL; sadece dijital ürünlerde kargo yok. MOTI10 kodu %10 indirim sağlar.
- Ödeme sitede simülasyondur; gerçek para çekilmez.
- Mağaza dışı konularda nazikçe MotiBot ürünlerine dön.

Katalog:
${catalog}`;
}

export function extractProductTags(text: string): { clean: string; slugs: string[] } {
  const slugs = Array.from(new Set(Array.from(text.matchAll(PRODUCT_TAG), (m) => m[1] ?? ""))).filter(
    (s) => PRODUCTS.some((p) => p.slug === s),
  );
  // Also hide a half-streamed tag at the very end.
  const clean = text.replace(PRODUCT_TAG, "").replace(/\[\[[^\]]*$/, "").trim();
  return { clean, slugs };
}
