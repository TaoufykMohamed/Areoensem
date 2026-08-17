import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { messagesApi } from "../../api/messages.js";

function MessageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m22 2-7 20-4-9-9-4Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 2 11 13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Petit widget de feedback (déclencheur + popover), autonome — pas de
 * dépendance ajoutée (pas d'Ark UI/Radix, voir la mésaventure
 * shadcn/Tailwind v4 plus haut dans ce projet) : ouverture/fermeture au
 * clic + clic extérieur, dans l'esprit des autres popovers de l'app.
 * Envoie vers le même backend que le formulaire de contact (Message,
 * type "feedback" — anonyme, pas de nom/email requis).
 *
 * `eventId` : quand fourni (utilisation depuis la modale d'un événement,
 * voir ExpandableEvents.jsx), le feedback est rattaché à cet événement
 * plutôt que d'être générique.
 *
 * `variant` : "floating" (défaut) — pastille fixe en bas à droite de
 * l'écran, réactive au thème clair/sombre du site, pour un usage pleine
 * page. "inline" — petit lien discret positionné dans le flux, stylé pour
 * le fond systématiquement sombre des modales (Cells/Events).
 */
export default function FeedbackWidget({ eventId, variant = "floating" }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("idle");
  const containerRef = useRef(null);
  const inline = variant === "inline";

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const submit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setStatus("loading");
    try {
      await messagesApi.create({ contenu: feedback, type: "feedback", ...(eventId ? { event: eventId } : {}) });
      setStatus("success");
      setTimeout(() => {
        setOpen(false);
        setStatus("idle");
        setFeedback("");
      }, 1800);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div ref={containerRef} className={inline ? "relative inline-block" : "fixed bottom-6 right-6 z-40"}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={
              inline
                ? "absolute bottom-full right-0 z-20 mb-3 w-72 rounded-xl border border-white/10 bg-[#0b1622] p-4 shadow-xl"
                : "absolute bottom-full right-0 mb-3 w-72 rounded-xl border border-black/10 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-[#0b1622]"
            }
          >
            <h3 className={`mb-3 text-sm font-semibold ${inline ? "text-white" : "text-anthracite dark:text-white"}`}>
              {t("feedback.title")}
            </h3>
            {status === "success" ? (
              <p className="py-2 text-sm text-brand-cyan">{t("feedback.success")}</p>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-3">
                <textarea
                  autoFocus
                  required
                  rows={3}
                  placeholder={eventId ? t("feedback.placeholderEvent") : t("feedback.placeholder")}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  disabled={status === "loading"}
                  className={
                    inline
                      ? "resize-none rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm text-white placeholder-white/40 focus:border-brand-cyan focus:outline-none"
                      : "resize-none rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm text-anthracite placeholder-[#657a90] focus:border-brand-cyan focus:outline-none dark:border-white/15 dark:text-white dark:placeholder-white/40"
                  }
                />
                {status === "error" && <p className="text-xs text-red-500">{t("common.error")}</p>}
                <button
                  type="submit"
                  disabled={!feedback.trim() || status === "loading"}
                  className="inline-flex items-center justify-center gap-2 self-end rounded-full bg-brand-cyan px-4 py-2 text-xs font-semibold text-[#04101f] hover:bg-brand-amber disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <SendIcon />
                  {status === "loading" ? t("feedback.sending") : t("feedback.submit")}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={
          inline
            ? "inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/60 hover:border-brand-cyan hover:text-brand-cyan"
            : "inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-anthracite shadow-lg hover:border-brand-cyan/50 dark:border-white/15 dark:bg-[#0b1622] dark:text-white"
        }
      >
        <MessageIcon />
        {t("feedback.trigger")}
      </button>
    </div>
  );
}
