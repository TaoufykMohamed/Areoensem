import { Link } from "react-router-dom";
import { useLocale } from "../../hooks/useLocale.js";

/**
 * Grille de cellules en cartes verticales avec image de fond et effet
 * "hover reveal" : au survol d'une carte, toutes les autres s'assombrissent
 * et se floutent légèrement (pur CSS via group-hover, pas de JS) pendant
 * que la carte survolée ressort. cell.image vient du dashboard (upload
 * réel, voir DashboardCells.jsx) ; les cellules sans image reçoivent un
 * dégradé de repli plutôt qu'un fond cassé.
 */
export default function CellHoverGrid({ cells }) {
  const { t: loc } = useLocale();

  return (
    <div role="list" className="group grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      {cells.map((cell) => {
        const title = loc(cell, "nom");
        const subtitle = cell.chef?.nom || "";

        return (
          <Link
            key={cell._id}
            to={`/cellules/${cell.slug}`}
            role="listitem"
            aria-label={subtitle ? `${title}, ${subtitle}` : title}
            className="relative block h-80 overflow-hidden rounded-xl bg-cover bg-center shadow-lg outline-none transition-all duration-500 ease-in-out group-hover:scale-[0.97] group-hover:opacity-60 group-hover:blur-[2px] hover:!scale-105 hover:!opacity-100 hover:!blur-none focus-visible:!scale-105 focus-visible:!opacity-100 focus-visible:!blur-none focus-visible:!ring-2 focus-visible:!ring-brand-cyan"
            style={cell.image ? { backgroundImage: `url(${cell.image})` } : undefined}
          >
            {!cell.image && <div className="absolute inset-0 bg-gradient-to-br from-[#0b2545] to-[#04101f]" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              {subtitle && <p className="text-sm font-light uppercase tracking-widest opacity-80">{subtitle}</p>}
              <h3 className="mt-1 text-2xl font-semibold">{title}</h3>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
