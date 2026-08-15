import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Motif "bento" (large / étroit / étroit / large...) répété sur les items,
// dans l'esprit du LayoutGrid d'Aceternity (réimplémenté ici en simple
// React/Tailwind/framer-motion — déjà des dépendances du projet, voir la
// mésaventure shadcn/Tailwind v4 plus haut).
const SPAN_PATTERN = ["md:col-span-2", "col-span-1", "col-span-1", "md:col-span-2"];

function GridCard({ item, span, onOpen }) {
  return (
    <motion.div
      layoutId={`gallery-card-${item.id}`}
      onClick={() => onOpen(item.id)}
      className={`group relative h-full cursor-pointer overflow-hidden rounded-xl bg-black/5 dark:bg-white/5 ${span}`}
    >
      <img
        src={item.image}
        alt={item.caption}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {item.caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <p className="text-sm font-medium text-white">{item.caption}</p>
        </div>
      )}
    </motion.div>
  );
}

/** Grille "bento" avec expansion animée au clic (transition d'élément partagé via layoutId). */
export default function LayoutGrid({ items }) {
  const [selectedId, setSelectedId] = useState(null);
  const selected = items.find((i) => i.id === selectedId);

  return (
    <>
      <div className="grid auto-rows-[220px] grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((item, i) => (
          <GridCard key={item.id} item={item} span={SPAN_PATTERN[i % SPAN_PATTERN.length]} onOpen={setSelectedId} />
        ))}
      </div>

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
              <img src={selected.image} alt={selected.caption} className="max-h-[80vh] w-full object-contain" />
              {selected.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <p className="text-lg font-medium text-white">{selected.caption}</p>
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
    </>
  );
}
