/**
 * Bandeau de logos qui défile en boucle infinie (sans dépendance externe).
 * Le tableau est dupliqué une fois : la copie visible + une copie
 * aria-hidden, translatée de -50% en continu pour donner l'illusion d'un
 * défilement sans fin. Pause au survol, désactivé si mouvement réduit.
 */
export default function LogoLoop({ partners }) {
  const loop = [...partners, ...partners];

  return (
    <div className="logo-loop">
      <div className="logo-loop__track">
        {loop.map((p, i) => (
          <div
            key={`${p._id}-${i}`}
            aria-hidden={i >= partners.length ? "true" : undefined}
            className="logo-loop__item flex h-24 w-44 items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-4 shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            {p.logo ? (
              <img src={p.logo} alt={p.nom} className="max-h-12 max-w-full object-contain" />
            ) : (
              <span className="text-center text-sm font-extrabold text-[#657a90] dark:text-white/50">
                {p.nom}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
