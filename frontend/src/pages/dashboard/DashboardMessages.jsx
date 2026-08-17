import { useTranslation } from "react-i18next";
import { useFetch } from "../../hooks/useFetch.js";
import { useLocale } from "../../hooks/useLocale.js";
import { messagesApi } from "../../api/messages.js";

export default function DashboardMessages() {
  const { t } = useTranslation();
  const { t: loc } = useLocale();
  const { data: messages, loading, refetch } = useFetch(() => messagesApi.list(), []);

  const markRead = async (id) => {
    await messagesApi.markRead(id);
    refetch();
  };

  if (loading) return null;

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl">{t("dashboard.messages")}</h1>

      <div className="flex flex-col gap-3">
        {messages?.map((m) => (
          <div key={m._id} className={`rounded-xl border p-5 ${m.lu ? "border-white/10 opacity-60" : "border-brand-cyan/40"}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{m.sujet}</span>
                  {m.type === "feedback" && (
                    <span className="rounded-full bg-brand-cyan/15 px-2 py-0.5 text-[10px] uppercase tracking-instrument text-brand-cyan">
                      Feedback{m.event ? ` — ${loc(m.event, "titre")}` : ""}
                    </span>
                  )}
                </div>
                {(m.nom || m.email) && (
                  <div className="text-xs text-white/40">
                    {[m.nom, m.email].filter(Boolean).join(" — ")}
                  </div>
                )}
              </div>
              {!m.lu && (
                <button onClick={() => markRead(m._id)} className="text-xs text-brand-cyan hover:underline">
                  Marquer comme lu
                </button>
              )}
            </div>
            <p className="mt-3 text-sm text-white/70">{m.contenu}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
