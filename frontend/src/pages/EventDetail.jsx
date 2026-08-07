import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useFetch } from "../hooks/useFetch.js";
import { useLocale } from "../hooks/useLocale.js";
import { eventsApi } from "../api/events.js";
import PageHero from "../components/layout/PageHero.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import Reveal from "../components/ui/Reveal.jsx";

const initialForm = { nom: "", email: "", telephone: "", filiere: "", annee: "", motivation: "" };

export default function EventDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const { t: loc } = useLocale();
  const { data: event, loading, error } = useFetch(() => eventsApi.getBySlug(slug), [slug]);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (loading) return <Spinner className="min-h-[60vh]" />;
  if (error || !event) return <div className="px-6 py-24 text-center">{t("common.error")}</div>;

  const date = new Date(event.dateDebut).toLocaleDateString(i18n.language === "en" ? "en-GB" : "fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const canRegister = event.inscriptionsOuvertes && (!event.capacite || event.nombreParticipants < event.capacite);

  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      await eventsApi.register(event._id, form);
      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  return (
    <div>
      <PageHero eyebrow={loc(event.cellule, "nom")} title={loc(event, "titre")} subtitle={`${date} — ${loc(event, "lieu")}`} />

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-3">
        <div className="md:col-span-2">
          <Reveal>
            <p className="whitespace-pre-line text-lg leading-relaxed text-[#33475c] dark:text-white/70">
              {loc(event, "description")}
            </p>
          </Reveal>
          {event.statut === "passe" && loc(event, "compteRendu") && (
            <Reveal className="mt-8 rounded-xl border border-black/10 p-6 dark:border-white/10">
              <h2 className="mb-2 font-mono text-[11px] uppercase tracking-instrument text-brand-cyan">
                {t("common.readMore")}
              </h2>
              <p className="text-sm text-[#657a90] dark:text-white/60">{loc(event, "compteRendu")}</p>
            </Reveal>
          )}
        </div>

        <div>
          <Reveal className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
            <h2 className="mb-4 font-serif text-xl">{t("events.registration")}</h2>

            {!canRegister ? (
              <p className="text-sm text-[#657a90] dark:text-white/50">{t("events.registrationsClosed")}</p>
            ) : status === "success" ? (
              <p className="text-sm text-brand-cyan">{t("events.registerSuccess")}</p>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-3">
                <input
                  required
                  placeholder={t("common.name")}
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
                />
                <input
                  required
                  type="email"
                  placeholder={t("common.email")}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
                />
                <input
                  required
                  placeholder={t("common.phone")}
                  value={form.telephone}
                  onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                  className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
                />
                <input
                  required
                  placeholder={t("events.fields.filiere")}
                  value={form.filiere}
                  onChange={(e) => setForm({ ...form, filiere: e.target.value })}
                  className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
                />
                <input
                  required
                  placeholder={t("events.fields.annee")}
                  value={form.annee}
                  onChange={(e) => setForm({ ...form, annee: e.target.value })}
                  className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
                />
                <textarea
                  placeholder={t("events.fields.motivation")}
                  value={form.motivation}
                  onChange={(e) => setForm({ ...form, motivation: e.target.value })}
                  className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
                  rows={3}
                />
                {status === "error" && <p className="text-xs text-red-500">{errorMsg}</p>}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-2 rounded-full bg-brand-cyan px-6 py-3 text-sm font-semibold text-[#04101f] hover:bg-brand-amber disabled:opacity-50"
                >
                  {t("events.registerCta")}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
