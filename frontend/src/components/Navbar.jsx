import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();

  return (
    <div className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          GuitarShop
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <NavLink to="/" className={({ isActive }) => (isActive ? "text-white" : "text-zinc-300 hover:text-white")}>
            Продукти
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => (isActive ? "text-white" : "text-zinc-300 hover:text-white")}>
            Количка ({items.length})
          </NavLink>

          {user?.role === "admin" && (
            <NavLink to="/admin" className="text-amber-300 hover:text-amber-200">
              Admin
            </NavLink>
          )}

          {user ? (
            <button onClick={logout} className="rounded-lg border border-zinc-800 px-3 py-1 hover:bg-zinc-900">
              Изход
            </button>
          ) : (
            <div className="flex gap-2">
              <NavLink to="/login" className="rounded-lg border border-zinc-800 px-3 py-1 hover:bg-zinc-900">
                Вход
              </NavLink>
              <NavLink to="/register" className="rounded-lg bg-white px-3 py-1 text-zinc-950 hover:bg-zinc-200">
                Регистрация
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
