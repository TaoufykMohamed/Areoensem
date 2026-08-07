import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../hooks/useLocale.js";

export default function CellCard({ cell }) {
  const { t } = useTranslation();
  const { t: loc } = useLocale();

  return (
    <Link
      to={`/cellules/${cell.slug}`}
      className="group flex flex-col justify-between rounded-2xl border border-black/10 bg-black/[0.02] p-6 transition-colors hover:border-brand-cyan/40 dark:border-white/10 dark:bg-white/[0.03]"
    >
      <div>
        <div className="mb-3 font-mono text-[10px] uppercase tracking-instrument text-brand-cyan">
          {String(cell.ordre).padStart(2, "0")}
        </div>
        <h3 className="font-serif text-xl text-anthracite group-hover:text-brand-cyan dark:text-white">
          {loc(cell, "nom")}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#657a90] dark:text-white/60">
          {loc(cell, "descriptionCourte")}
        </p>
      </div>
      {cell.chef && (
        <div className="mt-6 text-xs text-[#657a90]/70 dark:text-white/40">
          {t("cells.lead")} — {cell.chef.nom}
        </div>
      )}
    </Link>
  );
}
