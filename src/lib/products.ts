import lite from "@/assets/orig-lite.jpg";
import pro from "@/assets/orig-pro.jpg";
import skin from "@/assets/orig-skin.jpg";
import style from "@/assets/orig-style.jpg";
import name from "@/assets/orig-name.jpg";
import dock from "@/assets/orig-dock.jpg";
import mcase from "@/assets/orig-case.jpg";
import tRetro from "@/assets/theme-retro.jpg";
import tStudy from "@/assets/theme-study.jpg";
import tMinimal from "@/assets/theme-minimal.jpg";
import tCozy from "@/assets/theme-cozy.jpg";
import tKutlama from "@/assets/theme-kutlama.jpg";
import sKampus from "@/assets/set-kampus.jpg";
import sCalisma from "@/assets/set-calisma.jpg";
import sIlk from "@/assets/set-ilk-moti.jpg";

export type CategoryId = "robotlar" | "aksesuarlar" | "dijital-urunler" | "hediye-setleri";

export const CATEGORIES: { id: CategoryId; name: string; tagline: string }[] = [
  { id: "robotlar", name: "Robotlar", tagline: "Motibot Lite ve Pro · Öğrenci ve Home-Office serileri" },
  { id: "aksesuarlar", name: "Moti-Wear & Aksesuarlar", tagline: "Moti'ni kendine göre tasarla" },
  { id: "dijital-urunler", name: "Moti-Themes", tagline: "Ekran görünümü, animasyon ve isteğe bağlı sesler" },
  { id: "hediye-setleri", name: "Hediye Setleri", tagline: "Bir kutu dolusu arkadaşlık" },
];

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  price: number;
  image: string;
  short: string;
  description: string;
  features: string[];
  digital: boolean;
  badge?: string;
};

export const PRODUCTS: Product[] = [
  { id: "motibot-lite", slug: "motibot-lite", name: "MotiBot Lite", category: "robotlar", price: 4499, image: lite,
    short: "Öğrenci Serisi · Ders çalışırken odaklanmana yardım eden masa arkadaşı.",
    description: "MotiBot Lite, öğrenci masası için tasarlanan sabit masaüstü robot. Dokunmaya tepki verir, ifadeli ekranıyla Türkçe hazır tepkiler ve motivasyon mesajları gösterir. Ayarlanabilir Pomodoro sayacı, sessiz kütüphane modu ve “Çalışıyorum / Moladayım” durum ekranıyla ders rutinini keyifli hale getirir. Renk seçenekleri: antrasit, krem, uzay grisi.",
    features: ["Ayarlanabilir Pomodoro", "Dokunmaya tepki", "Türkçe hazır tepkiler", "Sesli tebrik", "Sessiz kütüphane modu", "Çalışıyorum / Moladayım", "Daha erişilebilir model"],
    digital: false, badge: "Öğrenci Serisi" },
  { id: "motibot-pro", slug: "motibot-pro", name: "MotiBot Pro", category: "robotlar", price: 8999, image: pro,
    short: "Home-Office Serisi · Türkçe AI sohbetli akıllı masa arkadaşı.",
    description: "MotiBot Pro, evden çalışanlar için sabit masaüstü robot. Lite'ın tüm özelliklerine ek olarak Türkçe yapay zekâ sohbeti, kişisel odak ve mola planı, hedeflere özel tepkiler ve sessiz toplantı modu sunar. Ekranında “Toplantıdayım / Odaktayım / Müsaitim” durumunu gösterir. Moti-Dock kutuya dâhildir. Durum seçimi uygulamadan yapılır.",
    features: ["Lite özelliklerine ek olarak", "Türkçe AI sohbet", "Kişisel odak ve mola planı", "Hedeflere özel tepkiler", "Sessiz toplantı modu", "Toplantıdayım / Odaktayım / Müsaitim", "Moti-Dock kutuya dâhil"],
    digital: false, badge: "Home-Office Serisi" },
  { id: "moti-skin", slug: "moti-skin", name: "Moti-Skin Silikon Kılıf", category: "aksesuarlar", price: 349, image: skin,
    short: "Sensör ve hoparlör alanları açık, değiştirilebilir kılıflar.",
    description: "Moti'nin rengini ruh haline göre değiştir. Hardal, lacivert ve adaçayı yeşili seçenekleri olan silikon kılıflar sensör ve hoparlör alanlarını açık bırakır.",
    features: ["Hardal, lacivert, adaçayı", "Sensör ve hoparlör alanları açık", "Kolay takılır"], digital: false },
  { id: "moti-style", slug: "moti-style", name: "Moti-Style Şapka & Mini Kulaklık", category: "aksesuarlar", price: 249, image: style,
    short: "Mevsimlik şapkalar ve dekoratif mini kulaklıklar.",
    description: "Ponponlu bere, mezuniyet kepi, parti şapkası ve dekoratif mini kulaklıkla Moti'ye karakter kat. Kulaklık aksesuarı ses cihazı değildir.",
    features: ["Mevsimlik şapkalar", "Dekoratif mini kulaklık", "Kulaklık ses cihazı değildir"], digital: false },
  { id: "moti-name", slug: "moti-name", name: "Moti-Name İsimlik", category: "aksesuarlar", price: 199, image: name,
    short: "Robotuna verdiğin isim, standında.",
    description: "Moti'ne verdiğin ismi standına tak. Kişisel bir masa arkadaşı için küçük ama anlamlı bir dokunuş.",
    features: ["Kişiye özel isim", "Stand üzerine takılır"], digital: false },
  { id: "moti-dock", slug: "moti-dock", name: "Moti-Dock Şarj Standı", category: "aksesuarlar", price: 749, image: dock,
    short: "Manyetik hizalama · Temaslı şarj · Kaymaz taban.",
    description: "Moti-Dock, robotu manyetik olarak hizalar ve temaslı şarj eder; kaymaz tabanıyla masada sabit durur. Pro kutusuna dâhildir, Lite için isteğe bağlıdır. Lite'ın temel şarj kablosu kutuya dâhildir.",
    features: ["Manyetik hizalama", "Temaslı şarj", "Kaymaz taban", "Pro kutusuna dâhil · Lite için isteğe bağlı"], digital: false },
  { id: "moti-case", slug: "moti-case", name: "Moti-Case Taşıma Çantası", category: "aksesuarlar", price: 549, image: mcase,
    short: "Robot ve kablo için koruyucu bölmeler.",
    description: "Moti'yi kampüse ya da ofise güvenle taşı. İç bölmeler robotu ve kabloyu ayrı ayrı korur.",
    features: ["Koruyucu bölmeler", "Fermuarlı sert kutu"], digital: false },
  { id: "retro-pixel", slug: "retro-pixel", name: "Moti-Theme · Retro Pixel", category: "dijital-urunler", price: 99, image: tRetro,
    short: "Piksel gözler ve oyun sesleri.", description: "Moti'nin ekranını piksel gözlerle ve isteğe bağlı oyun sesleriyle yenile. Uygulamadan anında yüklenir.",
    features: ["Piksel gözler", "Oyun sesleri", "Uygulamadan yüklenir"], digital: true },
  { id: "study-buddy", slug: "study-buddy", name: "Moti-Theme · Study Buddy", category: "dijital-urunler", price: 99, image: tStudy,
    short: "Odak sayacı ve Türkçe teşvikler.", description: "Ders çalışırken odak sayacını ve Türkçe teşvik mesajlarını öne çıkaran tema.",
    features: ["Odak sayacı", "Türkçe teşvikler"], digital: true },
  { id: "minimal-office", slug: "minimal-office", name: "Moti-Theme · Minimal Office", category: "dijital-urunler", price: 99, image: tMinimal,
    short: "Sade saat ve durum ekranı.", description: "Home-office masası için sade saat ve “Odaktayım” gibi durum ekranları.",
    features: ["Sade saat", "Durum ekranı"], digital: true },
  { id: "cozy-moti", slug: "cozy-moti", name: "Moti-Theme · Cozy Moti", category: "dijital-urunler", price: 99, image: tCozy,
    short: "Sakin mola animasyonları.", description: "Mola vakitlerinde sakinleştiren, yumuşak animasyonlar.",
    features: ["Sakin mola animasyonları"], digital: true },
  { id: "kutlama-paketi", slug: "kutlama-paketi", name: "Moti-Theme · Kutlama Paketi", category: "dijital-urunler", price: 99, image: tKutlama,
    short: "Doğum günü ve hedef kutlamaları.", description: "Doğum günlerinde ve hedefini tamamladığında Moti seninle kutlasın.",
    features: ["Doğum günü kutlaması", "Hedef kutlamaları"], digital: true },
  { id: "kampus-seti", slug: "kampus-seti", name: "Kampüs Seti", category: "hediye-setleri", price: 4799, image: sKampus,
    short: "Lite + silikon kılıf + Study Buddy.", description: "Üniversite öğrencileri için hazır set: MotiBot Lite, bir Moti-Skin silikon kılıf ve Study Buddy teması.",
    features: ["MotiBot Lite", "Moti-Skin silikon kılıf", "Study Buddy teması"], digital: false, badge: "Öğrenciye" },
  { id: "calisma-masam-seti", slug: "calisma-masam-seti", name: "Çalışma Masam Seti", category: "hediye-setleri", price: 9299, image: sCalisma,
    short: "Pro + kutuya dâhil Dock + isimlik + Minimal Office.", description: "Home-office için: MotiBot Pro, kutuya dâhil Moti-Dock, Moti-Name isimlik ve Minimal Office teması.",
    features: ["MotiBot Pro", "Moti-Dock (kutuya dâhil)", "Moti-Name isimlik", "Minimal Office teması"], digital: false },
  { id: "ilk-motim-hediye-seti", slug: "ilk-motim-hediye-seti", name: "İlk Moti'm Hediye Seti", category: "hediye-setleri", price: 4899, image: sIlk,
    short: "Seçilen robot + isimlik + hediye kutusu + kişisel not.", description: "Doğum günü, mezuniyet ve yeni iş için kişisel bir hediye: MotiBot Lite, Moti-Name isimlik, hediye kutusu ve kişisel not kartı.",
    features: ["MotiBot Lite", "Moti-Name isimlik", "Hediye kutusu", "Kişisel not"], digital: false, badge: "Hediye" },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug || p.id === slug);
}

export function getCategory(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}

const tl = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export function formatPrice(value: number): string {
  return `${tl.format(value)} TL`;
}
