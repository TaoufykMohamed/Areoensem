import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../../hooks/useFetch.js";
import { useLocale } from "../../hooks/useLocale.js";
import { productsApi } from "../../api/products.js";

const emptyForm = { nomFr: "", nomEn: "", prix: "", stock: 0, disponible: true };

export default function DashboardStore() {
  const { t } = useTranslation();
  const { t: loc } = useLocale();
  const { data: products, loading, refetch } = useFetch(() => productsApi.list(), []);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await productsApi.create({ ...form, prix: Number(form.prix), stock: Number(form.stock) });
      setForm(emptyForm);
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
        <input required placeholder="Nom (FR)" value={form.nomFr} onChange={(e) => setForm({ ...form, nomFr: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        <input placeholder="Name (EN)" value={form.nomEn} onChange={(e) => setForm({ ...form, nomEn: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        <input required type="number" placeholder="Prix (MAD)" value={form.prix} onChange={(e) => setForm({ ...form, prix: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm" />
        {error && <p className="text-xs text-red-400 sm:col-span-2">{error}</p>}
        <button type="submit" className="rounded-full bg-brand-cyan px-5 py-2 text-sm font-semibold text-[#04101f] sm:col-span-2">
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
