import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../../hooks/useFetch.js";
import { useLocale } from "../../hooks/useLocale.js";
import { boardApi } from "../../api/board.js";
import FileUpload from "../../components/ui/FileUpload.jsx";

const emptyForm = { nom: "", posteFr: "", posteEn: "", mandat: "", ordre: 0, photo: "", linkedin: "", email: "" };

export default function DashboardBoard() {
  const { t } = useTranslation();
  const { t: loc } = useLocale();
  const { data: members, loading, refetch } = useFetch(() => boardApi.list(), []);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handlePhoto = async (file) => {
    if (!file) {
      setForm((f) => ({ ...f, photo: "" }));
      return;
    }
    setError("");
    setUploading(true);
    try {
      const { url } = await boardApi.uploadPhoto(file);
      setForm((f) => ({ ...f, photo: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

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
        <div className="sm:col-span-2">
          <FileUpload onFileSelect={handlePhoto} disabled={uploading} hint="PNG ou JPG, 1 Mo max" />
        </div>
        <input required placeholder={t("common.name")} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        <input required placeholder="Poste (FR)" value={form.posteFr} onChange={(e) => setForm({ ...form, posteFr: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        <input placeholder="Position (EN)" value={form.posteEn} onChange={(e) => setForm({ ...form, posteEn: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        <input required placeholder="Mandat (ex. 2025 - 2026)" value={form.mandat} onChange={(e) => setForm({ ...form, mandat: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        <input type="number" placeholder="Ordre" value={form.ordre} onChange={(e) => setForm({ ...form, ordre: Number(e.target.value) })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        <input placeholder="LinkedIn (URL, optionnel)" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        <input placeholder="Email (optionnel)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        {error && <p className="text-xs text-red-400 sm:col-span-2">{error}</p>}
        <button
          type="submit"
          disabled={uploading}
          className="rounded-full bg-brand-cyan px-5 py-2 text-sm font-semibold text-[#04101f] disabled:opacity-50 sm:col-span-2"
        >
          {t("common.create")}
        </button>
      </form>

      <table className="w-full text-left text-sm">
        <thead className="text-white/40">
          <tr>
            <th className="pb-2">Photo</th>
            <th className="pb-2">{t("common.name")}</th>
            <th className="pb-2">Poste</th>
            <th className="pb-2">{t("common.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {members?.map((m) => (
            <tr key={m._id} className="border-t border-white/10">
              <td className="py-3">
                {m.photo ? (
                  <img src={m.photo} alt={m.nom} className="h-9 w-9 rounded-full border border-white/10 object-cover" />
                ) : (
                  <span className="text-white/30">—</span>
                )}
              </td>
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
