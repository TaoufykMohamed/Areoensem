import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "../../hooks/useLocale.js";
import { eventsApi } from "../../api/events.js";

const STATUT_STYLES = {
  a_venir: "bg-brand-cyan text-[#04101f]",
  en_cours: "bg-brand-amber text-[#04101f]",
  passe: "bg-white/20 text-white",
};

const initialRegForm = { nom: "", email: "", telephone: "", filiere: "", annee: "", motivation: "" };
const regInputClass =
  "rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 focus:border-brand-cyan focus:outline-none";

function statutKey(statut) {
  return statut === "a_venir" ? "upcoming" : statut === "en_cours" ? "ongoing" : "past";
}

function shortDate(event, lang) {
  return new Date(event.dateDebut).toLocaleDateString(lang === "en" ? "en-GB" : "fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fullDate(event, lang) {
  const opts = { day: "2-digit", month: "long", year: "numeric" };
  const start = new Date(event.dateDebut).toLocaleDateString(lang === "en" ? "en-GB" : "fr-FR", opts);
  const sameDay = new Date(event.dateDebut).toDateString() === new Date(event.dateFin).toDateString();
  if (sameDay) return start;
  const end = new Date(event.dateFin).toLocaleDateString(lang === "en" ? "en-GB" : "fr-FR", opts);
  return `${start} – ${end}`;
}

function canRegister(event) {
  return event.inscriptionsOuvertes && (!event.capacite || event.nombreParticipants < event.capacite);
}

function StatutBadge({ statut, t }) {
  return (
    <span
      className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-instrument ${STATUT_STYLES[statut]}`}
    >
      {t(`events.${statutKey(statut)}`)}
    </span>
  );
}

function EventGridCard({ event, onOpen, t, loc, lang }) {
  return (
    <motion.div
      layoutId={`event-card-${event._id}`}
      role="listitem"
      tabIndex={0}
      aria-label={loc(event, "titre")}
      onClick={() => onOpen(event._id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(event._id);
        }
      }}
      className="relative block h-80 cursor-pointer overflow-hidden rounded-xl bg-cover bg-center shadow-lg outline-none transition-all duration-500 ease-in-out group-hover:scale-[0.97] group-hover:opacity-60 group-hover:blur-[2px] hover:!scale-105 hover:!opacity-100 hover:!blur-none focus-visible:!scale-105 focus-visible:!opacity-100 focus-visible:!blur-none focus-visible:!ring-2 focus-visible:!ring-brand-cyan"
      style={event.affiche ? { backgroundImage: `url(${event.affiche})` } : undefined}
    >
      {!event.affiche && <div className="absolute inset-0 bg-gradient-to-br from-[#0b2545] to-[#04101f]" />}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

      <div className="absolute inset-x-0 top-0 flex items-center gap-3 p-4">
        <StatutBadge statut={event.statut} t={t} />
        <span className="font-mono text-[11px] text-white/70">{shortDate(event, lang)}</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <h3 className="font-serif text-xl font-semibold">{loc(event, "titre")}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-white/70">{loc(event, "description")}</p>
        <div className="mt-3 font-mono text-[11px] uppercase tracking-instrument text-white/50">
          {loc(event, "lieu")}
        </div>
      </div>
    </motion.div>
  );
}

function EventTimelineItem({ event, onOpen, t, loc, lang }) {
  return (
    <li className="relative">
      <span className="absolute -left-[38px] top-1.5 h-3 w-3 rounded-full bg-brand-cyan" />
      <motion.div
        layoutId={`event-card-${event._id}`}
        role="button"
        tabIndex={0}
        onClick={() => onOpen(event._id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen(event._id);
          }
        }}
        className="group inline-block w-full cursor-pointer text-left outline-none"
      >
        <div className="font-mono text-xs text-[#657a90] dark:text-white/40">{shortDate(event, lang)}</div>
        <div className="font-serif text-xl group-hover:text-brand-cyan">{loc(event, "titre")}</div>
        <p className="mt-1 text-sm text-[#657a90] dark:text-white/50">{loc(event, "lieu")}</p>
      </motion.div>
    </li>
  );
}

function RegistrationForm({ event, t }) {
  const [form, setForm] = useState(initialRegForm);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      await eventsApi.register(event._id, form);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  if (status === "success") {
    return <p className="text-center text-sm text-brand-cyan">{t("events.registerSuccess")}</p>;
  }

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <input
        required
        placeholder={t("common.name")}
        value={form.nom}
        onChange={(e) => setForm({ ...form, nom: e.target.value })}
        className={regInputClass}
      />
      <input
        required
        type="email"
        placeholder={t("common.email")}
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className={regInputClass}
      />
      <input
        required
        placeholder={t("common.phone")}
        value={form.telephone}
        onChange={(e) => setForm({ ...form, telephone: e.target.value })}
        className={regInputClass}
      />
      <input
        required
        placeholder={t("events.fields.filiere")}
        value={form.filiere}
        onChange={(e) => setForm({ ...form, filiere: e.target.value })}
        className={regInputClass}
      />
      <input
        required
        placeholder={t("events.fields.annee")}
        value={form.annee}
        onChange={(e) => setForm({ ...form, annee: e.target.value })}
        className={`${regInputClass} sm:col-span-2`}
      />
      <textarea
        placeholder={t("events.fields.motivation")}
        value={form.motivation}
        onChange={(e) => setForm({ ...form, motivation: e.target.value })}
        rows={2}
        className={`${regInputClass} sm:col-span-2`}
      />
      {status === "error" && <p className="text-xs text-red-400 sm:col-span-2">{errorMsg}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-brand-cyan px-6 py-3 text-sm font-semibold text-[#04101f] hover:bg-white disabled:opacity-50 sm:col-span-2"
      >
        {t("events.registerCta")}
      </button>
    </form>
  );
}

/**
 * Modale détaillée d'un événement — extraite pour être réutilisable en
 * dehors de la liste (voir Home.jsx : le bouton "S'inscrire" du prochain
 * événement ouvre la même modale plutôt que de naviguer). L'inscription se
 * fait directement ici ; il n'y a plus de page /evenements/:slug à visiter.
 */
export function EventModal({ event, onClose }) {
  const { t, i18n } = useTranslation();
  const { t: loc } = useLocale();
  const lang = i18n.language;

  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        layoutId={`event-card-${event._id}`}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[85vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-white/10 bg-[#04101f] text-white"
      >
        <button
          onClick={onClose}
          aria-label={t("common.close")}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <div className="grid gap-8 p-6 md:grid-cols-[340px_1fr] md:p-10">
          {/* Colonne gauche */}
          <div>
            <div className="relative overflow-hidden rounded-xl">
              {event.affiche ? (
                <img src={event.affiche} alt="" className="aspect-[3/4] w-full object-cover" />
              ) : (
                <div className="aspect-[3/4] w-full bg-gradient-to-br from-[#0b2545] to-[#04101f]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              {event.cellule && (
                <div className="absolute bottom-0 left-0 p-5 text-white">
                  <p className="text-xs font-light uppercase tracking-widest opacity-80">
                    {t("events.organizedBy")}
                  </p>
                  <p className="mt-1 text-xl font-semibold">{loc(event.cellule, "nom")}</p>
                </div>
              )}
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <h4 className="mb-3 font-mono text-[11px] uppercase tracking-instrument text-brand-cyan">
                {t("events.quickInfo")}
              </h4>
              <dl className="space-y-3 text-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-white/40">{t("common.date")}</dt>
                  <dd className="text-right text-white/85">{fullDate(event, lang)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-white/40">{t("events.venue")}</dt>
                  <dd className="text-right text-white/85">{loc(event, "lieu")}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-white/40">{t("events.capacity")}</dt>
                  <dd className="text-white/85">
                    {event.capacite ? `${event.nombreParticipants}/${event.capacite}` : t("events.unlimited")}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Colonne droite */}
          <div>
            <StatutBadge statut={event.statut} t={t} />
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">{loc(event, "titre")}</h2>
            <p className="mt-2 text-sm text-white/60">
              {fullDate(event, lang)} — {loc(event, "lieu")}
            </p>

            <div className="mt-8">
              <h3 className="mb-3 font-mono text-[11px] uppercase tracking-instrument text-brand-cyan">
                {t("events.description")}
              </h3>
              <p className="whitespace-pre-line text-[15px] leading-relaxed text-white/70">
                {loc(event, "description")}
              </p>
            </div>

            {event.invites?.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-3 font-mono text-[11px] uppercase tracking-instrument text-brand-cyan">
                  {t("events.guests")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {event.invites.map((name) => (
                    <span
                      key={name}
                      className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-white/80"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {event.statut === "passe" && loc(event, "compteRendu") && (
              <div className="mt-8">
                <h3 className="mb-3 font-mono text-[11px] uppercase tracking-instrument text-brand-cyan">
                  {t("events.report")}
                </h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-white/70">
                  {loc(event, "compteRendu")}
                </p>
              </div>
            )}

            {event.galerie?.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-3 font-mono text-[11px] uppercase tracking-instrument text-brand-cyan">
                  {t("events.gallery")}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {event.galerie.map((src, i) => (
                    <img key={i} src={src} alt="" className="aspect-square w-full rounded-lg object-cover" />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 p-6">
              {canRegister(event) ? (
                <>
                  <p className="text-center text-white/80">{t("events.ctaText")}</p>
                  <div className="mt-4">
                    <RegistrationForm event={event} t={t} />
                  </div>
                </>
              ) : (
                <p className="text-center text-white/60">
                  {event.statut === "passe" ? t("events.eventEnded") : t("events.registrationsClosed")}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Miroir d'ExpandableCells pour les événements : la liste (grille pour
 * à venir/en cours, timeline verticale pour passés) ne navigue plus vers
 * une page au clic — la carte grossit en place, via layoutId, en une modale
 * détaillée (EventModal) où l'inscription se fait directement.
 */
export default function ExpandableEvents({ events, variant = "grid" }) {
  const { t, i18n } = useTranslation();
  const { t: loc } = useLocale();
  const lang = i18n.language;
  const [selectedId, setSelectedId] = useState(null);
  const selected = events.find((e) => e._id === selectedId);

  return (
    <>
      {variant === "timeline" ? (
        <ol className="relative ml-3 space-y-8 border-l border-black/10 pl-8 dark:border-white/10">
          {events.map((event) => (
            <EventTimelineItem key={event._id} event={event} onOpen={setSelectedId} t={t} loc={loc} lang={lang} />
          ))}
        </ol>
      ) : (
        <div role="list" className="group grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventGridCard key={event._id} event={event} onOpen={setSelectedId} t={t} loc={loc} lang={lang} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && <EventModal event={selected} onClose={() => setSelectedId(null)} />}
      </AnimatePresence>
    </>
  );
}
