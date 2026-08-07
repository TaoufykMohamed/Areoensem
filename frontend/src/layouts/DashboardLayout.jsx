import { NavLink, Outlet, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth.js";

const COMMON_LINKS = [
  { to: "/dashboard", key: "overview", end: true },
  { to: "/dashboard/cellules", key: "cells" },
  { to: "/dashboard/evenements", key: "events" },
  { to: "/dashboard/inscriptions", key: "registrations" },
  { to: "/dashboard/galerie", key: "gallery" },
];

const ADMIN_LINKS = [
  { to: "/dashboard/candidatures", key: "applications" },
  { to: "/dashboard/utilisateurs", key: "users" },
  { to: "/dashboard/bureau", key: "board" },
  { to: "/dashboard/partenaires", key: "partners" },
  { to: "/dashboard/boutique", key: "store" },
  { to: "/dashboard/commandes", key: "orders" },
  { to: "/dashboard/contenu", key: "content" },
  { to: "/dashboard/messages", key: "messages" },
];

function linkClass({ isActive }) {
  return `rounded-lg px-4 py-2 text-sm transition-colors ${
    isActive ? "bg-brand-cyan/15 text-brand-cyan" : "text-white/60 hover:bg-white/5 hover:text-white"
  }`;
}

export default function DashboardLayout() {
  const { t } = useTranslation();
  const { user, isAdmin, logout } = useAuth();
  const links = isAdmin ? [...COMMON_LINKS, ...ADMIN_LINKS] : COMMON_LINKS;

  return (
    <div className="flex min-h-screen bg-[#04101f] text-white">
      <aside className="flex w-64 flex-col gap-1 border-r border-white/10 p-4">
        <Link to="/" className="mb-6 flex items-center gap-2 px-2">
          <img src="/assets/logo-club-aero.png" alt="Club AéroENSEM" className="h-8 w-auto" />
        </Link>

        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
            {t(`dashboard.${l.key}`)}
          </NavLink>
        ))}

        <div className="mt-auto border-t border-white/10 pt-4">
          <div className="px-2 text-xs text-white/40">{t("dashboard.welcome")}</div>
          <div className="px-2 text-sm font-medium">{user?.nom}</div>
          <button
            onClick={logout}
            className="mt-3 w-full rounded-lg border border-white/10 px-4 py-2 text-left text-sm text-white/60 hover:border-brand-amber hover:text-brand-amber"
          >
            {t("nav.logout")}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
