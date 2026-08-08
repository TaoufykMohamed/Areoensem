import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useTheme } from "../../hooks/useTheme.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useScrolled } from "../../hooks/useScrolled.js";
import ContinuousTabs from "../ui/ContinuousTabs.jsx";

const LINKS = [
  { to: "/", key: "home" },
  { to: "/cellules", key: "cells" },
  { to: "/evenements", key: "events" },
  { to: "/bureau", key: "board" },
  { to: "/store", key: "store" },
  { to: "/partenaires", key: "partners" },
  { to: "/contact", key: "contact" },
];

function linkClass({ isActive }) {
  return `transition-colors ${isActive ? "text-white" : "text-white/60 hover:text-white"}`;
}

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();

  const toggleLang = () => i18n.changeLanguage(i18n.language === "fr" ? "en" : "fr");

  const tabs = LINKS.map((l) => ({ to: l.to, end: l.to === "/", label: t(`nav.${l.key}`) }));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,border-color] duration-300 ${
        scrolled || open
          ? "border-b border-white/10 bg-[#04101f]/90 backdrop-blur"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <img src="/assets/logo-club-aero.png" alt="Club AéroENSEM" className="h-9 w-auto" />
        </Link>

        <div className="hidden md:flex">
          <ContinuousTabs tabs={tabs} />
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleLang}
            className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-instrument text-white/80 hover:border-brand-cyan hover:text-brand-cyan"
          >
            {i18n.language === "fr" ? "FR / EN" : "EN / FR"}
          </button>
          <button
            onClick={toggleTheme}
            className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-instrument text-white/80 hover:border-brand-cyan hover:text-brand-cyan"
          >
            {theme === "dark" ? t("theme.light") : t("theme.dark")}
          </button>
          <Link
            to={isAuthenticated ? "/dashboard" : "/connexion"}
            className="rounded-full bg-brand-cyan px-5 py-2 text-sm font-semibold text-[#04101f] hover:bg-brand-amber"
          >
            {isAuthenticated ? t("nav.dashboard") : t("nav.login")}
          </Link>
        </div>

        <button
          className="text-white md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-4 border-t border-white/10 px-6 py-6 md:hidden">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} className={linkClass} onClick={() => setOpen(false)}>
              {t(`nav.${l.key}`)}
            </NavLink>
          ))}
          <Link
            to={isAuthenticated ? "/dashboard" : "/connexion"}
            className="w-fit rounded-full bg-brand-cyan px-5 py-2 text-sm font-semibold text-[#04101f]"
            onClick={() => setOpen(false)}
          >
            {isAuthenticated ? t("nav.dashboard") : t("nav.login")}
          </Link>
          <div className="flex gap-3 pt-2">
            <button onClick={toggleLang} className="text-xs text-white/70">
              {i18n.language === "fr" ? "FR / EN" : "EN / FR"}
            </button>
            <button onClick={toggleTheme} className="text-xs text-white/70">
              {theme === "dark" ? t("theme.light") : t("theme.dark")}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
