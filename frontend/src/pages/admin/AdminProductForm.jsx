import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { http } from "../../api/http";
import { useAuth } from "../../context/AuthContext";
import { t } from "../../i18n/t";

export default function AdminProductForm() {
  const { token } = useAuth();
  const nav = useNavigate();
  const { id } = useParams();
  const isNew = id === "new";

  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "guitar",
    brand: "",
    price: 0,
    stock: 0,
    description: "",
    images: [],
    specs: { body: "", neck: "", pickups: "", color: "" }
  });

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const all = await http("/api/products");
      const p = all.products.find((x) => x._id === id);
      if (!p) throw new Error("Product not found");
      setForm({
        title: p.title || "",
        slug: p.slug || "",
        category: p.category || "guitar",
        brand: p.brand || "",
        price: p.price || 0,
        stock: p.stock || 0,
        description: p.description || "",
        images: p.images || [],
        specs: {
          body: p.specs?.body || "",
          neck: p.specs?.neck || "",
          pickups: p.specs?.pickups || "",
          color: p.specs?.color || ""
        }
      });
    })().catch((e) => setErr(e.message));
  }, [id, isNew]);

  async function save(e) {
    e.preventDefault();
    setErr("");
    try {
      if (isNew) {
        await http("/api/products", { method: "POST", token, body: form });
      } else {
        await http(`/api/products/${id}`, { method: "PUT", token, body: form });
      }
      nav("/admin/products");
    } catch (e2) {
      setErr(e2.message);
    }
  }

  return (
    <div className="container-app py-6">
      <form onSubmit={save} className="card p-6 space-y-3 max-w-3xl mx-auto">
        <div className="text-lg font-semibold">{isNew ? t("admin.newProduct") : t("admin.edit")}</div>
        {err ? <div className="text-sm text-red-300">{err}</div> : null}

        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            placeholder="Title"
            className="input"
          />
          <input
            value={form.slug}
            onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))}
            placeholder="Slug (unique)"
            className="input"
          />
          <select
            value={form.category}
            onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
            className="input"
          >
            <option value="guitar">guitar</option>
            <option value="part">part</option>
            <option value="accessory">accessory</option>
          </select>
          <input
            value={form.brand}
            onChange={(e) => setForm((s) => ({ ...s, brand: e.target.value }))}
            placeholder="Brand"
            className="input"
          />
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm((s) => ({ ...s, price: Number(e.target.value) }))}
            placeholder="Price (EUR)"
            className="input"
          />
          <input
            type="number"
            value={form.stock}
            onChange={(e) => setForm((s) => ({ ...s, stock: Number(e.target.value) }))}
            placeholder="Stock"
            className="input"
          />
        </div>

        <textarea
          value={form.description}
          onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
          placeholder="Description"
          className="input min-h-24"
        />

        <input
          value={form.images.join(",")}
          onChange={(e) =>
            setForm((s) => ({
              ...s,
              images: e.target.value.split(",").map((x) => x.trim()).filter(Boolean)
            }))
          }
          placeholder="Images (URLs, separated by comma)"
          className="input"
        />

        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={form.specs.body}
            onChange={(e) => setForm((s) => ({ ...s, specs: { ...s.specs, body: e.target.value } }))}
            placeholder="Spec body"
            className="input"
          />
          <input
            value={form.specs.neck}
            onChange={(e) => setForm((s) => ({ ...s, specs: { ...s.specs, neck: e.target.value } }))}
            placeholder="Spec neck"
            className="input"
          />
          <input
            value={form.specs.pickups}
            onChange={(e) => setForm((s) => ({ ...s, specs: { ...s.specs, pickups: e.target.value } }))}
            placeholder="Spec pickups"
            className="input"
          />
          <input
            value={form.specs.color}
            onChange={(e) => setForm((s) => ({ ...s, specs: { ...s.specs, color: e.target.value } }))}
            placeholder="Spec color"
            className="input"
          />
        </div>

        <button className="btn btn-primary w-full">{t("admin.save")}</button>
      </form>
    </div>
  );
}