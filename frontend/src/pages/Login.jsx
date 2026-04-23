import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { t } from "../i18n/t";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      await login(email, password);
      nav("/");
    } catch (e2) {
      setErr(e2.message);
    }
  }

  return (
    <div className="container-app py-10">
      <div className="mx-auto max-w-md">
        <form onSubmit={submit} className="card p-6">
          <div className="text-lg font-semibold">{t("auth.loginTitle")}</div>

          {err ? <div className="mt-3 text-sm text-red-300">{err}</div> : null}

          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">{t("auth.email")}</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("auth.email")}
                className="input"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">{t("auth.password")}</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("auth.password")}
                type="password"
                className="input"
                autoComplete="current-password"
              />
            </div>

            <button className="btn btn-primary w-full">
              {t("nav.login")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}