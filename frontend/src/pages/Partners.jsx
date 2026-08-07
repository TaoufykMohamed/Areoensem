import { useTranslation } from "react-i18next";
import { useFetch } from "../hooks/useFetch.js";
import { partnersApi } from "../api/partners.js";
import PageHero from "../components/layout/PageHero.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import Reveal from "../components/ui/Reveal.jsx";

const TYPE_LABEL = { sponsor: "Sponsor", partenaire: "Partenaire", ecole: "École" };

export default function Partners() {
  const { t } = useTranslation();
  const { data: partners, loading } = useFetch(() => partnersApi.list(), []);

  return (
    <div>
      <PageHero eyebrow={t("partners.title")} title={t("partners.title")} subtitle={t("partners.subtitle")} />
      <section className="mx-auto max-w-7xl px-6 py-16">
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {partners?.map((p) => (
              <Reveal key={p._id}>
                <a
                  href={p.siteWeb || undefined}
                  target={p.siteWeb ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex flex-col items-center gap-3 rounded-2xl border border-black/10 p-8 text-center transition-colors hover:border-brand-cyan/40 dark:border-white/10"
                >
                  {p.logo ? (
                    <img src={p.logo} alt={p.nom} className="h-12 object-contain" />
                  ) : (
                    <span className="text-2xl font-extrabold text-[#657a90] dark:text-white/60">{p.nom}</span>
                  )}
                  <span className="font-mono text-[10px] uppercase tracking-instrument text-brand-cyan">
                    {TYPE_LABEL[p.type]}
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
