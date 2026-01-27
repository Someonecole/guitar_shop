import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { http } from "../api/http";
import { useCart } from "../context/CartContext";

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

  if (err) return <div className="mx-auto max-w-6xl px-4 py-6 text-red-300">{err}</div>;
  if (!p) return <div className="mx-auto max-w-6xl px-4 py-6 text-zinc-400">Loading...</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
          <div className="aspect-[4/3] bg-zinc-900">
            {p.images?.[0] ? (
              <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-500">No image</div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <div className="text-sm text-zinc-400">{p.brand || p.category}</div>
          <h1 className="mt-1 text-xl font-semibold">{p.title}</h1>
          <div className="mt-3 text-2xl">{p.price.toFixed(2)} лв</div>
          <div className="mt-2 text-sm text-zinc-400">Наличност: {p.stock}</div>

          <button
            onClick={() => add(p, 1)}
            className="mt-4 w-full rounded-xl bg-white px-3 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200"
          >
            Добави в количка
          </button>

          <div className="mt-5 space-y-2 text-sm text-zinc-300">
            {p.description ? <p>{p.description}</p> : null}
            <div className="grid gap-2 rounded-xl border border-zinc-800 p-3">
              <div className="text-zinc-400">Specs</div>
              <div>Body: {p.specs?.body || "-"}</div>
              <div>Neck: {p.specs?.neck || "-"}</div>
              <div>Pickups: {p.specs?.pickups || "-"}</div>
              <div>Color: {p.specs?.color || "-"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
