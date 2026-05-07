import React, { createContext, useContext, useState, useCallback } from "react";
import type { PublicProduct } from "@/lib/publicApi";

export interface CartItem {
  product: PublicProduct;
  quantity: number;
  notes?: string;
}

interface CartContextValue {
  items: CartItem[];
  total: number;
  count: number;
  add: (product: PublicProduct, qty?: number) => void;
  remove: (productId: string) => void;
  update: (productId: string, qty: number) => void;
  clear: () => void;
  isOpen: boolean;
  setOpen: (v: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);

  const add = useCallback((product: PublicProduct, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, { product, quantity: qty }];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const update = useCallback((productId: string, qty: number) => {
    if (qty <= 0) { remove(productId); return; }
    setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i));
  }, [remove]);

  const clear = useCallback(() => setItems([]), []);

  const total = items.reduce((s, i) => s + (i.product.promotional_price ?? i.product.sale_price) * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, total, count, add, remove, update, clear, isOpen, setOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
