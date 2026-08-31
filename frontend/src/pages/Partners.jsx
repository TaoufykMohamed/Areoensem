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
          // Même traitement visuel que la grille de cellules (ExpandableCells) :
          // cartes h-80 arrondies, image de fond plein cadre, dégradé bas +
          // texte, hover-dim des cartes voisines via `group`.
          <div role="list" className="group grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {partners?.map((p) => (
              <Reveal key={p._id}>
                <a
                  href={p.siteWeb || undefined}
                  target={p.siteWeb ? "_blank" : undefined}
                  rel="noreferrer"
                  role="listitem"
                  aria-label={`${p.nom}, ${TYPE_LABEL[p.type]}`}
                  className="relative block h-80 overflow-hidden rounded-xl bg-cover bg-center shadow-lg outline-none transition-all duration-500 ease-in-out group-hover:scale-[0.97] group-hover:opacity-60 group-hover:blur-[2px] hover:!scale-105 hover:!opacity-100 hover:!blur-none focus-visible:!scale-105 focus-visible:!opacity-100 focus-visible:!blur-none focus-visible:!ring-2 focus-visible:!ring-brand-cyan"
                  style={p.logo ? { backgroundImage: `url(${p.logo})` } : undefined}
                >
                  {!p.logo && <div className="absolute inset-0 bg-gradient-to-br from-[#0b2545] to-[#04101f]" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <p className="text-sm font-light uppercase tracking-widest opacity-80">{p.nom}</p>
                    <h3 className="mt-1 text-2xl font-semibold uppercase">{TYPE_LABEL[p.type]}</h3>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
