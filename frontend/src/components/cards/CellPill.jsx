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
      className="whitespace-nowrap rounded-full border border-black/10 bg-black/[0.02] px-8 py-4 font-serif text-lg text-anthracite transition-colors hover:border-brand-cyan hover:text-brand-cyan dark:border-white/15 dark:bg-white/5 dark:text-white"
    >
      {loc(cell, "nom")}
    </Link>
  );
}
