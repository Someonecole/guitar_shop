import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="text-lg font-semibold">Admin</div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link className="rounded-xl border border-zinc-800 px-4 py-2 hover:bg-zinc-900" to="/admin/products">
            Продукти
          </Link>
          <Link className="rounded-xl border border-zinc-800 px-4 py-2 hover:bg-zinc-900" to="/admin/orders">
            Поръчки
          </Link>
        </div>
        <div className="mt-3 text-sm text-zinc-400">Демо панел (CRUD страниците са налични в кода от предишния отговор; тук не са включени в билд демото).</div>
      </div>
    </div>
  );
}
