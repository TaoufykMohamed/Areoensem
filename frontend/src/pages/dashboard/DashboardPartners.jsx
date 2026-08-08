import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../../hooks/useFetch.js";
import { partnersApi } from "../../api/partners.js";

const emptyForm = { nom: "", type: "partenaire", siteWeb: "", logo: "" };

export default function DashboardPartners() {
  const { t } = useTranslation();
  const { data: partners, loading, refetch } = useFetch(() => partnersApi.list(), []);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const startEdit = (partner) => {
    setEditingId(partner._id);
    setForm({
      nom: partner.nom,
      type: partner.type,
      siteWeb: partner.siteWeb || "",
      logo: partner.logo || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const { url } = await partnersApi.uploadLogo(file);
      setForm((f) => ({ ...f, logo: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await partnersApi.update(editingId, form);
      } else {
        await partnersApi.create(form);
      }
      cancelEdit();
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

      <form onSubmit={save} className="mb-8 grid gap-3 rounded-xl border border-white/10 p-5 sm:grid-cols-2">
        <input
          required
          placeholder={t("common.name")}
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
          className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm"
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm"
        >
          <option value="sponsor">Sponsor</option>
          <option value="partenaire">Partenaire</option>
          <option value="ecole">École</option>
        </select>
        <input
          placeholder="Site web"
          value={form.siteWeb}
          onChange={(e) => setForm({ ...form, siteWeb: e.target.value })}
          className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm sm:col-span-2"
        />

        <div className="sm:col-span-2">
          <label className="mb-2 block text-xs text-white/50">Logo</label>
          <div className="flex items-center gap-4">
            {form.logo ? (
              <img
                src={form.logo}
                alt=""
                className="h-14 w-14 rounded-lg border border-white/15 bg-white object-contain p-1"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-dashed border-white/15 text-[10px] text-white/30">
                —
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              disabled={uploading}
              className="text-xs text-white/70 file:mr-3 file:rounded-full file:border-0 file:bg-brand-cyan file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[#04101f] file:disabled:opacity-50"
            />
            {uploading && <span className="text-xs text-white/50">Envoi…</span>}
          </div>
        </div>

        {error && <p className="text-xs text-red-400 sm:col-span-2">{error}</p>}

        <div className="flex gap-2 sm:col-span-2">
          <button
            type="submit"
            disabled={uploading}
            className="rounded-full bg-brand-cyan px-5 py-2 text-sm font-semibold text-[#04101f] disabled:opacity-50"
          >
            {editingId ? t("common.save") : t("common.create")}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="rounded-full border border-white/15 px-5 py-2 text-sm">
              {t("common.cancel")}
            </button>
          )}
        </div>
      </form>

      <table className="w-full text-left text-sm">
        <thead className="text-white/40">
          <tr>
            <th className="pb-2">Logo</th>
            <th className="pb-2">{t("common.name")}</th>
            <th className="pb-2">Type</th>
            <th className="pb-2">{t("common.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {partners?.map((p) => (
            <tr key={p._id} className="border-t border-white/10">
              <td className="py-3">
                {p.logo ? (
                  <img src={p.logo} alt={p.nom} className="h-8 w-8 rounded border border-white/10 bg-white object-contain p-0.5" />
                ) : (
                  <span className="text-white/30">—</span>
                )}
              </td>
              <td className="py-3">{p.nom}</td>
              <td className="py-3 text-white/60">{p.type}</td>
              <td className="py-3">
                <button onClick={() => startEdit(p)} className="mr-3 text-brand-cyan hover:underline">
                  {t("common.edit")}
                </button>
                <button onClick={() => remove(p._id)} className="text-red-400 hover:underline">
                  {t("common.delete")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
