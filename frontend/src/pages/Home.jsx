import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocale } from "../hooks/useLocale.js";
import { useFetch } from "../hooks/useFetch.js";
import { cellsApi } from "../api/cells.js";
import { eventsApi } from "../api/events.js";
import { partnersApi } from "../api/partners.js";
import { galleryApi } from "../api/gallery.js";
import { contentApi, statsApi } from "../api/content.js";
import Reveal from "../components/ui/Reveal.jsx";
import Counter from "../components/ui/Counter.jsx";
import Countdown from "../components/ui/Countdown.jsx";
import CellPill from "../components/cards/CellPill.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import HeroPlane from "../components/ui/HeroPlane.jsx";
import LogoLoop from "../components/ui/LogoLoop.jsx";
import LayoutGrid from "../components/ui/LayoutGrid.jsx";

export default function Home() {
  const { t } = useTranslation();
  const { t: loc } = useLocale();

  const { data: cells, loading: cellsLoading } = useFetch(() => cellsApi.list(), []);
  const { data: events } = useFetch(() => eventsApi.list({ statut: "a_venir" }), []);
  const { data: partners } = useFetch(() => partnersApi.list(), []);
  const { data: gallery } = useFetch(() => galleryApi.list(), []);
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

        {/* Fondu vers la couleur de fond de la page (var(--bg), claire ou
            sombre selon le thème) pour éviter la coupure nette avec la
            section suivante — pointer-events-none pour ne jamais bloquer
            les boutons/liens du Hero. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 md:h-48"
          style={{ background: "linear-gradient(to top, var(--bg), transparent)" }}
        />

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
          <section className="py-20">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-10 gap-y-12 px-6 text-center md:grid-cols-4 md:gap-x-14 md:text-left">
              {stats.map((s) => (
                <div key={s.cle}>
                  <div className="font-serif text-6xl font-bold text-brand-cyan">
                    <Counter to={s.valeur} />
                  </div>
                  <div className="mx-auto mt-4 h-0.5 w-10 rounded-full bg-brand-cyan/40 md:mx-0" />
                  <div className="mt-4 font-mono text-[11px] uppercase tracking-instrument text-[#657a90] dark:text-white/50">
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
            <div className="flex flex-col items-center gap-5">
              <div className="flex flex-wrap justify-center gap-5">
                {cells?.slice(0, 3).map((cell) => (
                  <CellPill key={cell._id} cell={cell} />
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-5">
                {cells?.slice(3, 5).map((cell) => (
                  <CellPill key={cell._id} cell={cell} />
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-5">
                {cells?.slice(5, 6).map((cell) => (
                  <CellPill key={cell._id} cell={cell} />
                ))}
              </div>
            </div>
          )}
          <div className="mt-8 text-center">
            <Link to="/cellules" className="text-sm font-semibold text-brand-cyan hover:text-brand-amber">
              {t("common.seeAll")} →
            </Link>
          </div>
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
            <LogoLoop partners={partners} />
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

      {/* GALERIE */}
      {gallery && gallery.length > 0 && (
        <Reveal>
          <section className="mx-auto max-w-7xl px-6 pb-24">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-instrument text-brand-cyan">
              — {t("dashboard.gallery")}
            </div>
            <h2 className="mb-10 font-serif text-4xl text-anthracite dark:text-white">
              {t("home.galleryTitle")}
            </h2>
            <LayoutGrid
              items={gallery.map((g) => ({
                id: g._id,
                image: g.image,
                title: loc(g, "legende"),
                description: loc(g, "description"),
              }))}
            />
          </section>
        </Reveal>
      )}
    </div>
  );
}
