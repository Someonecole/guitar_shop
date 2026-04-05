import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? "text-white" : "text-zinc-300 hover:text-white"
      }
    >
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();

  return (
    <div className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/70 backdrop-blur">
      <div className="container-app py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-white/10 ring-1 ring-white/10 grid place-items-center">
              <span className="text-sm font-semibold">GS</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">GuitarShop</div>
              <div className="text-xs text-zinc-400">Guitars • Parts • Gear</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-5 text-sm">
            <NavItem to="/">Продукти</NavItem>
            <NavItem to="/cart">
              Количка <span className="badge ml-1">{items.length}</span>
            </NavItem>
            {user?.role === "admin" && <NavItem to="/admin">Admin</NavItem>}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden sm:inline text-xs text-zinc-400">
                  {user.email}
                </span>
                <button onClick={logout} className="btn btn-ghost">
                  Изход
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">Вход</Link>
                <Link to="/register" className="btn btn-primary">Регистрация</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}