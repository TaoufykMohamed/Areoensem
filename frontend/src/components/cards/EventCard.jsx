import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../hooks/useLocale.js";

const STATUT_STYLES = {
  a_venir: "bg-brand-cyan text-[#04101f]",
  en_cours: "bg-brand-amber text-[#04101f]",
  passe: "bg-white/20 text-white",
};

/**
 * Carte événement avec image de fond (Event.affiche, alimentée par le
 * dashboard) et effet "hover reveal" — même mécanisme que la grille de
 * cellules (ExpandableCells) : le parent (Events.jsx) porte la classe
 * `group`, ces cartes s'assombrissent
 * entre elles au survol de l'une d'elles.
 */
export default function EventCard({ event }) {
  const { t, i18n } = useTranslation();
  const { t: loc } = useLocale();

  const date = new Date(event.dateDebut).toLocaleDateString(i18n.language === "en" ? "en-GB" : "fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      to={`/evenements/${event.slug}`}
      className="relative block h-80 overflow-hidden rounded-xl bg-cover bg-center shadow-lg outline-none transition-all duration-500 ease-in-out group-hover:scale-[0.97] group-hover:opacity-60 group-hover:blur-[2px] hover:!scale-105 hover:!opacity-100 hover:!blur-none focus-visible:!scale-105 focus-visible:!opacity-100 focus-visible:!blur-none focus-visible:!ring-2 focus-visible:!ring-brand-cyan"
      style={event.affiche ? { backgroundImage: `url(${event.affiche})` } : undefined}
    >
      {!event.affiche && <div className="absolute inset-0 bg-gradient-to-br from-[#0b2545] to-[#04101f]" />}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

      <div className="absolute inset-x-0 top-0 flex items-center gap-3 p-4">
        <span
          className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-instrument ${STATUT_STYLES[event.statut]}`}
        >
          {t(`events.${event.statut === "a_venir" ? "upcoming" : event.statut === "en_cours" ? "ongoing" : "past"}`)}
        </span>
        <span className="font-mono text-[11px] text-white/70">{date}</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <h3 className="font-serif text-xl font-semibold">{loc(event, "titre")}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-white/70">{loc(event, "description")}</p>
        <div className="mt-3 font-mono text-[11px] uppercase tracking-instrument text-white/50">
          {loc(event, "lieu")}
        </div>
      </div>
    </Link>
  );
}
