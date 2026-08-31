import { useTranslation } from "react-i18next";
import { useFetch } from "../../hooks/useFetch.js";
import { useLocale } from "../../hooks/useLocale.js";
import { ordersApi } from "../../api/products.js";

const STATUTS = ["en_attente", "confirmee", "annulee"];

export default function DashboardOrders() {
  const { t } = useTranslation();
  const { t: loc } = useLocale();
  const { data: orders, loading, refetch } = useFetch(() => ordersApi.list(), []);

  const updateStatut = async (id, statut) => {
    await ordersApi.updateStatut(id, statut);
    refetch();
  };

  if (loading) return null;

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl">{t("dashboard.orders")}</h1>

      <table className="w-full text-left text-sm">
        <thead className="text-white/40">
          <tr>
            <th className="pb-2">{t("common.name")}</th>
            <th className="pb-2">Produit</th>
            <th className="pb-2">Qté</th>
            <th className="pb-2">{t("common.status")}</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((o) => (
            <tr key={o._id} className="border-t border-white/10">
              <td className="py-3">
                {o.prenom} {o.nom}
                <div className="text-xs text-white/40">{o.email} · {o.telephone}</div>
                {o.adresse && <div className="text-xs text-white/40">{o.adresse}</div>}
              </td>
              <td className="py-3 text-white/60">{o.produit ? loc(o.produit, "nom") : "—"}</td>
              <td className="py-3 text-white/60">{o.quantite}</td>
              <td className="py-3">
                <select
                  value={o.statut}
                  onChange={(e) => updateStatut(o._id, e.target.value)}
                  className="rounded-lg border border-white/15 bg-transparent px-2 py-1 text-sm"
                >
                  {STATUTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
