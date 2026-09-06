import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFetch } from "../../hooks/useFetch.js";
import { useLocale } from "../../hooks/useLocale.js";
import { useAuth } from "../../hooks/useAuth.js";
import { eventsApi } from "../../api/events.js";

export default function DashboardRegistrations() {
  const { t } = useTranslation();
  const { t: loc } = useLocale();
  const { user, isAdmin } = useAuth();
  const { data: events, loading } = useFetch(() => eventsApi.list({}), []);
  const [openId, setOpenId] = useState(null);
  const [registrations, setRegistrations] = useState({});
  // Fourni par DashboardLayout (voir Outlet context) : absent si cette page
  // est rendue hors de ce layout (peu probable, mais évite un crash).
  const { refetchStats } = useOutletContext() ?? {};

  const visible = isAdmin ? events : events?.filter((e) => (e.cellule?._id ?? e.cellule) === user.cellule);

  const toggle = async (id) => {
    if (openId === id) return setOpenId(null);
    setOpenId(id);
    if (!registrations[id]) {
      // Le backend marque les inscriptions de cet événement comme lues dès
      // qu'on les consulte (voir listEventRegistrations) — on redemande les
      // compteurs pour que le badge "Inscriptions" de la sidebar se mette
      // à jour tout de suite, sans recharger la page.
      const list = await eventsApi.listRegistrations(id);
      setRegistrations((r) => ({ ...r, [id]: list }));
      refetchStats?.();
    }
  };

  if (loading) return null;

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl">{t("dashboard.registrations")}</h1>

      <div className="flex flex-col gap-3">
        {visible?.map((ev) => (
          <div key={ev._id} className="rounded-xl border border-white/10">
            <button
              onClick={() => toggle(ev._id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span>{loc(ev, "titre")}</span>
              <span className="text-sm text-white/40">{ev.nombreParticipants} {t("events.capacity")}</span>
            </button>
            {openId === ev._id && (
              <div className="border-t border-white/10 px-5 py-4">
                {!registrations[ev._id]?.length ? (
                  <p className="text-sm text-white/40">{t("common.empty")}</p>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead className="text-white/40">
                      <tr>
                        <th className="pb-2">{t("common.name")}</th>
                        <th className="pb-2">{t("common.email")}</th>
                        <th className="pb-2">{t("common.phone")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations[ev._id].map((r) => (
                        <tr key={r._id} className="border-t border-white/5">
                          <td className="py-2">{r.nom}</td>
                          <td className="py-2 text-white/60">{r.email}</td>
                          <td className="py-2 text-white/60">{r.telephone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
