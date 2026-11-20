import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProduct, type Product } from "@/lib/products";
import { configKey, configName, configPrice, configSummary, motiConfigSchema, type MotiConfig } from "@/lib/customizer";
import liteImg from "@/assets/orig-lite.jpg";
import proImg from "@/assets/orig-pro.jpg";

export type CartItem = { key: string; productId: string; quantity: number; config?: MotiConfig };
export type CartLine = CartItem & { product: Product };

type CartContextValue = {
  items: CartItem[];
  lines: CartLine[];
  count: number;
  coupon: string;
  setCoupon: (c: string) => void;
  add: (productId: string, quantity?: number) => void;
  addCustom: (config: MotiConfig, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

export const CUSTOM_PRODUCT_ID = "kendi-motibot";
const STORAGE_KEY = "motibot-cart-v2";
const CartContext = createContext<CartContextValue | null>(null);

export function customProduct(config: MotiConfig): Product {
  return {
    id: CUSTOM_PRODUCT_ID,
    slug: config.model === "pro" ? "motibot-pro" : "motibot-lite",
    name: configName(config),
    category: "robotlar",
    price: configPrice(config),
    image: config.model === "pro" ? proImg : liteImg,
    short: configSummary(config) || "Standart görünüm",
    description: "",
    features: [],
    digital: false,
  };
}

function lineProduct(i: CartItem): Product | undefined {
  if (i.productId === CUSTOM_PRODUCT_ID) return i.config ? customProduct(i.config) : undefined;
  return getProduct(i.productId);
}

function sanitize(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((r: Partial<CartItem>) => {
    if (!r || typeof r.productId !== "string" || typeof r.quantity !== "number" || r.quantity <= 0) return [];
    if (r.productId === CUSTOM_PRODUCT_ID) {
      const parsed = motiConfigSchema.safeParse(r.config);
      return parsed.success ? [{ key: configKey(parsed.data), productId: CUSTOM_PRODUCT_ID, quantity: r.quantity, config: parsed.data }] : [];
    }
    return getProduct(r.productId) ? [{ key: r.productId, productId: r.productId, quantity: r.quantity }] : [];
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem("motibot-cart-v1");
      if (raw) {
        const parsed = JSON.parse(raw) as { items?: unknown; coupon?: string };
        setItems(sanitize(parsed.items));
        setCoupon(parsed.coupon ?? "");
      }
    } catch {
      // ignore broken storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, coupon }));
  }, [items, coupon, loaded]);

  const upsert = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.key === item.key);
      if (existing) {
        return prev.map((i) => (i.key === item.key ? { ...i, quantity: Math.min(i.quantity + item.quantity, 10) } : i));
      }
      return [...prev, item];
    });
  }, []);

  const add = useCallback((productId: string, quantity = 1) => upsert({ key: productId, productId, quantity }), [upsert]);
  const addCustom = useCallback(
    (config: MotiConfig, quantity = 1) => upsert({ key: configKey(config), productId: CUSTOM_PRODUCT_ID, quantity, config }),
    [upsert],
  );

  const setQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, quantity: Math.min(quantity, 10) } : i)),
    );
  }, []);

  const remove = useCallback((key: string) => setItems((prev) => prev.filter((i) => i.key !== key)), []);
  const clear = useCallback(() => {
    setItems([]);
    setCoupon("");
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const lines = items.flatMap((i) => {
      const product = lineProduct(i);
      return product ? [{ ...i, product }] : [];
    });
    return { items, lines, count: lines.reduce((s, l) => s + l.quantity, 0), coupon, setCoupon, add, addCustom, setQuantity, remove, clear };
  }, [items, coupon, add, addCustom, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
