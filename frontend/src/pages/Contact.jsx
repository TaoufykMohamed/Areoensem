import { useState } from "react";
import { useTranslation } from "react-i18next";
import { messagesApi } from "../api/messages.js";
import PageHero from "../components/layout/PageHero.jsx";
import Reveal from "../components/ui/Reveal.jsx";

const initialForm = { nom: "", email: "", sujet: "", contenu: "" };

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await messagesApi.create(form);
      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  return (
    <div>
      <PageHero eyebrow={t("contact.title")} title={t("contact.title")} />

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2">
        <Reveal>
          {status === "success" ? (
            <p className="text-brand-cyan">{t("contact.success")}</p>
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
                placeholder={t("contact.subject")}
                value={form.sujet}
                onChange={(e) => setForm({ ...form, sujet: e.target.value })}
                className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
              />
              <textarea
                required
                rows={5}
                placeholder={t("contact.message")}
                value={form.contenu}
                onChange={(e) => setForm({ ...form, contenu: e.target.value })}
                className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
              />
              {status === "error" && <p className="text-xs text-red-500">{errorMsg}</p>}
              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-2 w-fit rounded-full bg-brand-cyan px-6 py-3 text-sm font-semibold text-[#04101f] hover:bg-brand-amber disabled:opacity-50"
              >
                {t("common.submit")}
              </button>
            </form>
          )}
        </Reveal>

        <Reveal>
          <div className="flex flex-col gap-4 rounded-2xl border border-black/10 p-6 dark:border-white/10">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-instrument text-brand-cyan">Email</div>
              <div>club-aeronautique@ensem.ac.ma</div>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-instrument text-brand-cyan">
                {t("common.phone")}
              </div>
              <div>+212 770-190444</div>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-instrument text-brand-cyan">ENSEM</div>
              <div>École Nationale Supérieure d'Électricité et de Mécanique</div>
              <div className="text-sm text-[#657a90] dark:text-white/50">
                Route d'El Jadida, km 7, Casablanca 20460, Maroc
              </div>
            </div>
            <div className="mt-2 flex h-40 items-center justify-center rounded-xl border border-dashed border-black/10 text-xs text-[#657a90] dark:border-white/15 dark:text-white/40">
              ENSEM · 33.5461° N, 7.6570° W
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
