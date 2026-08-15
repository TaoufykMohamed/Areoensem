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

export default function Board() {
  const { t } = useTranslation();
  const { t: loc } = useLocale();
  const { data: members, loading } = useFetch(() => boardApi.list(), []);

  return (
    <div>
      <PageHero eyebrow={t("board.title")} title={t("board.title")} />
      <section className="mx-auto max-w-7xl px-6 py-16">
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {members?.map((m) => (
              <Reveal key={m._id}>
                <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#0b2545]">
                  {m.photo ? (
                    <img
                      src={m.photo}
                      alt={m.nom}
                      className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#0b2545] to-[#04101f]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04101f] via-[#04101f]/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <span className="inline-block rounded-full bg-brand-cyan px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-instrument text-[#04101f]">
                      {loc(m, "poste")}
                    </span>
                    <h3 className="mt-3 font-serif text-xl font-bold leading-tight text-white">{m.nom}</h3>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-instrument text-white/50">
                      {m.mandat}
                    </p>
                    {(m.linkedin || m.email) && (
                      <div className="mt-3 flex gap-2">
                        {m.linkedin && (
                          <a
                            href={m.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="LinkedIn"
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-brand-cyan hover:text-[#04101f]"
                          >
                            <LinkedinIcon />
                          </a>
                        )}
                        {m.email && (
                          <a
                            href={`mailto:${m.email}`}
                            aria-label="Email"
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-brand-cyan hover:text-[#04101f]"
                          >
                            <MailIcon />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
