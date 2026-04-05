import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ p }) {
  const { add } = useCart();

  return (
    <div className="card p-4 transition hover:border-zinc-700/80 hover:bg-zinc-950/80">
      <Link to={`/p/${p.slug}`} className="block">
        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/5">
          {p.images?.[0] ? (
            <img
              src={p.images[0]}
              alt={p.title}
              className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-500">
              No image
            </div>
          )}
        </div>

        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs text-zinc-400">
              {p.brand ? p.brand : p.category}
            </div>
            <div className="mt-1 line-clamp-2 font-medium">{p.title}</div>
          </div>
          <div className="shrink-0 text-right">
            <div className="badge">{p.category}</div>
            <div className="mt-2 text-base font-semibold">
              {p.price.toFixed(2)} €
            </div>
          </div>
        </div>
      </Link>

      <button onClick={() => add(p, 1)} className="btn btn-primary mt-4 w-full">
        Добави в количка
      </button>
    </div>
  );
}