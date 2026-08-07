import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../../hooks/useFetch.js";
import { useLocale } from "../../hooks/useLocale.js";
import { boardApi } from "../../api/board.js";

const emptyForm = { nom: "", posteFr: "", posteEn: "", mandat: "", ordre: 0 };

export default function DashboardBoard() {
  const { t } = useTranslation();
  const { t: loc } = useLocale();
  const { data: members, loading, refetch } = useFetch(() => boardApi.list(), []);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await boardApi.create(form);
      setForm(emptyForm);
      refetch();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm(t("common.confirm") + " ?")) return;
    await boardApi.remove(id);
    refetch();
  };

  if (loading) return null;

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl">{t("dashboard.board")}</h1>

      <form onSubmit={submit} className="mb-8 grid gap-3 rounded-xl border border-white/10 p-5 sm:grid-cols-2">
        <input required placeholder={t("common.name")} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        <input required placeholder="Poste (FR)" value={form.posteFr} onChange={(e) => setForm({ ...form, posteFr: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        <input placeholder="Position (EN)" value={form.posteEn} onChange={(e) => setForm({ ...form, posteEn: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        <input required placeholder="Mandat (ex. 2025 - 2026)" value={form.mandat} onChange={(e) => setForm({ ...form, mandat: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        <input type="number" placeholder="Ordre" value={form.ordre} onChange={(e) => setForm({ ...form, ordre: Number(e.target.value) })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        {error && <p className="text-xs text-red-400 sm:col-span-2">{error}</p>}
        <button type="submit" className="rounded-full bg-brand-cyan px-5 py-2 text-sm font-semibold text-[#04101f] sm:col-span-2">
          {t("common.create")}
        </button>
      </form>

      <table className="w-full text-left text-sm">
        <thead className="text-white/40">
          <tr><th className="pb-2">{t("common.name")}</th><th className="pb-2">Poste</th><th className="pb-2">{t("common.actions")}</th></tr>
        </thead>
        <tbody>
          {members?.map((m) => (
            <tr key={m._id} className="border-t border-white/10">
              <td className="py-3">{m.nom}</td>
              <td className="py-3 text-white/60">{loc(m, "poste")}</td>
              <td className="py-3">
                <button onClick={() => remove(m._id)} className="text-red-400 hover:underline">{t("common.delete")}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
