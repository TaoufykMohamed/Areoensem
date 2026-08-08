import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocale } from "../hooks/useLocale.js";
import { useFetch } from "../hooks/useFetch.js";
import { cellsApi } from "../api/cells.js";
import { eventsApi } from "../api/events.js";
import { partnersApi } from "../api/partners.js";
import { contentApi, statsApi } from "../api/content.js";
import Reveal from "../components/ui/Reveal.jsx";
import Counter from "../components/ui/Counter.jsx";
import Countdown from "../components/ui/Countdown.jsx";
import CellCard from "../components/cards/CellCard.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import HeroPlane from "../components/ui/HeroPlane.jsx";

export default function Home() {
  const { t } = useTranslation();
  const { t: loc } = useLocale();

  const { data: cells, loading: cellsLoading } = useFetch(() => cellsApi.list(), []);
  const { data: events } = useFetch(() => eventsApi.list({ statut: "a_venir" }), []);
  const { data: partners } = useFetch(() => partnersApi.list(), []);
  const { data: stats } = useFetch(() => statsApi.list(), []);
  const { data: content } = useFetch(() => contentApi.list(), []);

  const contentValue = (key, fallback = "") => {
    const item = content?.find((c) => c.cle === key);
    return item ? loc(item, "valeur") : fallback;
  };

  const slogan = contentValue("hero_slogan", "Together we fly, together we climb the sky.");
  const accroche = contentValue(
    "hero_accroche",
    "Seven cells, one trajectory: turning student curiosity into real aerospace engineering projects."
  );
  const aboutIntro = contentValue("about_intro", "");

  const nextEvent = events?.[0];

  return (
    <div>
      {/* HERO */}
      <section className="relative flex min-h-[90vh] items-end overflow-hidden bg-[#04101f] pb-24 pt-40 text-white">
        <video
          src="/assets/hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#04101f]/50 via-[#071a2e]/25 to-[#04101f]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04101f]/90 via-[#04101f]/55 to-transparent" />

        <HeroPlane />

        <div className="relative mx-auto w-full max-w-7xl px-6">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-cyan/30 px-4 py-2 font-mono text-[11px] uppercase tracking-instrument text-brand-cyan">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-amber" />
            {t("home.tagline")} — DEPUIS 2014
          </div>

          <h1 className="max-w-2xl font-serif text-6xl leading-[0.95] md:text-8xl">
            Club Aéro<span className="text-brand-cyan">ENSEM</span>
          </h1>

          <p className="mt-8 max-w-xl text-2xl text-white/90">{slogan}</p>
          <p className="mt-4 max-w-lg text-white/60">{accroche}</p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/cellules"
              className="rounded-full bg-brand-cyan px-8 py-4 font-semibold text-[#04101f] transition-colors hover:bg-white"
            >
              {t("home.discover")}
            </Link>
            <Link
              to="/rejoindre"
              className="rounded-full border border-white/25 px-8 py-4 font-semibold text-white transition-colors hover:border-brand-amber hover:text-brand-amber"
            >
              {t("home.joinUs")}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-6 flex gap-10 font-mono text-[11px] uppercase tracking-instrument text-white/60">
          <span>ALT 10 400 M</span>
          <span>HDG 042°</span>
          <span>{t("home.scrollDown")}</span>
        </div>
      </section>

      {/* QUI SOMMES-NOUS */}
      {aboutIntro && (
        <Reveal>
          <section className="mx-auto max-w-4xl px-6 py-24 text-center">
            <p className="text-lg leading-relaxed text-[#33475c] dark:text-white/70">{aboutIntro}</p>
          </section>
        </Reveal>
      )}

      {/* CHIFFRES */}
      {stats && stats.length > 0 && (
        <Reveal>
          <section className="border-y border-black/10 dark:border-white/10">
            <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.cle} className="border-l border-black/10 p-10 first:border-l-0 dark:border-white/10">
                  <div className="font-serif text-6xl font-bold text-brand-cyan">
                    <Counter to={s.valeur} />
                  </div>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-instrument text-[#657a90] dark:text-white/50">
                    {loc(s, "label")}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* CELLULES */}
      <Reveal>
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-4 font-mono text-[11px] uppercase tracking-instrument text-brand-cyan">
            — {t("cells.title")}
          </div>
          <h2 className="mb-10 font-serif text-4xl text-anthracite dark:text-white">{t("home.cellsTitle")}</h2>
          {cellsLoading ? (
            <Spinner />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {cells?.slice(0, 6).map((cell) => (
                <CellCard key={cell._id} cell={cell} />
              ))}
            </div>
          )}
          <Link to="/cellules" className="mt-8 inline-block text-sm font-semibold text-brand-cyan hover:text-brand-amber">
            {t("common.seeAll")} →
          </Link>
        </section>
      </Reveal>

      {/* PROCHAIN ÉVÉNEMENT */}
      {nextEvent && (
        <Reveal>
          <section className="bg-[#04101f] px-6 py-24 text-white">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-4 font-mono text-[11px] uppercase tracking-instrument text-brand-cyan">
                — {t("home.nextEventTitle")}
              </div>
              <h2 className="font-serif text-4xl">{loc(nextEvent, "titre")}</h2>
              <p className="mx-auto mt-4 max-w-xl text-white/60">{loc(nextEvent, "description")}</p>
              <div className="mt-10 flex justify-center">
                <Countdown target={nextEvent.dateDebut} />
              </div>
              <Link
                to={`/evenements/${nextEvent.slug}`}
                className="mt-10 inline-block rounded-full bg-brand-cyan px-8 py-4 font-semibold text-[#04101f] hover:bg-white"
              >
                {t("common.readMore")}
              </Link>
            </div>
          </section>
        </Reveal>
      )}

      {/* PARTENAIRES */}
      {partners && partners.length > 0 && (
        <Reveal>
          <section className="overflow-hidden border-y border-black/10 py-14 dark:border-white/10">
            <div className="mb-8 text-center font-mono text-[11px] uppercase tracking-instrument text-[#657a90] dark:text-white/40">
              {t("home.partnersTitle")}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 px-6">
              {partners.map((p) => (
                <div
                  key={p._id}
                  className="flex h-24 w-44 items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-4 shadow-sm dark:border-white/10 dark:bg-white/5"
                >
                  {p.logo ? (
                    <img src={p.logo} alt={p.nom} className="max-h-12 max-w-full object-contain" />
                  ) : (
                    <span className="text-center text-sm font-extrabold text-[#657a90] dark:text-white/50">
                      {p.nom}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* CTA REJOINDRE */}
      <Reveal>
        <section className="px-6 py-24 text-center">
          <h2 className="font-serif text-4xl text-anthracite dark:text-white">{t("home.readyTitle")}</h2>
          <Link
            to="/rejoindre"
            className="mt-8 inline-block rounded-full bg-brand-cyan px-8 py-4 font-semibold text-[#04101f] hover:bg-brand-amber"
          >
            {t("home.joinUs")}
          </Link>
        </section>
      </Reveal>
    </div>
  );
}
