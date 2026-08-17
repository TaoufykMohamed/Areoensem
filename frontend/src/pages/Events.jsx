import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../hooks/useFetch.js";
import { eventsApi } from "../api/events.js";
import PageHero from "../components/layout/PageHero.jsx";
import ExpandableEvents from "../components/cards/ExpandableEvents.jsx";
import Spinner from "../components/ui/Spinner.jsx";

const TABS = ["a_venir", "en_cours", "passe"];

export default function Events() {
  const { t } = useTranslation();
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
        ) : (
          <ExpandableEvents events={events} variant={tab === "passe" ? "timeline" : "grid"} />
        )}
      </section>
    </div>
  );
}
