import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../hooks/useFetch.js";
import { useLocale } from "../hooks/useLocale.js";
import { boardApi } from "../api/board.js";
import PageHero from "../components/layout/PageHero.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import Reveal from "../components/ui/Reveal.jsx";

function LinkedinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM9 9h3.8v1.7h.1c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.4c0-1.3-.02-2.96-1.8-2.96-1.81 0-2.09 1.42-2.09 2.87V21H9z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MemberPhoto({ member, dim }) {
  if (!member.photo) {
    return <div className="h-full w-full bg-gradient-to-br from-[#0b2545] to-[#04101f]" />;
  }
  return (
    <img
      src={member.photo}
      alt={member.nom}
      className={`h-full w-full object-cover object-top transition-all duration-500 ${
        dim ? "scale-100 grayscale" : "scale-105 grayscale-0"
      }`}
    />
  );
}

function MemberOverlay({ member, loc }) {
  return (
    <div className="absolute inset-x-0 bottom-0 p-4">
      <span className="inline-block whitespace-nowrap rounded-full bg-brand-cyan px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-instrument text-[#04101f]">
        {loc(member, "poste")}
      </span>
      <h3 className="mt-3 font-serif text-xl font-bold leading-tight text-white">{member.nom}</h3>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-instrument text-white/50">{member.mandat}</p>
      {(member.linkedin || member.email) && (
        <div className="mt-3 flex gap-2">
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              onClick={(e) => e.stopPropagation()}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-brand-cyan hover:text-[#04101f]"
            >
              <LinkedinIcon />
            </a>
          )}
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              aria-label="Email"
              onClick={(e) => e.stopPropagation()}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-brand-cyan hover:text-[#04101f]"
            >
              <MailIcon />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function Board() {
  const { t } = useTranslation();
  const { t: loc } = useLocale();
  const { data: members, loading } = useFetch(() => boardApi.list(), []);
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div>
      <PageHero eyebrow={t("board.title")} title={t("board.title")} />
      <section className="mx-auto max-w-7xl px-6 py-16">
        {loading ? (
          <Spinner />
        ) : (
          <>
            {/* Desktop : accordéon horizontal, la carte survolée s'élargit,
                les autres se resserrent (flex-grow animé) et se désaturent. */}
            <div className="hidden gap-2 md:flex md:h-[420px] lg:h-[520px]" onMouseLeave={() => setHoveredId(null)}>
              {members?.map((m) => {
                const isHovered = hoveredId === m._id;
                return (
                  <div
                    key={m._id}
                    onMouseEnter={() => setHoveredId(m._id)}
                    style={{ flexGrow: isHovered ? 4 : 1, flexBasis: 0 }}
                    className="group relative min-w-0 cursor-pointer overflow-hidden rounded-2xl bg-[#0b2545] transition-[flex-grow] duration-300 ease-in-out"
                  >
                    <MemberPhoto member={m} dim={hoveredId !== null && !isHovered} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04101f] via-[#04101f]/35 to-transparent" />
                    <MemberOverlay member={m} loc={loc} />
                  </div>
                );
              })}
            </div>

            {/* Mobile/tablette : pas de survol tactile fiable, repli sur une
                grille statique qui s'empile proprement. */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:hidden">
              {members?.map((m) => (
                <Reveal key={m._id}>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#0b2545]">
                    <MemberPhoto member={m} dim={false} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04101f] via-[#04101f]/35 to-transparent" />
                    <MemberOverlay member={m} loc={loc} />
                  </div>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
