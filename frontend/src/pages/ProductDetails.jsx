import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { http } from "../api/http";
import { useCart } from "../context/CartContext";
import { t } from "../i18n/t";

export default function ProductDetails() {
  const { slug } = useParams();
  const { add } = useCart();
  const [p, setP] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    http(`/api/products/${slug}`)
      .then((d) => setP(d.product))
      .catch((e) => setErr(e.message));
  }, [slug]);

  if (err) return <div className="container-app py-6 text-red-300">{err}</div>;
  if (!p) return <div className="container-app py-6 text-zinc-400">Loading...</div>;

  return (
    <div className="container-app py-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="aspect-[4/3] bg-zinc-900">
            {p.images?.[0] ? (
              <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-500">
                {t("product.noImage")}
              </div>
            )}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm text-zinc-400">{p.brand || p.category}</div>
              <h1 className="mt-1 text-xl font-semibold">{p.title}</h1>
              <div className="mt-2 flex gap-2">
                <span className="badge">{p.category}</span>
                <span className="badge">
                  {t("product.stock")}: {p.stock}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold">{Number(p.price).toFixed(2)} €</div>
            </div>
          </div>

          <button onClick={() => add(p, 1)} className="btn btn-primary mt-5 w-full">
            {t("product.addToCart")}
          </button>

          <div className="mt-5 space-y-3 text-sm text-zinc-300">
            {p.description ? <p>{p.description}</p> : null}

            <div className="rounded-xl border border-zinc-800/70 p-4">
              <div className="text-xs text-zinc-400 mb-2">{t("product.specs")}</div>
              <div className="grid gap-1">
                <div>Тяло: {p.specs?.body || "-"}</div>
                <div>Шийка: {p.specs?.neck || "-"}</div>
                <div>Адаптери: {p.specs?.pickups || "-"}</div>
                <div>Цвят: {p.specs?.color || "-"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}