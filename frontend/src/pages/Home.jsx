import React, { useEffect, useState } from "react";
import { http } from "../api/http";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    const data = await http(`/api/products?${params.toString()}`);
    setProducts(data.products);
  }

  useEffect(() => {
    load().catch((e) => setErr(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-app py-6">
      <div className="card p-6">
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-semibold tracking-tight">Магазин за китари и части</div>
          <div className="text-sm text-zinc-400">Търси по марка, модел или категория.</div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Търси (марка/модел)"
            className="input"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input"
          >
            <option value="">Всички категории</option>
            <option value="guitar">Китари</option>
            <option value="part">Части</option>
            <option value="accessory">Аксесоари</option>
          </select>
          <button
            onClick={() => load().catch((e) => setErr(e.message))}
            className="btn btn-primary"
          >
            Търси
          </button>
        </div>

        {err ? <div className="mt-3 text-sm text-red-300">{err}</div> : null}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p._id} p={p} />
        ))}
        {products.length === 0 ? (
          <div className="card p-6 text-sm text-zinc-400 sm:col-span-2 lg:col-span-3">
            Няма продукти. Добави от Admin → Продукти.
          </div>
        ) : null}
      </div>
    </div>
  );
}