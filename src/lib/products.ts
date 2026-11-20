import motibotLite from "@/assets/motibot-lite.jpg";
import motibotPro from "@/assets/motibot-pro.jpg";
import chargingStand from "@/assets/charging-stand.jpg";
import coverShells from "@/assets/cover-shells.jpg";
import digitalFocusPack from "@/assets/digital-focus-pack.jpg";
import digitalMembership from "@/assets/digital-membership.jpg";
import giftStarter from "@/assets/gift-starter.jpg";
import giftOffice from "@/assets/gift-office.jpg";

export type CategoryId = "robotlar" | "aksesuarlar" | "dijital-urunler" | "hediye-setleri";

export const CATEGORIES: { id: CategoryId; name: string; tagline: string }[] = [
  { id: "robotlar", name: "Robotlar", tagline: "Masandaki yeni çalışma arkadaşın" },
  { id: "aksesuarlar", name: "Aksesuarlar", tagline: "Robotunu kendi tarzına göre giydir" },
  { id: "dijital-urunler", name: "Dijital Ürünler", tagline: "Yeni sesler, yeni rutinler" },
  { id: "hediye-setleri", name: "Hediye Setleri", tagline: "Sevdiklerinin masasına karakter kat" },
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
  {
    id: "motibot-lite",
    slug: "motibot-lite",
    name: "MotiBot Lite",
    category: "robotlar",
    price: 4499,
    image: motibotLite,
    short: "Kompakt, sevimli ve tam odak modunda.",
    description:
      "MotiBot Lite, masanın köşesinde seni bekleyen küçük bir motivasyon koçu. Pomodoro zamanlayıcısıyla çalışma ve mola sürelerini yönetir, su içmeyi ve esnemeyi hatırlatır, hedefini tamamladığında gözleriyle gülümser. Yeni başlayanlar ve öğrenciler için ideal.",
    features: [
      "Dahili Pomodoro zamanlayıcı",
      "Su ve mola hatırlatıcıları",
      "30+ yüz ifadesi",
      "USB-C ile 3 gün pil ömrü",
    ],
    digital: false,
    badge: "Çok satan",
  },
  {
    id: "motibot-pro",
    slug: "motibot-pro",
    name: "MotiBot Pro",
    category: "robotlar",
    price: 8999,
    image: motibotPro,
    short: "Hareketli kollar, sesli komut ve akıllı odak takibi.",
    description:
      "MotiBot Pro, odaklanmayı oyuna çeviren ileri seviye masaüstü robot. Hareketli kolları ve ışık halkasıyla durumunu gösterir, sesli komutlarla zamanlayıcı başlatır, telefon uygulamasıyla günlük odak raporu çıkarır. Uzaktan çalışanlar, yazılımcılar ve tasarımcılar için.",
    features: [
      "Sesli komut desteği",
      "Hareketli kollar ve ışık halkası",
      "Günlük ve haftalık odak raporu",
      "Takvim entegrasyonu",
      "Kablosuz şarj uyumlu",
    ],
    digital: false,
    badge: "Yeni",
  },
  {
    id: "ahsap-sarj-standi",
    slug: "ahsap-sarj-standi",
    name: "Ceviz Şarj Standı",
    category: "aksesuarlar",
    price: 749,
    image: chargingStand,
    short: "Masana yakışan kablosuz şarj yuvası.",
    description:
      "Doğal ceviz ağacından üretilen bu stant, MotiBot'unu kablosuz olarak şarj eder ve göz hizasına yükseltir. Kumaş kaplı yüzeyi masanı çizmez.",
    features: ["Doğal ceviz ağacı", "Kablosuz şarj", "Lite ve Pro ile uyumlu"],
    digital: false,
  },
  {
    id: "renkli-kilif-seti",
    slug: "renkli-kilif-seti",
    name: "Renkli Kılıf Seti",
    category: "aksesuarlar",
    price: 399,
    image: coverShells,
    short: "Hardal, lacivert ve kiremit: 3'lü silikon kılıf.",
    description:
      "Robotunun tarzını ruh haline göre değiştir. Yumuşak silikon kılıflar saniyeler içinde takılır, darbelere karşı da korur.",
    features: ["3 renk", "Yumuşak silikon", "MotiBot Lite ile uyumlu"],
    digital: false,
  },
  {
    id: "odak-ses-paketi",
    slug: "odak-ses-paketi",
    name: "Odak Ses ve Animasyon Paketi",
    category: "dijital-urunler",
    price: 199,
    image: digitalFocusPack,
    short: "40 yeni ses, 25 yeni yüz animasyonu.",
    description:
      "Yağmur, kafe uğultusu, kütüphane sessizliği… Odaklanmana yardım eden 40 ambiyans sesi ve robotuna 25 yeni yüz ifadesi. Satın aldıktan sonra uygulama üzerinden anında yüklenir.",
    features: ["Anında teslim", "40 ambiyans sesi", "25 animasyon"],
    digital: true,
  },
  {
    id: "moti-plus-uyelik",
    slug: "moti-plus-uyelik",
    name: "Moti+ Yıllık Üyelik",
    category: "dijital-urunler",
    price: 599,
    image: digitalMembership,
    short: "Gelişmiş raporlar, hedefler ve her ay yeni içerik.",
    description:
      "Moti+ ile odak istatistiklerini detaylı incele, haftalık hedefler koy, arkadaşlarınla odak yarışlarına katıl. Her ay yeni ses ve animasyon paketi hediye.",
    features: ["12 ay erişim", "Gelişmiş raporlar", "Aylık yeni içerik"],
    digital: true,
  },
  {
    id: "baslangic-hediye-seti",
    slug: "baslangic-hediye-seti",
    name: "Başlangıç Hediye Seti",
    category: "hediye-setleri",
    price: 5299,
    image: giftStarter,
    short: "MotiBot Lite, mini stant ve el yazısı kart.",
    description:
      "İlk MotiBot deneyimi için hazırlanmış özel kutu. İçinde MotiBot Lite, mini ceviz stant ve kişisel notunu yazabileceğin bir kart var. Mezuniyet, doğum günü ve yeni iş hediyesi olarak harika.",
    features: ["MotiBot Lite", "Mini ceviz stant", "Hediye kartı", "Özel kutu"],
    digital: false,
  },
  {
    id: "ofis-hediye-seti",
    slug: "ofis-hediye-seti",
    name: "Ofis Hediye Seti",
    category: "hediye-setleri",
    price: 9799,
    image: giftOffice,
    short: "MotiBot Pro, 4 renkli kılıf ve odak defteri.",
    description:
      "Ekip arkadaşlarına ya da kendine büyük bir jest: MotiBot Pro, 4 renkli kılıf ve lacivert odak defteri şık bir hediye kutusunda.",
    features: ["MotiBot Pro", "4 renkli kılıf", "Odak defteri", "Kurumsal kutu"],
    digital: false,
    badge: "Hediye",
  },
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
