import { useTranslation } from "react-i18next";
import { useFetch } from "../hooks/useFetch.js";
import { useLocale } from "../hooks/useLocale.js";
import { boardApi } from "../api/board.js";
import PageHero from "../components/layout/PageHero.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import Reveal from "../components/ui/Reveal.jsx";

export default function Board() {
  const { t } = useTranslation();
  const { t: loc } = useLocale();
  const { data: members, loading } = useFetch(() => boardApi.list(), []);

  return (
    <div>
      <PageHero eyebrow={t("board.title")} title={t("board.title")} />
      <section className="mx-auto max-w-7xl px-6 py-16">
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {members?.map((m) => (
              <Reveal key={m._id}>
                <div className="group relative aspect-[4/5] overflow-hidden bg-[#0b2545]">
                  {m.photo ? (
                    <img
                      src={m.photo}
                      alt={m.nom}
                      className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#0b2545] to-[#04101f]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04101f] via-[#04101f]/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <span className="inline-block rounded-full bg-brand-cyan px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-instrument text-[#04101f]">
                      {loc(m, "poste")}
                    </span>
                    <h3 className="mt-3 font-serif text-xl font-bold leading-tight text-white">{m.nom}</h3>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-instrument text-white/50">
                      {m.mandat}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
