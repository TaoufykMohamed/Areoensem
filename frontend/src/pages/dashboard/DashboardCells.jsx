import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../../hooks/useFetch.js";
import { useLocale } from "../../hooks/useLocale.js";
import { useAuth } from "../../hooks/useAuth.js";
import { cellsApi } from "../../api/cells.js";
import FileUpload from "../../components/ui/FileUpload.jsx";

const emptyForm = { nomFr: "", nomEn: "", descriptionCourteFr: "", descriptionCourteEn: "", ordre: 0, image: "" };

export default function DashboardCells() {
  const { t } = useTranslation();
  const { t: loc } = useLocale();
  const { isAdmin, user } = useAuth();
  const { data: cells, loading, refetch } = useFetch(() => cellsApi.list(), []);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // un chef ne voit/n'édite que sa propre cellule
  const visible = isAdmin ? cells : cells?.filter((c) => c._id === user.cellule);

  const startEdit = (cell) => {
    setEditingId(cell._id);
    setForm({
      nomFr: cell.nomFr,
      nomEn: cell.nomEn,
      descriptionCourteFr: cell.descriptionCourteFr,
      descriptionCourteEn: cell.descriptionCourteEn,
      ordre: cell.ordre,
      image: cell.image || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleImage = async (file) => {
    if (!file) {
      setForm((f) => ({ ...f, image: "" }));
      return;
    }
    setError("");
    setUploading(true);
    try {
      const { url } = await cellsApi.uploadImage(file);
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await cellsApi.update(editingId, form);
      } else {
        await cellsApi.create(form);
      }
      cancelEdit();
      refetch();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm(t("common.confirm") + " ?")) return;
    await cellsApi.remove(id);
    refetch();
  };

  if (loading) return null;

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl">{t("dashboard.cells")}</h1>

      <form onSubmit={save} className="mb-8 grid gap-3 rounded-xl border border-white/10 p-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FileUpload
            key={editingId || "new"}
            onFileSelect={handleImage}
            existingUrl={form.image}
            disabled={uploading}
            hint="PNG ou JPG, 1 Mo max"
          />
        </div>
        <input
          required
          placeholder="Nom (FR)"
          value={form.nomFr}
          onChange={(e) => setForm({ ...form, nomFr: e.target.value })}
          className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm"
          disabled={!isAdmin}
        />
        <input
          placeholder="Name (EN)"
          value={form.nomEn}
          onChange={(e) => setForm({ ...form, nomEn: e.target.value })}
          className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm"
          disabled={!isAdmin}
        />
        <textarea
          required
          placeholder="Description courte (FR)"
          value={form.descriptionCourteFr}
          onChange={(e) => setForm({ ...form, descriptionCourteFr: e.target.value })}
          className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm sm:col-span-2"
        />
        <textarea
          placeholder="Short description (EN)"
          value={form.descriptionCourteEn}
          onChange={(e) => setForm({ ...form, descriptionCourteEn: e.target.value })}
          className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm sm:col-span-2"
        />
        {isAdmin && (
          <input
            type="number"
            placeholder="Ordre"
            value={form.ordre}
            onChange={(e) => setForm({ ...form, ordre: Number(e.target.value) })}
            className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm"
          />
        )}
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
            <th className="pb-2">{t("common.name")}</th>
            <th className="pb-2">Slug</th>
            <th className="pb-2">Ordre</th>
            <th className="pb-2">{t("common.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {visible?.map((c) => (
            <tr key={c._id} className="border-t border-white/10">
              <td className="py-3">{loc(c, "nom")}</td>
              <td className="py-3 text-white/50">{c.slug}</td>
              <td className="py-3">{c.ordre}</td>
              <td className="py-3">
                <button onClick={() => startEdit(c)} className="mr-3 text-brand-cyan hover:underline">
                  {t("common.edit")}
                </button>
                {isAdmin && (
                  <button onClick={() => remove(c._id)} className="text-red-400 hover:underline">
                    {t("common.delete")}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
