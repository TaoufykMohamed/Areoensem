import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Motif "bento" (large / étroit / étroit / large...) répété sur les items,
// dans l'esprit du LayoutGrid d'Aceternity (réimplémenté ici en simple
// React/Tailwind/framer-motion — déjà des dépendances du projet, voir la
// mésaventure shadcn/Tailwind v4 plus haut).
const SPAN_PATTERN = ["md:col-span-2", "col-span-1", "col-span-1", "md:col-span-2"];
const MAX_HEIGHT = 560;

function GridCard({ item, span, onOpen }) {
  return (
    <motion.div
      layoutId={`gallery-card-${item.id}`}
      onClick={() => onOpen(item.id)}
      className={`group relative h-full cursor-pointer overflow-hidden rounded-xl bg-black/5 dark:bg-white/5 ${span}`}
    >
      <img
        src={item.image}
        alt={item.title || ""}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {item.title && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <p className="text-sm font-bold text-white">{item.title}</p>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Grille "bento" défilable verticalement (scrollbar native stylée +
 * indicateur de progression fiable — voir GalleryStrip pour le même
 * principe en horizontal). Clic sur une carte → expansion animée
 * (transition d'élément partagé via layoutId) avec légende + description.
 */
export default function LayoutGrid({ items }) {
  const [selectedId, setSelectedId] = useState(null);
  const selected = items.find((i) => i.id === selectedId);

  const scrollRef = useRef(null);
  const [progress, setProgress] = useState({ ratio: 0, thumbPct: 100 });

  const measure = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    const ratio = max > 0 ? el.scrollTop / max : 0;
    const thumbPct = el.scrollHeight > 0 ? Math.min(100, (el.clientHeight / el.scrollHeight) * 100) : 100;
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
    <div className="flex gap-3">
      <div
        ref={scrollRef}
        onScroll={measure}
        style={{ maxHeight: MAX_HEIGHT }}
        className="gallery-grid-scroll grid flex-1 auto-rows-[240px] grid-cols-1 gap-4 overflow-y-auto pr-3 md:grid-cols-3"
      >
        {items.map((item, i) => (
          <GridCard key={item.id} item={item} span={SPAN_PATTERN[i % SPAN_PATTERN.length]} onOpen={setSelectedId} />
        ))}
      </div>

      {showIndicator && (
        <div
          style={{ height: MAX_HEIGHT }}
          className="w-1 flex-shrink-0 overflow-hidden rounded-full bg-black/10 dark:bg-white/10"
        >
          <div
            className="w-full rounded-full bg-brand-cyan transition-[transform] duration-75"
            style={{
              height: `${progress.thumbPct}%`,
              transform: `translateY(${progress.ratio * travel * 100}%)`,
            }}
          />
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              layoutId={`gallery-card-${selected.id}`}
              className="relative max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-[#04101f]"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selected.image} alt={selected.title || ""} className="max-h-[80vh] w-full object-contain" />
              {(selected.title || selected.description) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/60 to-transparent p-6">
                  {selected.title && <p className="text-lg font-bold text-white">{selected.title}</p>}
                  {selected.description && (
                    <p className="mt-2 text-sm font-normal text-white/80">{selected.description}</p>
                  )}
                </div>
              )}
              <button
                onClick={() => setSelectedId(null)}
                aria-label="Fermer"
                className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
