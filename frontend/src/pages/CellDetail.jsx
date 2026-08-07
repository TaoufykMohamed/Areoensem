import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFetch } from "../hooks/useFetch.js";
import { useLocale } from "../hooks/useLocale.js";
import { cellsApi } from "../api/cells.js";
import { galleryApi } from "../api/gallery.js";
import PageHero from "../components/layout/PageHero.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import Reveal from "../components/ui/Reveal.jsx";

export default function CellDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { t: loc } = useLocale();
  const { data: cell, loading, error } = useFetch(() => cellsApi.getBySlug(slug), [slug]);
  const { data: gallery } = useFetch(
    () => (cell ? galleryApi.list({ cellule: cell._id }) : Promise.resolve([])),
    [cell?._id]
  );

  if (loading) return <Spinner className="min-h-[60vh]" />;
  if (error || !cell) return <div className="px-6 py-24 text-center">{t("common.error")}</div>;

  return (
    <div>
      <PageHero eyebrow={t("cells.detailTitle")} title={loc(cell, "nom")} subtitle={loc(cell, "descriptionCourte")} />

      <section className="mx-auto max-w-4xl px-6 py-16">
        <Reveal>
          <p className="whitespace-pre-line text-lg leading-relaxed text-[#33475c] dark:text-white/70">
            {loc(cell, "descriptionLongue") || loc(cell, "descriptionCourte")}
          </p>
        </Reveal>

        {cell.technologies?.length > 0 && (
          <Reveal className="mt-10">
            <h2 className="mb-3 font-mono text-[11px] uppercase tracking-instrument text-brand-cyan">
              {t("cells.technologies")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {cell.technologies.map((tech) => (
                <span key={tech} className="rounded-full border border-black/10 px-4 py-1.5 text-sm dark:border-white/15">
                  {tech}
                </span>
              ))}
            </div>
          </Reveal>
        )}

        {cell.membres?.length > 0 && (
          <Reveal className="mt-10">
            <h2 className="mb-4 font-mono text-[11px] uppercase tracking-instrument text-brand-cyan">
              {t("cells.members")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {cell.membres.map((m) => (
                <div key={m._id} className="rounded-xl border border-black/10 p-4 dark:border-white/10">
                  <div className="font-semibold">{m.nom}</div>
                  <div className="text-sm text-[#657a90] dark:text-white/50">{loc(m, "role")}</div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {cell.projets?.length > 0 && (
          <Reveal className="mt-10">
            <h2 className="mb-4 font-mono text-[11px] uppercase tracking-instrument text-brand-cyan">
              {t("cells.projects")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {cell.projets.map((p) => (
                <div key={p._id} className="rounded-xl border border-black/10 p-5 dark:border-white/10">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-semibold">{loc(p, "titre")}</span>
                    {p.annee && <span className="text-xs text-[#657a90] dark:text-white/40">{p.annee}</span>}
                  </div>
                  <p className="text-sm text-[#657a90] dark:text-white/50">{loc(p, "description")}</p>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {gallery?.length > 0 && (
          <Reveal className="mt-10">
            <h2 className="mb-4 font-mono text-[11px] uppercase tracking-instrument text-brand-cyan">
              {t("home.galleryTitle")}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {gallery.map((g) => (
                <img
                  key={g._id}
                  src={g.image}
                  alt={loc(g, "legende")}
                  className="aspect-square w-full rounded-lg object-cover"
                />
              ))}
            </div>
          </Reveal>
        )}

        {cell.chef && (
          <Reveal className="mt-10 rounded-xl border border-black/10 p-6 dark:border-white/10">
            <h2 className="mb-2 font-mono text-[11px] uppercase tracking-instrument text-brand-cyan">
              {t("cells.lead")}
            </h2>
            <div className="font-semibold">{cell.chef.nom}</div>
            {cell.chef.email && <div className="text-sm text-[#657a90] dark:text-white/50">{cell.chef.email}</div>}
          </Reveal>
        )}
      </section>
    </div>
  );
}
