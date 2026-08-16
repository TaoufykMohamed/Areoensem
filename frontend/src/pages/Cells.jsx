import { useTranslation } from "react-i18next";
import { useFetch } from "../hooks/useFetch.js";
import { cellsApi } from "../api/cells.js";
import PageHero from "../components/layout/PageHero.jsx";
import CellHoverGrid from "../components/cards/CellHoverGrid.jsx";
import Spinner from "../components/ui/Spinner.jsx";

export default function Cells() {
  const { t } = useTranslation();
  const { data: cells, loading } = useFetch(() => cellsApi.list(), []);

  return (
    <div>
      <PageHero eyebrow={t("cells.title")} title={t("cells.title")} subtitle={t("cells.subtitle")} />
      <section className="mx-auto max-w-7xl px-6 py-16">
        {loading ? <Spinner /> : <CellHoverGrid cells={cells || []} />}
      </section>
    </div>
  );
}
