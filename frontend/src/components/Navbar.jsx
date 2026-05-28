// frontend/src/components/Navbar.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { t } from "../i18n/t";

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
  const { user, logout, theme, toggleTheme } = useAuth();
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
              <div className="text-xs text-zinc-400">Китари • Части • Аксесоари</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-5 text-sm">
            <NavItem to="/">{t("nav.products")}</NavItem>
            <NavItem to="/cart">
              {t("nav.cart")} <span className="badge ml-1">{items.length}</span>
            </NavItem>
            {user?.role === "admin" && <NavItem to="/admin">{t("nav.admin")}</NavItem>}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="btn btn-ghost" title="Theme">
              {theme === "dark" ? "🌙" : "☀️"}
            </button>

            {user ? (
              <>
                <span className="hidden sm:inline text-xs text-zinc-400">
                  {user.email}
                </span>
                <button onClick={logout} className="btn btn-ghost">
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">
                  {t("nav.login")}
                </Link>
                <Link to="/register" className="btn btn-primary">
                  {t("nav.register")}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}