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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {members?.map((m) => (
              <Reveal key={m._id}>
                <div className="rounded-2xl border border-black/10 p-6 text-center dark:border-white/10">
                  <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                    {m.photo && <img src={m.photo} alt={m.nom} className="h-full w-full object-cover" />}
                  </div>
                  <div className="font-serif text-lg">{m.nom}</div>
                  <div className="text-sm text-brand-cyan">{loc(m, "poste")}</div>
                  <div className="mt-1 text-xs text-[#657a90] dark:text-white/40">{m.mandat}</div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
