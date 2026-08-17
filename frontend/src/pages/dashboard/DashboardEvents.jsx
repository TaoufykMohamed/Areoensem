import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../../hooks/useFetch.js";
import { useLocale } from "../../hooks/useLocale.js";
import { useAuth } from "../../hooks/useAuth.js";
import { eventsApi } from "../../api/events.js";
import { cellsApi } from "../../api/cells.js";
import FileUpload from "../../components/ui/FileUpload.jsx";

function emptyForm(user) {
  return {
    titreFr: "",
    titreEn: "",
    descriptionFr: "",
    descriptionEn: "",
    affiche: "",
    dateDebut: "",
    dateFin: "",
    lieuFr: "",
    lieuEn: "",
    cellule: user.role === "chef_cellule" ? user.cellule : "",
    inscriptionsOuvertes: false,
    capacite: "",
    invites: [],
  };
}

export default function DashboardEvents() {
  const { t } = useTranslation();
  const { t: loc } = useLocale();
  const { user, isAdmin } = useAuth();
  const { data: events, loading, refetch } = useFetch(() => eventsApi.list({}), []);
  const { data: cells } = useFetch(() => cellsApi.list(), []);
  const [form, setForm] = useState(() => emptyForm(user));
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [inviteInput, setInviteInput] = useState("");

  const visible = isAdmin ? events : events?.filter((e) => (e.cellule?._id ?? e.cellule) === user.cellule);

  const startEdit = (event) => {
    setEditingId(event._id);
    setForm({
      titreFr: event.titreFr,
      titreEn: event.titreEn,
      descriptionFr: event.descriptionFr,
      descriptionEn: event.descriptionEn,
      affiche: event.affiche || "",
      dateDebut: event.dateDebut.slice(0, 10),
      dateFin: event.dateFin.slice(0, 10),
      lieuFr: event.lieuFr,
      lieuEn: event.lieuEn,
      cellule: event.cellule?._id ?? event.cellule,
      inscriptionsOuvertes: event.inscriptionsOuvertes,
      capacite: event.capacite ?? "",
      invites: event.invites || [],
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm(user));
    setInviteInput("");
  };

  const addInvite = () => {
    const value = inviteInput.trim();
    if (!value) return;
    setForm((f) => ({ ...f, invites: [...f.invites, value] }));
    setInviteInput("");
  };

  const removeInvite = (i) => {
    setForm((f) => ({ ...f, invites: f.invites.filter((_, idx) => idx !== i) }));
  };

  const handleImage = async (file) => {
    if (!file) {
      setForm((f) => ({ ...f, affiche: "" }));
      return;
    }
    setError("");
    setUploading(true);
    try {
      const { url } = await eventsApi.uploadImage(file);
      setForm((f) => ({ ...f, affiche: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");
    const payload = { ...form, capacite: form.capacite ? Number(form.capacite) : null };
    try {
      if (editingId) {
        await eventsApi.update(editingId, payload);
      } else {
        await eventsApi.create(payload);
      }
      cancelEdit();
      refetch();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm(t("common.confirm") + " ?")) return;
    await eventsApi.remove(id);
    refetch();
  };

  if (loading) return null;

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl">{t("dashboard.events")}</h1>

      <form onSubmit={save} className="mb-8 grid gap-3 rounded-xl border border-white/10 p-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FileUpload
            key={editingId || "new"}
            onFileSelect={handleImage}
            existingUrl={form.affiche}
            disabled={uploading}
            hint="PNG ou JPG, 1 Mo max"
          />
        </div>
        <input required placeholder="Titre (FR)" value={form.titreFr} onChange={(e) => setForm({ ...form, titreFr: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        <input placeholder="Title (EN)" value={form.titreEn} onChange={(e) => setForm({ ...form, titreEn: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        <textarea required placeholder="Description (FR)" value={form.descriptionFr} onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm sm:col-span-2" />
        <input required type="date" value={form.dateDebut} onChange={(e) => setForm({ ...form, dateDebut: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        <input required type="date" value={form.dateFin} onChange={(e) => setForm({ ...form, dateFin: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        <input required placeholder="Lieu (FR)" value={form.lieuFr} onChange={(e) => setForm({ ...form, lieuFr: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        <input placeholder="Location (EN)" value={form.lieuEn} onChange={(e) => setForm({ ...form, lieuEn: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        {isAdmin && (
          <select required value={form.cellule} onChange={(e) => setForm({ ...form, cellule: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm">
            <option value="">Cellule</option>
            {cells?.map((c) => (
              <option key={c._id} value={c._id}>{loc(c, "nom")}</option>
            ))}
          </select>
        )}
        <input type="number" placeholder="Capacité" value={form.capacite} onChange={(e) => setForm({ ...form, capacite: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.inscriptionsOuvertes} onChange={(e) => setForm({ ...form, inscriptionsOuvertes: e.target.checked })} />
          {t("events.registrationsOpen")}
        </label>

        {/* Invités / intervenants */}
        <div className="sm:col-span-2">
          <label className="mb-2 block text-xs uppercase tracking-instrument text-white/40">Invités</label>
          {form.invites.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {form.invites.map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs text-white/80"
                >
                  {name}
                  <button
                    type="button"
                    onClick={() => removeInvite(i)}
                    aria-label={`Retirer ${name}`}
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
              placeholder="Ajouter un invité (nom)"
              value={inviteInput}
              onChange={(e) => setInviteInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addInvite();
                }
              }}
              className="flex-1 rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm"
            />
            <button type="button" onClick={addInvite} className="rounded-lg border border-white/15 px-4 text-sm">
              Ajouter
            </button>
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
            <th className="pb-2">{t("common.name")}</th>
            <th className="pb-2">{t("common.date")}</th>
            <th className="pb-2">{t("common.status")}</th>
            <th className="pb-2">{t("common.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {visible?.map((ev) => (
            <tr key={ev._id} className="border-t border-white/10">
              <td className="py-3">{loc(ev, "titre")}</td>
              <td className="py-3 text-white/50">{new Date(ev.dateDebut).toLocaleDateString("fr-FR")}</td>
              <td className="py-3 text-white/50">{ev.statut}</td>
              <td className="py-3">
                <button onClick={() => startEdit(ev)} className="mr-3 text-brand-cyan hover:underline">{t("common.edit")}</button>
                <button onClick={() => remove(ev._id)} className="text-red-400 hover:underline">{t("common.delete")}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
