import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../../hooks/useFetch.js";
import { useLocale } from "../../hooks/useLocale.js";
import { useAuth } from "../../hooks/useAuth.js";
import { galleryApi } from "../../api/gallery.js";
import FileUpload from "../../components/ui/FileUpload.jsx";

export default function DashboardGallery() {
  const { t } = useTranslation();
  const { t: loc } = useLocale();
  const { user, isAdmin } = useAuth();
  const { data: items, loading, refetch } = useFetch(
    () => galleryApi.list(isAdmin ? {} : { cellule: user.cellule }),
    []
  );
  const [form, setForm] = useState({ image: "", legendeFr: "", legendeEn: "" });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    if (!file) {
      setForm((f) => ({ ...f, image: "" }));
      return;
    }
    setError("");
    setUploading(true);
    try {
      const { url } = await galleryApi.uploadImage(file);
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.image) {
      setError("Importez une image.");
      return;
    }
    try {
      await galleryApi.create({ ...form, cellule: isAdmin ? undefined : user.cellule });
      setForm({ image: "", legendeFr: "", legendeEn: "" });
      refetch();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm(t("common.confirm") + " ?")) return;
    await galleryApi.remove(id);
    refetch();
  };

  if (loading) return null;

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl">{t("dashboard.gallery")}</h1>

      <form onSubmit={submit} className="mb-8 grid gap-3 rounded-xl border border-white/10 p-5 sm:grid-cols-3">
        <div className="sm:col-span-3">
          <FileUpload onFileSelect={handleFile} disabled={uploading} hint="PNG ou JPG, 1 Mo max" />
        </div>
        <input
          placeholder="Légende (FR)"
          value={form.legendeFr}
          onChange={(e) => setForm({ ...form, legendeFr: e.target.value })}
          className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm"
        />
        <input
          placeholder="Caption (EN)"
          value={form.legendeEn}
          onChange={(e) => setForm({ ...form, legendeEn: e.target.value })}
          className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={uploading}
          className="rounded-full bg-brand-cyan px-5 py-2 text-sm font-semibold text-[#04101f] disabled:opacity-50"
        >
          {t("common.create")}
        </button>
        {error && <p className="text-xs text-red-400 sm:col-span-3">{error}</p>}
      </form>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items?.map((g) => (
          <div key={g._id} className="group relative aspect-square overflow-hidden rounded-lg border border-white/10">
            <img src={g.image} alt={loc(g, "legende")} className="h-full w-full object-cover" />
            <button
              onClick={() => remove(g._id)}
              className="absolute inset-0 hidden items-center justify-center bg-black/60 text-sm text-red-300 group-hover:flex"
            >
              {t("common.delete")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
