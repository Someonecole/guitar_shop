// frontend/src/pages/Cart.jsx
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { http } from "../api/http";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { items, remove, setQty, subtotal, clear } = useCart();
  const { token } = useAuth();
  const nav = useNavigate();
  const [err, setErr] = useState("");
  const [shipping, setShipping] = useState({ name: "", address: "", city: "", phone: "" });

  async function createOrderAndPay() {
    setErr("");
    if (!token) {
      nav("/login");
      return;
    }
    try {
      const order = await http("/api/orders", {
        method: "POST",
        token,
        body: { items: items.map((i) => ({ productId: i.productId, qty: i.qty })), shipping }
      });

      const s = await http("/api/stripe/create-checkout-session", {
        method: "POST",
        token,
        body: { orderId: order.order._id }
      });

      window.location.href = s.url;
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="container-app py-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">Количка</div>
              <button onClick={clear} className="btn btn-ghost px-3 py-1.5">Изчисти</button>
            </div>

            {items.length === 0 ? (
              <div className="mt-4 text-zinc-400">Няма продукти.</div>
            ) : (
              <div className="mt-4 space-y-3">
                {items.map((it) => (
                  <div key={it.productId} className="rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-3">
                    <div className="flex gap-3">
                      <div className="h-16 w-20 overflow-hidden rounded-lg bg-zinc-900 ring-1 ring-white/5">
                        {it.image ? <img src={it.image} alt={it.title} className="h-full w-full object-cover" /> : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{it.title}</div>
                        <div className="text-sm text-zinc-400">{it.price.toFixed(2)} €</div>
                        <div className="mt-2 flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            value={it.qty}
                            onChange={(e) => setQty(it.productId, Math.max(1, Number(e.target.value)))}
                            className="input w-24"
                          />
                          <button onClick={() => remove(it.productId)} className="btn btn-danger px-3 py-1.5">
                            Премахни
                          </button>
                        </div>
                      </div>
                      <div className="text-right text-sm font-semibold">
                        {(it.price * it.qty).toFixed(2)} €
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="card p-5">
            <div className="text-lg font-semibold">Доставка</div>
            <div className="mt-3 grid gap-2">
              {["name", "address", "city", "phone"].map((k) => (
                <input
                  key={k}
                  value={shipping[k]}
                  onChange={(e) => setShipping((s) => ({ ...s, [k]: e.target.value }))}
                  placeholder={k}
                  className="input"
                />
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-400">Subtotal</div>
              <div className="text-lg font-semibold">{subtotal.toFixed(2)} €</div>
            </div>
            {err ? <div className="mt-3 text-sm text-red-300">{err}</div> : null}
            <button
              disabled={items.length === 0}
              onClick={createOrderAndPay}
              className="btn btn-primary mt-4 w-full disabled:opacity-40"
            >
              Плащане (Stripe)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}