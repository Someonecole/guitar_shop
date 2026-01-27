import React, { createContext, useContext, useMemo, useState } from "react";

const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const raw = localStorage.getItem("cart");
    return raw ? JSON.parse(raw) : [];
  });

  function persist(next) {
    setItems(next);
    localStorage.setItem("cart", JSON.stringify(next));
  }

  function add(product, qty = 1) {
    const next = [...items];
    const idx = next.findIndex((x) => x.productId === product._id);
    if (idx >= 0) next[idx].qty += qty;
    else next.push({ productId: product._id, title: product.title, price: product.price, image: product.images?.[0] || "", qty });
    persist(next);
  }

  function remove(productId) {
    persist(items.filter((x) => x.productId !== productId));
  }

  function setQty(productId, qty) {
    const next = items.map((x) => (x.productId === productId ? { ...x, qty } : x));
    persist(next);
  }

  function clear() {
    persist([]);
  }

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);

  const value = useMemo(() => ({ items, add, remove, setQty, clear, subtotal }), [items, subtotal]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  return useContext(CartCtx);
}
