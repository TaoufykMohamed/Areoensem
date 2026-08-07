import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../hooks/useLocale.js";

const STATUT_STYLES = {
  a_venir: "bg-brand-cyan/15 text-brand-cyan",
  en_cours: "bg-brand-amber/15 text-brand-amber",
  passe: "bg-black/10 text-[#657a90] dark:bg-white/10 dark:text-white/50",
};

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
      className="group flex flex-col justify-between rounded-2xl border border-black/10 bg-black/[0.02] p-6 transition-colors hover:border-brand-cyan/40 dark:border-white/10 dark:bg-white/[0.03]"
    >
      <div>
        <div className="mb-3 flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-instrument ${STATUT_STYLES[event.statut]}`}>
            {t(`events.${event.statut === "a_venir" ? "upcoming" : event.statut === "en_cours" ? "ongoing" : "past"}`)}
          </span>
          <span className="font-mono text-[11px] text-[#657a90] dark:text-white/40">{date}</span>
        </div>
        <h3 className="font-serif text-xl text-anthracite group-hover:text-brand-cyan dark:text-white">
          {loc(event, "titre")}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-[#657a90] dark:text-white/60">{loc(event, "description")}</p>
      </div>
      <div className="mt-6 text-xs text-[#657a90]/70 dark:text-white/40">{loc(event, "lieu")}</div>
    </Link>
  );
}
