/**
 * Bandeau de logos qui défile en boucle infinie (sans dépendance externe).
 * Le tableau est dupliqué une fois : la copie visible + une copie
 * aria-hidden, translatée de -50% en continu pour donner l'illusion d'un
 * défilement sans fin. Pause au survol, désactivé si mouvement réduit.
 * Taille/vitesse/espacement réglables via les variables CSS de .logo-loop
 * (voir index.css).
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
