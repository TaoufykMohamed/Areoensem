import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../hooks/useFetch.js";
import { useLocale } from "../hooks/useLocale.js";
import { eventsApi } from "../api/events.js";
import { Link } from "react-router-dom";
import PageHero from "../components/layout/PageHero.jsx";
import EventCard from "../components/cards/EventCard.jsx";
import Spinner from "../components/ui/Spinner.jsx";

const TABS = ["a_venir", "en_cours", "passe"];

export default function Events() {
  const { t, i18n } = useTranslation();
  const { t: loc } = useLocale();
  const [tab, setTab] = useState("a_venir");
  const { data: events, loading } = useFetch(() => eventsApi.list({ statut: tab }), [tab]);

  return (
    <div>
      <PageHero eyebrow={t("events.title")} title={t("events.title")} />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 flex gap-2">
          {TABS.map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                tab === key
                  ? "bg-brand-cyan text-[#04101f]"
                  : "border border-black/10 text-[#657a90] hover:border-brand-cyan/50 dark:border-white/15 dark:text-white/60"
              }`}
            >
              {t(`events.${key === "a_venir" ? "upcoming" : key === "en_cours" ? "ongoing" : "past"}`)}
            </button>
          ))}
        </div>

        {loading ? (
          <Spinner />
        ) : !events?.length ? (
          <p className="text-[#657a90] dark:text-white/50">{t("common.empty")}</p>
        ) : tab === "passe" ? (
          <ol className="relative ml-3 space-y-8 border-l border-black/10 pl-8 dark:border-white/10">
            {events.map((event) => (
              <li key={event._id} className="relative">
                <span className="absolute -left-[38px] top-1.5 h-3 w-3 rounded-full bg-brand-cyan" />
                <Link to={`/evenements/${event.slug}`} className="group">
                  <div className="font-mono text-xs text-[#657a90] dark:text-white/40">
                    {new Date(event.dateDebut).toLocaleDateString(i18n.language === "en" ? "en-GB" : "fr-FR")}
                  </div>
                  <div className="font-serif text-xl group-hover:text-brand-cyan">{loc(event, "titre")}</div>
                  <p className="mt-1 text-sm text-[#657a90] dark:text-white/50">{loc(event, "lieu")}</p>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
