// frontend/src/pages/admin/AdminProducts.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { http } from "../../api/http";
import { useAuth } from "../../context/AuthContext";

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    const data = await http("/api/products");
    setProducts(data.products);
  }

  async function del(id) {
    setErr("");
    try {
      await http(`/api/products/${id}`, { method: "DELETE", token });
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
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Продукти</div>
        <Link className="btn btn-primary" to="/admin/products/new">
          + Нов продукт
        </Link>
      </div>

      {err ? <div className="mt-3 text-sm text-red-300">{err}</div> : null}

      <div className="card mt-4 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-950/60">
            <tr className="text-left text-zinc-400">
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="bg-zinc-950/30">
            {products.map((p) => (
              <tr key={p._id} className="border-t border-zinc-800 hover:bg-zinc-900/40">
                <td className="p-3">{p.title}</td>
                <td className="p-3 text-zinc-400">{p.category}</td>
                <td className="p-3">{p.price.toFixed(2)} €</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3 text-right">
                  <Link className="mr-3 text-amber-300 hover:text-amber-200" to={`/admin/products/${p._id}`}>
                    Edit
                  </Link>
                  <button className="btn btn-danger px-3 py-1.5" onClick={() => del(p._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 ? (
              <tr>
                <td className="p-4 text-zinc-400" colSpan={5}>
                  Няма продукти.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}