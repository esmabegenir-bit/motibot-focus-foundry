import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProduct, type Product } from "@/lib/products";

export type CartItem = { productId: string; quantity: number };
type CartLine = CartItem & { product: Product };

type CartContextValue = {
  items: CartItem[];
  lines: CartLine[];
  count: number;
  coupon: string;
  setCoupon: (c: string) => void;
  add: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "motibot-cart-v1";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { items?: CartItem[]; coupon?: string };
        setItems((parsed.items ?? []).filter((i) => getProduct(i.productId) && i.quantity > 0));
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

  const add = useCallback((productId: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: Math.min(i.quantity + quantity, 10) } : i,
        );
      }
      return [...prev, { productId, quantity }];
    });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, quantity: Math.min(quantity, 10) } : i)),
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setCoupon("");
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const lines = items.flatMap((i) => {
      const product = getProduct(i.productId);
      return product ? [{ ...i, product }] : [];
    });
    return {
      items,
      lines,
      count: lines.reduce((s, l) => s + l.quantity, 0),
      coupon,
      setCoupon,
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [items, coupon, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
