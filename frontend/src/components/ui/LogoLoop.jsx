// Au-delà de ce nombre de partenaires, le bandeau se scinde en deux lignes
// qui défilent en sens opposés plutôt qu'une seule ligne très longue.
const TWO_ROW_THRESHOLD = 5;

function LoopRow({ items, reverse }) {
  const loop = [...items, ...items];

  return (
    <div className={reverse ? "logo-loop logo-loop--reverse" : "logo-loop"}>
      <div className="logo-loop__track">
        {loop.map((p, i) => (
          <div
            key={`${p._id}-${i}`}
            aria-hidden={i >= items.length ? "true" : undefined}
            className="logo-loop__item flex items-center justify-center"
          >
            {p.logo ? (
              <img src={p.logo} alt={p.nom} className="h-full w-auto object-contain" />
            ) : (
              <span className="text-lg font-extrabold text-[#657a90] dark:text-white/50">
                {p.nom}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Bandeau de logos qui défile en boucle infinie (sans dépendance externe).
 * Chaque ligne duplique son tableau une fois : la copie visible + une copie
 * aria-hidden, translatée de -50% en continu pour donner l'illusion d'un
 * défilement sans fin — aucun logo ne "disparaît" jamais, il ressort par
 * l'autre bord. Pause au survol, désactivé si mouvement réduit.
 * Taille/vitesse/espacement réglables via les variables CSS de .logo-loop
 * (voir index.css).
 */
export default function LogoLoop({ partners }) {
  if (partners.length < TWO_ROW_THRESHOLD) {
    return <LoopRow items={partners} />;
  }

  const mid = Math.ceil(partners.length / 2);
  return (
    <div className="flex flex-col gap-6">
      <LoopRow items={partners.slice(0, mid)} />
      <LoopRow items={partners.slice(mid)} reverse />
    </div>
  );
}
