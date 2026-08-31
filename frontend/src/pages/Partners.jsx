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
                {/* Carte purement informative : plus de lien, le clic ne fait
                    rien. Le texte n'est plus superposé au logo (il s'y
                    mêlait et devenait illisible) : image et légende sont
                    deux zones séparées dans la carte — fond blanc derrière
                    le logo (souvent transparent) dans sa zone, légende sur
                    fond uni dans la sienne. */}
                <div
                  role="listitem"
                  aria-label={`${p.nom}, ${TYPE_LABEL[p.type]}`}
                  className="flex h-80 flex-col overflow-hidden rounded-xl shadow-lg transition-all duration-500 ease-in-out group-hover:scale-[0.97] group-hover:opacity-60 group-hover:blur-[2px] hover:!scale-105 hover:!opacity-100 hover:!blur-none"
                >
                  <div className="relative min-h-0 flex-1 bg-white">
                    {p.logo ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${p.logo})` }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0b2545] to-[#04101f]" />
                    )}
                  </div>
                  <div className="bg-[#04101f] px-6 py-4 text-white">
                    <p className="text-sm font-light uppercase tracking-widest opacity-80">{p.nom}</p>
                    <h3 className="mt-1 text-xl font-semibold uppercase">{TYPE_LABEL[p.type]}</h3>
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
