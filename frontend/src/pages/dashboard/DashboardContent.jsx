import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../../hooks/useFetch.js";
import { contentApi, statsApi } from "../../api/content.js";

function ContentRow({ item, onSaved }) {
  const [fr, setFr] = useState(item.valeurFr);
  const [en, setEn] = useState(item.valeurEn);
  const save = async () => {
    await contentApi.upsert(item.cle, fr, en);
    onSaved();
  };
  return (
    <div className="grid gap-2 border-t border-white/10 py-4 sm:grid-cols-[160px_1fr_1fr_auto] sm:items-start">
      <div className="font-mono text-xs text-white/40">{item.cle}</div>
      <textarea value={fr} onChange={(e) => setFr(e.target.value)} className="rounded-lg border border-white/15 bg-transparent px-2 py-1 text-sm" rows={2} />
      <textarea value={en} onChange={(e) => setEn(e.target.value)} className="rounded-lg border border-white/15 bg-transparent px-2 py-1 text-sm" rows={2} />
      <button onClick={save} className="h-fit rounded-full bg-brand-cyan px-4 py-1.5 text-xs font-semibold text-[#04101f]">
        Enregistrer
      </button>
    </div>
  );
}

function StatRow({ item, onSaved }) {
  const [labelFr, setLabelFr] = useState(item.labelFr);
  const [labelEn, setLabelEn] = useState(item.labelEn);
  const [valeur, setValeur] = useState(item.valeur);
  const save = async () => {
    await statsApi.upsert(item.cle, labelFr, labelEn, Number(valeur));
    onSaved();
  };
  return (
    <div className="grid gap-2 border-t border-white/10 py-4 sm:grid-cols-[160px_1fr_1fr_100px_auto] sm:items-center">
      <div className="font-mono text-xs text-white/40">{item.cle}</div>
      <input value={labelFr} onChange={(e) => setLabelFr(e.target.value)} className="rounded-lg border border-white/15 bg-transparent px-2 py-1 text-sm" />
      <input value={labelEn} onChange={(e) => setLabelEn(e.target.value)} className="rounded-lg border border-white/15 bg-transparent px-2 py-1 text-sm" />
      <input type="number" value={valeur} onChange={(e) => setValeur(e.target.value)} className="rounded-lg border border-white/15 bg-transparent px-2 py-1 text-sm" />
      <button onClick={save} className="rounded-full bg-brand-cyan px-4 py-1.5 text-xs font-semibold text-[#04101f]">
        Enregistrer
      </button>
    </div>
  );
}

export default function DashboardContent() {
  const { t } = useTranslation();
  const { data: content, refetch: refetchContent } = useFetch(() => contentApi.list(), []);
  const { data: stats, refetch: refetchStats } = useFetch(() => statsApi.list(), []);

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl">{t("dashboard.content")}</h1>

      <h2 className="mb-2 font-mono text-[11px] uppercase tracking-instrument text-brand-cyan">Textes</h2>
      <div>{content?.map((c) => <ContentRow key={c.cle} item={c} onSaved={refetchContent} />)}</div>

      <h2 className="mb-2 mt-10 font-mono text-[11px] uppercase tracking-instrument text-brand-cyan">Chiffres clés</h2>
      <div>{stats?.map((s) => <StatRow key={s.cle} item={s} onSaved={refetchStats} />)}</div>
    </div>
  );
}
