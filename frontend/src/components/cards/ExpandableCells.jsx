import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "../../hooks/useLocale.js";
import { useFetch } from "../../hooks/useFetch.js";
import { boardApi } from "../../api/board.js";

// Aucun lien structurel entre une cellule et le bureau (BoardMember,
// collection distincte) : le seul point commun est le texte. Le Bureau est
// la source à jour pour "qui dirige quoi" (le lien User.cellule/membres de
// la cellule peut être resté sur un ancien nom) — on rapproche donc un
// poste de bureau ("Chef Projet", "Responsable Média", orthographes
// variables selon quand il a été saisi) au nom de la cellule via les mots
// significatifs qu'ils ont en commun, insensible aux accents/casse et
// tolérant aux abréviations ("Evénement" ~ "Event").
function normalizeText(str) {
  return (str || "")
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const ROLE_WORDS = new Set(["CHEF", "CHEFFE", "RESPONSABLE", "RESPO", "CONSEILLERE", "CONSEILLER"]);

function significantWordPrefixes(str) {
  return normalizeText(str)
    .split(" ")
    .filter((w) => w.length >= 4 && !ROLE_WORDS.has(w))
    .map((w) => w.slice(0, 4));
}

function findCellChefInBoard(cell, boardMembers) {
  if (!boardMembers?.length) return null;
  const cellPrefixes = significantWordPrefixes(cell.nomFr);
  if (cellPrefixes.length === 0) return null;
  return (
    boardMembers.find((m) => significantWordPrefixes(m.posteFr).some((p) => cellPrefixes.includes(p))) || null
  );
}

// Rapprochement par nom exact — utilisé seulement en repli, pour donner
// quand même un lien vers le Bureau si le poste n'a pas matché mais que le
// nom, lui, coïncide.
function findBoardMatchByName(responsable, boardMembers) {
  if (!responsable || !boardMembers) return null;
  const target = responsable.nom.trim().toLowerCase();
  return boardMembers.find((m) => m.nom.trim().toLowerCase() === target) || null;
}

// Saison académique courante (aucun champ backend dédié) : année scolaire
// marocaine, réputée démarrer en septembre.
function currentSeason() {
  const now = new Date();
  const year = now.getFullYear();
  return now.getMonth() >= 8 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}

// Priorité : le Bureau (à jour) > le "chef" lié au compte utilisateur > le
// membre de la cellule dont le rôle mentionne "chef" (repli historique).
function getResponsable(cell, boardMembers) {
  const boardChef = findCellChefInBoard(cell, boardMembers);
  if (boardChef) return { nom: boardChef.nom, email: boardChef.email, boardId: boardChef._id };
  if (cell.chef?.nom) return { nom: cell.chef.nom, email: cell.chef.email };
  const membre = cell.membres?.find((m) => `${m.roleFr} ${m.roleEn}`.toLowerCase().includes("chef"));
  return membre ? { nom: membre.nom, email: null } : null;
}

function FacebookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.5 9.95v-7.04H7.9V12h2.6V9.8c0-2.56 1.53-3.98 3.87-3.98 1.12 0 2.3.2 2.3.2v2.53h-1.3c-1.28 0-1.68.8-1.68 1.62V12h2.86l-.46 2.91h-2.4v7.04A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM9 9h3.8v1.7h.1c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.4c0-1.3-.02-2.96-1.8-2.96-1.81 0-2.09 1.42-2.09 2.87V21H9z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 3c.3 2.1 1.7 3.7 3.9 4v3c-1.4 0-2.7-.4-3.9-1.2v6.6c0 3.6-2.9 6.6-6.6 6.6S3.3 19 3.3 15.4 6.2 8.8 9.9 8.8c.4 0 .8 0 1.2.1v3.2c-.4-.1-.8-.2-1.2-.2-1.9 0-3.4 1.5-3.4 3.4s1.5 3.4 3.4 3.4 3.4-1.5 3.4-3.4V3h3.2Z" />
    </svg>
  );
}

const SOCIAL_ICONS = { facebook: FacebookIcon, linkedin: LinkedinIcon, instagram: InstagramIcon, tiktok: TiktokIcon };

function SocialLinks({ reseauxSociaux }) {
  const entries = Object.entries(reseauxSociaux || {}).filter(([, url]) => url);
  if (entries.length === 0) return null;
  return (
    <div className="mt-4 flex gap-2">
      {entries.map(([key, url]) => {
        const Icon = SOCIAL_ICONS[key];
        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noreferrer"
            aria-label={key}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 hover:border-brand-cyan hover:text-brand-cyan"
          >
            <Icon />
          </a>
        );
      })}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-8 first:mt-0">
      <h3 className="mb-3 font-mono text-[11px] uppercase tracking-instrument text-brand-cyan">{title}</h3>
      {children}
    </div>
  );
}

function CellCard({ cell, title, subtitle, onOpen }) {
  return (
    <motion.div
      layoutId={`cell-card-${cell._id}`}
      role="listitem"
      tabIndex={0}
      aria-label={subtitle ? `${title}, ${subtitle}` : title}
      onClick={() => onOpen(cell._id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(cell._id);
        }
      }}
      className="relative block h-80 cursor-pointer overflow-hidden rounded-xl bg-cover bg-center shadow-lg outline-none transition-all duration-500 ease-in-out group-hover:scale-[0.97] group-hover:opacity-60 group-hover:blur-[2px] hover:!scale-105 hover:!opacity-100 hover:!blur-none focus-visible:!scale-105 focus-visible:!opacity-100 focus-visible:!blur-none focus-visible:!ring-2 focus-visible:!ring-brand-cyan"
      style={cell.image ? { backgroundImage: `url(${cell.image})` } : undefined}
    >
      {!cell.image && <div className="absolute inset-0 bg-gradient-to-br from-[#0b2545] to-[#04101f]" />}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 text-white">
        {subtitle && <p className="text-sm font-light uppercase tracking-widest opacity-80">{subtitle}</p>}
        <h3 className="mt-1 text-2xl font-semibold">{title}</h3>
      </div>
    </motion.div>
  );
}

/**
 * Grille de cellules (même traitement visuel que l'ancien CellHoverGrid)
 * dont le clic n'ouvre plus la page /cellules/:slug mais fait grossir la
 * carte, via layoutId, en une modale détaillée (transition d'élément
 * partagé — même mécanisme que LayoutGrid pour la galerie).
 */
export default function ExpandableCells({ cells }) {
  const { t } = useTranslation();
  const { t: loc } = useLocale();
  const [selectedId, setSelectedId] = useState(null);
  const selected = cells.find((c) => c._id === selectedId);
  const { data: boardMembers } = useFetch(() => boardApi.list(), []);
  const responsable = selected ? getResponsable(selected, boardMembers) : null;
  const boardMatch = responsable?.boardId
    ? boardMembers?.find((m) => m._id === responsable.boardId)
    : findBoardMatchByName(responsable, boardMembers);

  useEffect(() => {
    if (!selectedId) return;
    const onKeyDown = (e) => e.key === "Escape" && setSelectedId(null);
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedId]);

  const season = currentSeason();

  return (
    <>
      <div role="list" className="group grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {cells.map((cell) => (
          <CellCard
            key={cell._id}
            cell={cell}
            title={loc(cell, "nom")}
            subtitle={getResponsable(cell, boardMembers)?.nom || ""}
            onOpen={setSelectedId}
          />
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              layoutId={`cell-card-${selected._id}`}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-white/10 bg-[#04101f] text-white"
            >
              <button
                onClick={() => setSelectedId(null)}
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
                    {selected.image ? (
                      <img src={selected.image} alt="" className="aspect-[3/4] w-full object-cover" />
                    ) : (
                      <div className="aspect-[3/4] w-full bg-gradient-to-br from-[#0b2545] to-[#04101f]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                    {responsable && (
                      <div className="absolute bottom-0 left-0 p-5 text-white">
                        <p className="text-xs font-light uppercase tracking-widest opacity-80">
                          {t("cells.leadRole")}
                        </p>
                        <p className="mt-1 text-xl font-semibold">{responsable.nom}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <h4 className="mb-3 font-mono text-[11px] uppercase tracking-instrument text-brand-cyan">
                      {t("cells.quickInfo")}
                    </h4>
                    <dl className="space-y-3 text-sm">
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-white/40">{t("cells.pole")}</dt>
                        <dd className="text-right text-white/85">{loc(selected, "nom")}</dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-white/40">{t("cells.activeProjects")}</dt>
                        <dd className="text-white/85">
                          {selected.projets?.filter((p) => p.statut === "en_cours").length || 0}
                        </dd>
                      </div>
                      {selected.technologies?.length > 0 && (
                        <div>
                          <dt className="text-white/40">{t("cells.tools")}</dt>
                          <dd className="mt-2 flex flex-wrap gap-1.5">
                            {selected.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-white/70"
                              >
                                {tech}
                              </span>
                            ))}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>

                {/* Colonne droite */}
                <div>
                  <span className="inline-block rounded-full border border-brand-cyan/30 px-3 py-1 font-mono text-[10px] uppercase tracking-instrument text-brand-cyan">
                    {t("cells.category")}
                  </span>
                  <h2 className="mt-3 font-serif text-3xl md:text-4xl">{loc(selected, "nom")}</h2>
                  <SocialLinks reseauxSociaux={selected.reseauxSociaux} />

                  <Section title={t("cells.descriptionObjectives")}>
                    <p className="whitespace-pre-line text-[15px] leading-relaxed text-white/70">
                      {loc(selected, "descriptionLongue") || loc(selected, "descriptionCourte")}
                    </p>
                    {loc(selected, "objectifs")?.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {loc(selected, "objectifs").map((obj, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-cyan" />
                            {obj}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Section>

                  {selected.projets?.length > 0 && (
                    <Section title={t("cells.completedProjects")}>
                      <div className="space-y-3">
                        {selected.projets.map((p) => (
                          <div key={p._id} className="rounded-lg border border-white/10 p-4">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <h5 className="font-semibold text-white/90">{loc(p, "titre")}</h5>
                              {p.annee && (
                                <span className="font-mono text-[10px] uppercase tracking-instrument text-white/40">
                                  {p.annee}
                                </span>
                              )}
                            </div>
                            {loc(p, "description") && (
                              <p className="mt-1 text-sm text-white/60">{loc(p, "description")}</p>
                            )}
                            {p.documentUrl && (
                              <a
                                href={p.documentUrl}
                                download
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-flex items-center gap-2 rounded-full border border-brand-cyan/40 px-4 py-1.5 text-xs font-semibold text-brand-cyan hover:bg-brand-cyan/10"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M12 3v12m0 0l-4-4m4 4l4-4" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {t("cells.downloadDossier")}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </Section>
                  )}

                  {selected.technologies?.length > 0 && (
                    <Section title={t("cells.skills")}>
                      <div className="flex flex-wrap gap-2">
                        {selected.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-white/80"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </Section>
                  )}

                  <div className="mt-10 rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 p-6 text-center">
                    <p className="text-white/80">{t("cells.ctaText")}</p>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                      <Link
                        to={`/rejoindre?cellule=${selected._id}`}
                        className="rounded-full bg-brand-cyan px-6 py-3 text-sm font-semibold text-[#04101f] hover:bg-white"
                      >
                        {t("cells.joinCell")}
                      </Link>
                      <Link
                        to={boardMatch ? `/bureau?membre=${boardMatch._id}` : responsable ? "/bureau" : "/contact"}
                        className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:border-brand-amber hover:text-brand-amber"
                      >
                        {t("cells.contactLead")}
                      </Link>
                    </div>
                    <p className="mt-4 text-right font-mono text-[10px] uppercase tracking-instrument text-white/30">
                      {t("cells.season")} · {season}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
