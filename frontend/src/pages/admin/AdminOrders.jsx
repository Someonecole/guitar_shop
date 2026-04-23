import React, { useEffect, useState } from "react";
import { http } from "../../api/http";
import { useAuth } from "../../context/AuthContext";
import { t } from "../../i18n/t";

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    const data = await http("/api/orders/admin", { token });
    setOrders(data.orders);
  }

  async function setStatus(id, status) {
    setErr("");
    try {
      await http(`/api/orders/admin/${id}/status`, { method: "PATCH", token, body: { status } });
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => {
    load().catch((e) => setErr(e.message));
  }, []);

  return (
    <div className="container-app py-6">
      <div className="text-lg font-semibold">{t("admin.orders")}</div>
      {err ? <div className="mt-3 text-sm text-red-300">{err}</div> : null}

      <div className="mt-4 space-y-3">
        {orders.map((o) => (
          <div key={o._id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm text-zinc-400">#{o._id}</div>
              <div className="text-sm">{t("cart.subtotal")}: {Number(o.subtotal).toFixed(2)} €</div>
              <div className="text-sm">
                Status: <span className="text-amber-300">{o.status}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStatus(o._id, "pending")} className="btn btn-ghost px-3 py-1.5">pending</button>
                <button onClick={() => setStatus(o._id, "paid")} className="btn btn-ghost px-3 py-1.5">paid</button>
                <button onClick={() => setStatus(o._id, "cancelled")} className="btn btn-ghost px-3 py-1.5">cancel</button>
              </div>
            </div>

            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {o.items.map((it, idx) => (
                <div key={idx} className="rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-3 text-sm">
                  <div className="font-medium">{it.title}</div>
                  <div className="text-zinc-400">qty: {it.qty}</div>
                  <div>{(Number(it.price) * Number(it.qty)).toFixed(2)} €</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {orders.length === 0 ? (
          <div className="card p-6 text-sm text-zinc-400">Няма поръчки.</div>
        ) : null}
      </div>
    </div>
  );
}