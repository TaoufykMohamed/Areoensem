import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../../hooks/useFetch.js";
import { useLocale } from "../../hooks/useLocale.js";
import { usersApi } from "../../api/users.js";
import { cellsApi } from "../../api/cells.js";

const emptyForm = { nom: "", email: "", motDePasse: "", role: "chef_cellule", cellule: "" };

export default function DashboardUsers() {
  const { t } = useTranslation();
  const { t: loc } = useLocale();
  const { data: users, loading, refetch } = useFetch(() => usersApi.list(), []);
  const { data: cells } = useFetch(() => cellsApi.list(), []);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await usersApi.create(form.role === "admin" ? { ...form, cellule: undefined } : form);
      setForm(emptyForm);
      refetch();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleActif = async (u) => {
    await usersApi.update(u._id, { actif: !u.actif });
    refetch();
  };

  if (loading) return null;

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl">{t("dashboard.users")}</h1>

      <form onSubmit={submit} className="mb-8 grid gap-3 rounded-xl border border-white/10 p-5 sm:grid-cols-2">
        <input required placeholder={t("common.name")} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        <input required type="email" placeholder={t("common.email")} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        <input required type="password" placeholder="Mot de passe" value={form.motDePasse} onChange={(e) => setForm({ ...form, motDePasse: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm">
          <option value="chef_cellule">Chef de cellule</option>
          <option value="admin">Admin</option>
        </select>
        {form.role === "chef_cellule" && (
          <select required value={form.cellule} onChange={(e) => setForm({ ...form, cellule: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm sm:col-span-2">
            <option value="">Cellule</option>
            {cells?.map((c) => (
              <option key={c._id} value={c._id}>{loc(c, "nom")}</option>
            ))}
          </select>
        )}
        {error && <p className="text-xs text-red-400 sm:col-span-2">{error}</p>}
        <button type="submit" className="rounded-full bg-brand-cyan px-5 py-2 text-sm font-semibold text-[#04101f] sm:col-span-2">
          {t("common.create")}
        </button>
      </form>

      <table className="w-full text-left text-sm">
        <thead className="text-white/40">
          <tr>
            <th className="pb-2">{t("common.name")}</th>
            <th className="pb-2">{t("common.email")}</th>
            <th className="pb-2">Rôle</th>
            <th className="pb-2">{t("common.status")}</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((u) => (
            <tr key={u._id} className="border-t border-white/10">
              <td className="py-3">{u.nom}</td>
              <td className="py-3 text-white/60">{u.email}</td>
              <td className="py-3 text-white/60">{u.role}</td>
              <td className="py-3">
                <button onClick={() => toggleActif(u)} className={u.actif ? "text-brand-cyan" : "text-white/30"}>
                  {u.actif ? "actif" : "inactif"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
