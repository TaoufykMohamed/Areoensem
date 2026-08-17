import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../../hooks/useFetch.js";
import { useLocale } from "../../hooks/useLocale.js";
import { useAuth } from "../../hooks/useAuth.js";
import { cellsApi } from "../../api/cells.js";
import FileUpload from "../../components/ui/FileUpload.jsx";

const emptyMembre = { nom: "", roleFr: "", roleEn: "" };
const emptyProjet = {
  titreFr: "",
  titreEn: "",
  descriptionFr: "",
  descriptionEn: "",
  documentUrl: "",
  annee: "",
  statut: "en_cours",
};

const emptyForm = {
  nomFr: "",
  nomEn: "",
  descriptionCourteFr: "",
  descriptionCourteEn: "",
  descriptionLongueFr: "",
  descriptionLongueEn: "",
  objectifsFr: [],
  objectifsEn: [],
  ordre: 0,
  image: "",
  technologies: [],
  membres: [],
  projets: [],
  reseauxSociaux: { facebook: "", linkedin: "", instagram: "", tiktok: "" },
};

const inputClass = "rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm";

export default function DashboardCells() {
  const { t } = useTranslation();
  const { t: loc } = useLocale();
  const { isAdmin, user } = useAuth();
  const { data: cells, loading, refetch } = useFetch(() => cellsApi.list(), []);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingDocIndex, setUploadingDocIndex] = useState(null);
  const [techInput, setTechInput] = useState("");
  const [objFrInput, setObjFrInput] = useState("");
  const [objEnInput, setObjEnInput] = useState("");
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
      descriptionLongueFr: cell.descriptionLongueFr || "",
      descriptionLongueEn: cell.descriptionLongueEn || "",
      objectifsFr: cell.objectifsFr || [],
      objectifsEn: cell.objectifsEn || [],
      ordre: cell.ordre,
      image: cell.image || "",
      technologies: cell.technologies || [],
      membres: cell.membres || [],
      projets: (cell.projets || []).map((p) => ({ ...p, annee: p.annee ?? "" })),
      reseauxSociaux: {
        facebook: cell.reseauxSociaux?.facebook || "",
        linkedin: cell.reseauxSociaux?.linkedin || "",
        instagram: cell.reseauxSociaux?.instagram || "",
        tiktok: cell.reseauxSociaux?.tiktok || "",
      },
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setTechInput("");
    setObjFrInput("");
    setObjEnInput("");
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

  const addTech = () => {
    const value = techInput.trim();
    if (!value) return;
    setForm((f) => ({ ...f, technologies: [...f.technologies, value] }));
    setTechInput("");
  };

  const removeTech = (i) => {
    setForm((f) => ({ ...f, technologies: f.technologies.filter((_, idx) => idx !== i) }));
  };

  const addObjectif = (lang) => {
    const key = lang === "fr" ? "objectifsFr" : "objectifsEn";
    const value = (lang === "fr" ? objFrInput : objEnInput).trim();
    if (!value) return;
    setForm((f) => ({ ...f, [key]: [...f[key], value] }));
    if (lang === "fr") setObjFrInput("");
    else setObjEnInput("");
  };

  const removeObjectif = (lang, i) => {
    const key = lang === "fr" ? "objectifsFr" : "objectifsEn";
    setForm((f) => ({ ...f, [key]: f[key].filter((_, idx) => idx !== i) }));
  };

  const addMembre = () => setForm((f) => ({ ...f, membres: [...f.membres, { ...emptyMembre }] }));
  const updateMembre = (i, field, value) =>
    setForm((f) => ({
      ...f,
      membres: f.membres.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)),
    }));
  const removeMembre = (i) => setForm((f) => ({ ...f, membres: f.membres.filter((_, idx) => idx !== i) }));

  const addProjet = () => setForm((f) => ({ ...f, projets: [...f.projets, { ...emptyProjet }] }));
  const updateProjet = (i, field, value) =>
    setForm((f) => ({
      ...f,
      projets: f.projets.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)),
    }));
  const removeProjet = (i) => setForm((f) => ({ ...f, projets: f.projets.filter((_, idx) => idx !== i) }));

  const handleProjetDocument = async (i, file) => {
    if (!file) {
      updateProjet(i, "documentUrl", "");
      return;
    }
    setError("");
    setUploadingDocIndex(i);
    try {
      const { url } = await cellsApi.uploadDocument(file);
      updateProjet(i, "documentUrl", url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingDocIndex(null);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        projets: form.projets.map((p) => ({ ...p, annee: p.annee === "" ? undefined : Number(p.annee) })),
      };
      if (editingId) {
        await cellsApi.update(editingId, payload);
      } else {
        await cellsApi.create(payload);
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
          className={inputClass}
          disabled={!isAdmin}
        />
        <input
          placeholder="Name (EN)"
          value={form.nomEn}
          onChange={(e) => setForm({ ...form, nomEn: e.target.value })}
          className={inputClass}
          disabled={!isAdmin}
        />
        <textarea
          required
          placeholder="Description courte (FR)"
          value={form.descriptionCourteFr}
          onChange={(e) => setForm({ ...form, descriptionCourteFr: e.target.value })}
          className={`${inputClass} sm:col-span-2`}
        />
        <textarea
          placeholder="Short description (EN)"
          value={form.descriptionCourteEn}
          onChange={(e) => setForm({ ...form, descriptionCourteEn: e.target.value })}
          className={`${inputClass} sm:col-span-2`}
        />
        <textarea
          placeholder="Description longue (FR) — texte affiché en haut de la page de la cellule"
          value={form.descriptionLongueFr}
          onChange={(e) => setForm({ ...form, descriptionLongueFr: e.target.value })}
          rows={3}
          className={`${inputClass} sm:col-span-2`}
        />
        <textarea
          placeholder="Long description (EN)"
          value={form.descriptionLongueEn}
          onChange={(e) => setForm({ ...form, descriptionLongueEn: e.target.value })}
          rows={3}
          className={`${inputClass} sm:col-span-2`}
        />
        {isAdmin && (
          <input
            type="number"
            placeholder="Ordre"
            value={form.ordre}
            onChange={(e) => setForm({ ...form, ordre: Number(e.target.value) })}
            className={inputClass}
          />
        )}

        {/* Objectifs (FR/EN) — puces affichées dans "Description & Objectifs" */}
        <div>
          <label className="mb-2 block text-xs uppercase tracking-instrument text-white/40">Objectifs (FR)</label>
          {form.objectifsFr.length > 0 && (
            <ul className="mb-2 space-y-1">
              {form.objectifsFr.map((obj, i) => (
                <li
                  key={`${obj}-${i}`}
                  className="flex items-center justify-between gap-2 rounded-lg border border-white/10 px-3 py-1 text-xs text-white/80"
                >
                  <span>{obj}</span>
                  <button
                    type="button"
                    onClick={() => removeObjectif("fr", i)}
                    aria-label={`Retirer ${obj}`}
                    className="text-white/40 hover:text-red-400"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2">
            <input
              placeholder="Ajouter un objectif"
              value={objFrInput}
              onChange={(e) => setObjFrInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addObjectif("fr");
                }
              }}
              className={`${inputClass} flex-1`}
            />
            <button type="button" onClick={() => addObjectif("fr")} className="rounded-lg border border-white/15 px-4 text-sm">
              Ajouter
            </button>
          </div>
        </div>
        <div>
          <label className="mb-2 block text-xs uppercase tracking-instrument text-white/40">Objectifs (EN)</label>
          {form.objectifsEn.length > 0 && (
            <ul className="mb-2 space-y-1">
              {form.objectifsEn.map((obj, i) => (
                <li
                  key={`${obj}-${i}`}
                  className="flex items-center justify-between gap-2 rounded-lg border border-white/10 px-3 py-1 text-xs text-white/80"
                >
                  <span>{obj}</span>
                  <button
                    type="button"
                    onClick={() => removeObjectif("en", i)}
                    aria-label={`Retirer ${obj}`}
                    className="text-white/40 hover:text-red-400"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2">
            <input
              placeholder="Add an objective"
              value={objEnInput}
              onChange={(e) => setObjEnInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addObjectif("en");
                }
              }}
              className={`${inputClass} flex-1`}
            />
            <button type="button" onClick={() => addObjectif("en")} className="rounded-lg border border-white/15 px-4 text-sm">
              Ajouter
            </button>
          </div>
        </div>

        {/* Technologies */}
        <div className="sm:col-span-2">
          <label className="mb-2 block text-xs uppercase tracking-instrument text-white/40">Technologies</label>
          {form.technologies.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {form.technologies.map((tech, i) => (
                <span
                  key={`${tech}-${i}`}
                  className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs text-white/80"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(i)}
                    aria-label={`Retirer ${tech}`}
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
              placeholder="Ajouter une technologie (ex. SolidWorks)"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTech();
                }
              }}
              className={`${inputClass} flex-1`}
            />
            <button type="button" onClick={addTech} className="rounded-lg border border-white/15 px-4 text-sm">
              Ajouter
            </button>
          </div>
        </div>

        {/* Réseaux sociaux — icônes affichées dans la modale si l'URL est renseignée */}
        <div className="sm:col-span-2">
          <label className="mb-2 block text-xs uppercase tracking-instrument text-white/40">Réseaux sociaux</label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              type="url"
              placeholder="URL Facebook"
              value={form.reseauxSociaux.facebook}
              onChange={(e) =>
                setForm({ ...form, reseauxSociaux: { ...form.reseauxSociaux, facebook: e.target.value } })
              }
              className={inputClass}
            />
            <input
              type="url"
              placeholder="URL LinkedIn"
              value={form.reseauxSociaux.linkedin}
              onChange={(e) =>
                setForm({ ...form, reseauxSociaux: { ...form.reseauxSociaux, linkedin: e.target.value } })
              }
              className={inputClass}
            />
            <input
              type="url"
              placeholder="URL Instagram"
              value={form.reseauxSociaux.instagram}
              onChange={(e) =>
                setForm({ ...form, reseauxSociaux: { ...form.reseauxSociaux, instagram: e.target.value } })
              }
              className={inputClass}
            />
            <input
              type="url"
              placeholder="URL TikTok"
              value={form.reseauxSociaux.tiktok}
              onChange={(e) =>
                setForm({ ...form, reseauxSociaux: { ...form.reseauxSociaux, tiktok: e.target.value } })
              }
              className={inputClass}
            />
          </div>
        </div>

        {/* Membres (chef·fe·s de cellule inclus, via le rôle) */}
        <div className="sm:col-span-2">
          <label className="mb-2 block text-xs uppercase tracking-instrument text-white/40">
            Membres — pour 1 ou 2 chef·fe·s de cellule, ajoutez-les ici avec le rôle « Chef de cellule »
          </label>
          {form.membres.map((m, i) => (
            <div key={i} className="mb-2 grid grid-cols-1 gap-2 rounded-lg border border-white/10 p-3 sm:grid-cols-3">
              <input
                placeholder="Nom"
                value={m.nom}
                onChange={(e) => updateMembre(i, "nom", e.target.value)}
                className={inputClass}
              />
              <input
                placeholder="Rôle (FR) — ex. Chef de cellule"
                value={m.roleFr}
                onChange={(e) => updateMembre(i, "roleFr", e.target.value)}
                className={inputClass}
              />
              <div className="flex gap-2">
                <input
                  placeholder="Role (EN)"
                  value={m.roleEn}
                  onChange={(e) => updateMembre(i, "roleEn", e.target.value)}
                  className={`${inputClass} flex-1`}
                />
                <button
                  type="button"
                  onClick={() => removeMembre(i)}
                  aria-label="Retirer ce membre"
                  className="text-red-400 hover:underline"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addMembre} className="rounded-lg border border-white/15 px-4 py-2 text-sm">
            + Ajouter un membre
          </button>
        </div>

        {/* Projets */}
        <div className="sm:col-span-2">
          <label className="mb-2 block text-xs uppercase tracking-instrument text-white/40">Projets</label>
          {form.projets.map((p, i) => (
            <div key={i} className="mb-2 grid grid-cols-1 gap-2 rounded-lg border border-white/10 p-3 sm:grid-cols-2">
              <input
                placeholder="Titre (FR)"
                value={p.titreFr}
                onChange={(e) => updateProjet(i, "titreFr", e.target.value)}
                className={inputClass}
              />
              <input
                placeholder="Title (EN)"
                value={p.titreEn}
                onChange={(e) => updateProjet(i, "titreEn", e.target.value)}
                className={inputClass}
              />
              <textarea
                placeholder="Description (FR)"
                value={p.descriptionFr}
                onChange={(e) => updateProjet(i, "descriptionFr", e.target.value)}
                className={`${inputClass} sm:col-span-2`}
              />
              <textarea
                placeholder="Description (EN)"
                value={p.descriptionEn}
                onChange={(e) => updateProjet(i, "descriptionEn", e.target.value)}
                className={`${inputClass} sm:col-span-2`}
              />
              <input
                type="number"
                placeholder="Année"
                value={p.annee}
                onChange={(e) => updateProjet(i, "annee", e.target.value)}
                className={inputClass}
              />
              <select
                value={p.statut}
                onChange={(e) => updateProjet(i, "statut", e.target.value)}
                className={inputClass}
              >
                <option value="a_venir">À venir</option>
                <option value="en_cours">En cours</option>
                <option value="termine">Terminé</option>
              </select>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs uppercase tracking-instrument text-white/40">
                  Dossier de projet (PDF)
                </label>
                <FileUpload
                  key={`${editingId || "new"}-projet-${i}`}
                  onFileSelect={(file) => handleProjetDocument(i, file)}
                  existingUrl={p.documentUrl}
                  disabled={uploadingDocIndex === i}
                  accept="application/pdf"
                  hint="PDF, 2 Mo max"
                />
              </div>
              <button
                type="button"
                onClick={() => removeProjet(i)}
                className="text-left text-sm text-red-400 hover:underline sm:col-span-2"
              >
                Retirer ce projet
              </button>
            </div>
          ))}
          <button type="button" onClick={addProjet} className="rounded-lg border border-white/15 px-4 py-2 text-sm">
            + Ajouter un projet
          </button>
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
