import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { http } from "../api/http";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    // Tailwind: dark mode чрез class на html
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  async function login(email, password) {
    const data = await http("/api/auth/login", { method: "POST", body: { email, password } });
    setToken(data.token);
    setUser(data.user);
  }

  async function register(name, email, password) {
    const data = await http("/api/auth/register", { method: "POST", body: { name, email, password } });
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    setToken("");
    setUser(null);
  }

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  const value = useMemo(
    () => ({ token, user, login, register, logout, theme, toggleTheme }),
    [token, user, theme]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
