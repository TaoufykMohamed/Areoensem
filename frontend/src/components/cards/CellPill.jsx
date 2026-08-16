import { Link } from "react-router-dom";
import { useLocale } from "../../hooks/useLocale.js";

/**
 * Version minimaliste de CellCard pour la pyramide inversée de l'accueil :
 * juste le nom, en pilule. La liste complète (/cellules) garde CellCard
 * intact avec sa description et son responsable.
 */
export default function CellPill({ cell }) {
  const { t: loc } = useLocale();

  return (
    <Link
      to={`/cellules/${cell.slug}`}
      className="whitespace-nowrap rounded-full border border-brand-cyan/25 bg-brand-cyan/5 px-8 py-4 font-serif text-lg text-anthracite shadow-[0_0_14px_rgba(34,211,238,0.12)] transition-all hover:border-brand-cyan hover:shadow-[0_0_22px_rgba(34,211,238,0.3)] dark:border-brand-cyan/50 dark:bg-brand-cyan/10 dark:text-white dark:shadow-[0_0_22px_rgba(34,211,238,0.35)] dark:hover:shadow-[0_0_34px_rgba(34,211,238,0.55)]"
    >
      {loc(cell, "nom")}
    </Link>
  );
}
