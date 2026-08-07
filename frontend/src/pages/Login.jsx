import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth.js";

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, motDePasse);
      navigate(location.state?.from?.pathname ?? "/dashboard", { replace: true });
    } catch {
      setError(t("login.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[#04101f] px-6 text-white">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl">{t("login.title")}</h1>
        <p className="mt-2 text-sm text-white/50">{t("login.subtitle")}</p>

        <form onSubmit={submit} className="mt-8 flex flex-col gap-3">
          <input
            required
            type="email"
            placeholder={t("common.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm"
          />
          <input
            required
            type="password"
            placeholder="••••••••"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-brand-cyan px-6 py-3 text-sm font-semibold text-[#04101f] hover:bg-brand-amber disabled:opacity-50"
          >
            {t("login.cta")}
          </button>
        </form>
      </div>
    </div>
  );
}
