import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFetch } from "../hooks/useFetch.js";
import { useLocale } from "../hooks/useLocale.js";
import { cellsApi } from "../api/cells.js";
import { applicationsApi } from "../api/applications.js";
import PageHero from "../components/layout/PageHero.jsx";
import Reveal from "../components/ui/Reveal.jsx";

const initialForm = { nom: "", email: "", telephone: "", filiere: "", annee: "", celluleSouhaitee: "", motivation: "" };

const REASONS = [
  { titleKey: "join.reason1Title", textKey: "join.reason1Text" },
  { titleKey: "join.reason2Title", textKey: "join.reason2Text" },
  { titleKey: "join.reason3Title", textKey: "join.reason3Text" },
];

export default function Join() {
  const { t } = useTranslation();
  const { t: loc } = useLocale();
  const { data: cells } = useFetch(() => cellsApi.list(), []);
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ ...initialForm, celluleSouhaitee: searchParams.get("cellule") || "" });
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await applicationsApi.create(form);
      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  return (
    <div>
      <PageHero eyebrow={t("join.title")} title={t("join.title")} subtitle={t("join.subtitle")} />

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-3">
        <div className="flex flex-col gap-6 md:col-span-1">
          {REASONS.map((r) => (
            <Reveal key={r.titleKey}>
              <div>
                <div className="font-semibold text-brand-cyan">{t(r.titleKey)}</div>
                <p className="mt-1 text-sm text-[#657a90] dark:text-white/50">{t(r.textKey)}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="md:col-span-2">
          {status === "success" ? (
            <p className="text-brand-cyan">{t("join.success")}</p>
          ) : (
            <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
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
              <select
                required
                value={form.celluleSouhaitee}
                onChange={(e) => setForm({ ...form, celluleSouhaitee: e.target.value })}
                className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
              >
                <option value="">{t("join.cellWish")}</option>
                {cells?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {loc(c, "nom")}
                  </option>
                ))}
              </select>
              <textarea
                required
                rows={4}
                placeholder={t("events.fields.motivation")}
                value={form.motivation}
                onChange={(e) => setForm({ ...form, motivation: e.target.value })}
                className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15 sm:col-span-2"
              />
              {status === "error" && <p className="text-xs text-red-500 sm:col-span-2">{errorMsg}</p>}
              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-2 w-fit rounded-full bg-brand-cyan px-6 py-3 text-sm font-semibold text-[#04101f] hover:bg-brand-amber disabled:opacity-50 sm:col-span-2"
              >
                {t("common.submit")}
              </button>
            </form>
          )}
        </Reveal>
      </section>
    </div>
  );
}
