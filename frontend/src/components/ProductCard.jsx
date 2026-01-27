import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ p }) {
  const { add } = useCart();
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-sm">
      <Link to={`/p/${p.slug}`} className="block">
        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-zinc-900">
          {p.images?.[0] ? (
            <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-500">No image</div>
          )}
        </div>
        <div className="mt-3">
          <div className="text-sm text-zinc-400">{p.brand || p.category}</div>
          <div className="mt-1 line-clamp-2 font-medium">{p.title}</div>
          <div className="mt-2 text-white">{p.price.toFixed(2)} лв</div>
        </div>
      </Link>
      <button
        onClick={() => add(p, 1)}
        className="mt-3 w-full rounded-xl bg-white px-3 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200"
      >
        Добави в количка
      </button>
    </div>
  );
}
