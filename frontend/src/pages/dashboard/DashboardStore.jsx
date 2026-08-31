import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../../hooks/useFetch.js";
import { useLocale } from "../../hooks/useLocale.js";
import { productsApi } from "../../api/products.js";
import FileUpload from "../../components/ui/FileUpload.jsx";

const emptyForm = {
  nomFr: "",
  nomEn: "",
  descriptionFr: "",
  descriptionEn: "",
  video: "",
  prix: "",
  stock: 0,
  tailles: [],
  disponible: true,
};

const inputClass = "rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm";

export default function DashboardStore() {
  const { t } = useTranslation();
  const { t: loc } = useLocale();
  const { data: products, loading, refetch } = useFetch(() => productsApi.list(), []);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [tailleInput, setTailleInput] = useState("");
  const [error, setError] = useState("");

  const handleVideo = async (file) => {
    if (!file) {
      setForm((f) => ({ ...f, video: "" }));
      return;
    }
    setError("");
    setUploading(true);
    try {
      const { url } = await productsApi.uploadVideo(file);
      setForm((f) => ({ ...f, video: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const addTaille = () => {
    const value = tailleInput.trim();
    if (!value) return;
    setForm((f) => ({ ...f, tailles: [...f.tailles, value] }));
    setTailleInput("");
  };

  const removeTaille = (i) => {
    setForm((f) => ({ ...f, tailles: f.tailles.filter((_, idx) => idx !== i) }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await productsApi.create({ ...form, prix: Number(form.prix), stock: Number(form.stock) });
      setForm(emptyForm);
      setTailleInput("");
      refetch();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleDisponible = async (p) => {
    await productsApi.update(p._id, { disponible: !p.disponible });
    refetch();
  };

  const remove = async (id) => {
    if (!confirm(t("common.confirm") + " ?")) return;
    await productsApi.remove(id);
    refetch();
  };

  if (loading) return null;

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl">{t("dashboard.store")}</h1>

      <form onSubmit={submit} className="mb-8 grid gap-3 rounded-xl border border-white/10 p-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-2 block text-xs uppercase tracking-instrument text-white/40">
            Aperçu vidéo (autoplay/loop/muted sur la page Store)
          </label>
          <FileUpload
            onFileSelect={handleVideo}
            existingUrl={form.video}
            disabled={uploading}
            accept="video/*"
            hint="MP4 ou WebM, 8 Mo max"
          />
        </div>
        <input required placeholder="Nom (FR)" value={form.nomFr} onChange={(e) => setForm({ ...form, nomFr: e.target.value })} className={inputClass} />
        <input placeholder="Name (EN)" value={form.nomEn} onChange={(e) => setForm({ ...form, nomEn: e.target.value })} className={inputClass} />
        <textarea placeholder="Description (FR)" value={form.descriptionFr} onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })} className={`${inputClass} sm:col-span-2`} rows={3} />
        <textarea placeholder="Description (EN)" value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} className={`${inputClass} sm:col-span-2`} rows={3} />
        <input required type="number" placeholder="Prix (MAD)" value={form.prix} onChange={(e) => setForm({ ...form, prix: e.target.value })} className={inputClass} />
        <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={inputClass} />

        {/* Tailles disponibles — affichées côté client dans le formulaire de commande */}
        <div className="sm:col-span-2">
          <label className="mb-2 block text-xs uppercase tracking-instrument text-white/40">
            Tailles (laisser vide si non applicable)
          </label>
          {form.tailles.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {form.tailles.map((taille, i) => (
                <span
                  key={`${taille}-${i}`}
                  className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs text-white/80"
                >
                  {taille}
                  <button
                    type="button"
                    onClick={() => removeTaille(i)}
                    aria-label={`Retirer ${taille}`}
                    className="text-white/40 hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              placeholder="Ajouter une taille (ex. M)"
              value={tailleInput}
              onChange={(e) => setTailleInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTaille();
                }
              }}
              className={`${inputClass} flex-1`}
            />
            <button type="button" onClick={addTaille} className="rounded-lg border border-white/15 px-4 text-sm">
              Ajouter
            </button>
          </div>
        </div>

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
          <tr><th className="pb-2">{t("common.name")}</th><th className="pb-2">{t("store.price")}</th><th className="pb-2">Stock</th><th className="pb-2">{t("common.status")}</th><th className="pb-2">{t("common.actions")}</th></tr>
        </thead>
        <tbody>
          {products?.map((p) => (
            <tr key={p._id} className="border-t border-white/10">
              <td className="py-3">{loc(p, "nom")}</td>
              <td className="py-3 text-white/60">{p.prix} MAD</td>
              <td className="py-3 text-white/60">{p.stock}</td>
              <td className="py-3">
                <button onClick={() => toggleDisponible(p)} className={p.disponible ? "text-brand-cyan" : "text-white/30"}>
                  {p.disponible ? "disponible" : "masqué"}
                </button>
              </td>
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
