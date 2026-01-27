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
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">Количка</div>
              <button onClick={clear} className="text-sm text-zinc-300 hover:text-white">
                Изчисти
              </button>
            </div>

            {items.length === 0 ? (
              <div className="mt-4 text-zinc-400">Няма продукти.</div>
            ) : (
              <div className="mt-4 space-y-3">
                {items.map((it) => (
                  <div key={it.productId} className="flex gap-3 rounded-xl border border-zinc-800 p-3">
                    <div className="h-16 w-20 overflow-hidden rounded-lg bg-zinc-900">
                      {it.image ? <img src={it.image} alt={it.title} className="h-full w-full object-cover" /> : null}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{it.title}</div>
                      <div className="text-sm text-zinc-400">{it.price.toFixed(2)} лв</div>
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          value={it.qty}
                          onChange={(e) => setQty(it.productId, Math.max(1, Number(e.target.value)))}
                          className="w-20 rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1 text-sm"
                        />
                        <button onClick={() => remove(it.productId)} className="text-sm text-red-300 hover:text-red-200">
                          Премахни
                        </button>
                      </div>
                    </div>
                    <div className="text-right text-sm">{(it.price * it.qty).toFixed(2)} лв</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-lg font-semibold">Доставка</div>
            <div className="mt-3 grid gap-2">
              {[
                ["name", "Име"],
                ["address", "Адрес"],
                ["city", "Град"],
                ["phone", "Телефон"]
              ].map(([k, label]) => (
                <input
                  key={k}
                  value={shipping[k]}
                  onChange={(e) => setShipping((s) => ({ ...s, [k]: e.target.value }))}
                  placeholder={label}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-600"
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-400">Subtotal</div>
              <div className="text-lg">{subtotal.toFixed(2)} лв</div>
            </div>
            {err ? <div className="mt-3 text-sm text-red-300">{err}</div> : null}
            <button
              disabled={items.length === 0}
              onClick={createOrderAndPay}
              className="mt-4 w-full rounded-xl bg-white px-3 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200 disabled:opacity-40"
            >
              Плащане (Stripe)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
