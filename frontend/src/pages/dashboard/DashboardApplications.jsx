import { useTranslation } from "react-i18next";
import { useFetch } from "../../hooks/useFetch.js";
import { useLocale } from "../../hooks/useLocale.js";
import { applicationsApi } from "../../api/applications.js";

const STATUTS = ["en_attente", "confirme", "refuse"];

export default function DashboardApplications() {
  const { t } = useTranslation();
  const { t: loc } = useLocale();
  const { data: applications, loading, refetch } = useFetch(() => applicationsApi.list(), []);

  const updateStatut = async (id, statut) => {
    await applicationsApi.updateStatut(id, statut);
    refetch();
  };

  if (loading) return null;

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl">{t("dashboard.applications")}</h1>

      <table className="w-full text-left text-sm">
        <thead className="text-white/40">
          <tr>
            <th className="pb-2">{t("common.name")}</th>
            <th className="pb-2">{t("common.email")}</th>
            <th className="pb-2">Cellule</th>
            <th className="pb-2">{t("common.status")}</th>
          </tr>
        </thead>
        <tbody>
          {applications?.map((a) => (
            <tr key={a._id} className="border-t border-white/10 align-top">
              <td className="py-3">{a.nom}</td>
              <td className="py-3 text-white/60">{a.email}</td>
              <td className="py-3 text-white/60">{a.celluleSouhaitee ? loc(a.celluleSouhaitee, "nom") : "—"}</td>
              <td className="py-3">
                <select
                  value={a.statut}
                  onChange={(e) => updateStatut(a._id, e.target.value)}
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
