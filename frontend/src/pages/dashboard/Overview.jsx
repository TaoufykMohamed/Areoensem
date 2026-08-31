import { useTranslation } from "react-i18next";
import { useFetch } from "../../hooks/useFetch.js";
import { useAuth } from "../../hooks/useAuth.js";
import { dashboardApi } from "../../api/dashboard.js";
import Spinner from "../../components/ui/Spinner.jsx";

function StatTile({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 p-6">
      <div className="text-3xl font-bold text-brand-cyan">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-instrument text-white/40">{label}</div>
    </div>
  );
}

export default function Overview() {
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();
  const { data: stats, loading } = useFetch(() => dashboardApi.stats(), []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="font-serif text-3xl">
        {t("dashboard.welcome")}, {user.nom}
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isAdmin ? (
          <>
            <StatTile label={t("dashboard.cells")} value={stats.cellules} />
            <StatTile label={t("events.upcoming")} value={stats.evenements.aVenir} />
            <StatTile label={t("events.ongoing")} value={stats.evenements.enCours} />
            <StatTile label={t("events.past")} value={stats.evenements.passes} />
            <StatTile label={t("dashboard.applications")} value={stats.candidaturesEnAttente} />
            <StatTile label={t("dashboard.messages")} value={stats.messagesNonLus} />
            <StatTile label={t("dashboard.orders")} value={stats.commandesEnAttente} />
            <StatTile label={t("dashboard.registrations")} value={stats.inscriptionsEnAttente} />
            <StatTile label={t("dashboard.users")} value={stats.utilisateurs} />
          </>
        ) : (
          <>
            <StatTile label={t("dashboard.events")} value={stats.evenements} />
            <StatTile label={t("dashboard.registrations")} value={stats.inscriptions} />
            <StatTile label={t("dashboard.gallery")} value={stats.galerie} />
          </>
        )}
      </div>
    </div>
  );
}
