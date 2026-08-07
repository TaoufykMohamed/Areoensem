import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../../hooks/useFetch.js";
import { useLocale } from "../../hooks/useLocale.js";
import { useAuth } from "../../hooks/useAuth.js";
import { eventsApi } from "../../api/events.js";
import { cellsApi } from "../../api/cells.js";

function emptyForm(user) {
  return {
    titreFr: "",
    titreEn: "",
    descriptionFr: "",
    descriptionEn: "",
    dateDebut: "",
    dateFin: "",
    lieuFr: "",
    lieuEn: "",
    cellule: user.role === "chef_cellule" ? user.cellule : "",
    inscriptionsOuvertes: false,
    capacite: "",
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
  const [error, setError] = useState("");

  const visible = isAdmin ? events : events?.filter((e) => (e.cellule?._id ?? e.cellule) === user.cellule);

  const startEdit = (event) => {
    setEditingId(event._id);
    setForm({
      titreFr: event.titreFr,
      titreEn: event.titreEn,
      descriptionFr: event.descriptionFr,
      descriptionEn: event.descriptionEn,
      dateDebut: event.dateDebut.slice(0, 10),
      dateFin: event.dateFin.slice(0, 10),
      lieuFr: event.lieuFr,
      lieuEn: event.lieuEn,
      cellule: event.cellule?._id ?? event.cellule,
      inscriptionsOuvertes: event.inscriptionsOuvertes,
      capacite: event.capacite ?? "",
    });
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
      setEditingId(null);
      setForm(emptyForm(user));
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
        {error && <p className="text-xs text-red-400 sm:col-span-2">{error}</p>}
        <div className="flex gap-2 sm:col-span-2">
          <button type="submit" className="rounded-full bg-brand-cyan px-5 py-2 text-sm font-semibold text-[#04101f]">
            {editingId ? t("common.save") : t("common.create")}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm(user)); }} className="rounded-full border border-white/15 px-5 py-2 text-sm">
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
