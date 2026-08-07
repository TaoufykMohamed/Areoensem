import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../../hooks/useFetch.js";
import { partnersApi } from "../../api/partners.js";

const emptyForm = { nom: "", type: "partenaire", siteWeb: "", logo: "" };

export default function DashboardPartners() {
  const { t } = useTranslation();
  const { data: partners, loading, refetch } = useFetch(() => partnersApi.list(), []);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await partnersApi.create(form);
      setForm(emptyForm);
      refetch();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm(t("common.confirm") + " ?")) return;
    await partnersApi.remove(id);
    refetch();
  };

  if (loading) return null;

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl">{t("dashboard.partners")}</h1>

      <form onSubmit={submit} className="mb-8 grid gap-3 rounded-xl border border-white/10 p-5 sm:grid-cols-2">
        <input required placeholder={t("common.name")} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm">
          <option value="sponsor">Sponsor</option>
          <option value="partenaire">Partenaire</option>
          <option value="ecole">École</option>
        </select>
        <input placeholder="Site web" value={form.siteWeb} onChange={(e) => setForm({ ...form, siteWeb: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        <input placeholder="URL logo" value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        {error && <p className="text-xs text-red-400 sm:col-span-2">{error}</p>}
        <button type="submit" className="rounded-full bg-brand-cyan px-5 py-2 text-sm font-semibold text-[#04101f] sm:col-span-2">
          {t("common.create")}
        </button>
      </form>

      <table className="w-full text-left text-sm">
        <thead className="text-white/40">
          <tr><th className="pb-2">{t("common.name")}</th><th className="pb-2">Type</th><th className="pb-2">{t("common.actions")}</th></tr>
        </thead>
        <tbody>
          {partners?.map((p) => (
            <tr key={p._id} className="border-t border-white/10">
              <td className="py-3">{p.nom}</td>
              <td className="py-3 text-white/60">{p.type}</td>
              <td className="py-3">
                <button onClick={() => remove(p._id)} className="text-red-400 hover:underline">{t("common.delete")}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
