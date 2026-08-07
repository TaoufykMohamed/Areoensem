import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <div className="font-mono text-sm uppercase tracking-instrument text-brand-cyan">404</div>
      <h1 className="font-serif text-3xl">Page introuvable</h1>
      <Link to="/" className="text-brand-cyan hover:text-brand-amber">
        {t("nav.home")}
      </Link>
    </div>
  );
}
