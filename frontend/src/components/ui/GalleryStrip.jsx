import { useLayoutEffect, useRef, useState } from "react";

/**
 * Rangée de photos défilable horizontalement. Barre de défilement native
 * stylée (voir .gallery-strip dans index.css) + indicateur de progression
 * personnalisé sous la rangée (fiable quel que soit le rendu des
 * scrollbars natives selon navigateur/OS). Chaque carte a un overlay
 * texte (légende en gras + description) posé sur l'image, seulement s'il
 * y a effectivement une légende ou une description à afficher.
 */
export default function GalleryStrip({ items }) {
  const trackRef = useRef(null);
  const [progress, setProgress] = useState({ ratio: 0, thumbPct: 100 });

  const measure = () => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const ratio = max > 0 ? el.scrollLeft / max : 0;
    const thumbPct = el.scrollWidth > 0 ? Math.min(100, (el.clientWidth / el.scrollWidth) * 100) : 100;
    setProgress({ ratio, thumbPct });
  };

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const showIndicator = progress.thumbPct < 100;
  const travel = progress.thumbPct > 0 ? (100 - progress.thumbPct) / progress.thumbPct : 0;

  return (
    <div>
      <div ref={trackRef} onScroll={measure} className="gallery-strip flex gap-4 overflow-x-auto pb-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative h-72 w-64 flex-shrink-0 overflow-hidden rounded-2xl bg-black/5 dark:bg-white/5"
          >
            <img src={item.image} alt={item.title || ""} className="h-full w-full object-cover" />
            {(item.title || item.description) && (
              <div className="absolute inset-x-3 bottom-3 rounded-xl bg-gradient-to-t from-black/85 via-black/60 to-black/0 p-4 pt-10">
                {item.title && <p className="font-bold text-white">{item.title}</p>}
                {item.description && (
                  <p className="mt-1 line-clamp-3 text-sm font-normal text-white/75">{item.description}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {showIndicator && (
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-brand-cyan transition-[transform] duration-75"
            style={{ width: `${progress.thumbPct}%`, transform: `translateX(${progress.ratio * travel * 100}%)` }}
          />
        </div>
      )}
    </div>
  );
}
