import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#04101f] px-6 pb-10 pt-16 text-white/70">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div>
          <div className="text-xl font-bold text-white">
            CLUB AÉRO<span className="text-brand-cyan">ENSEM</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-white/50">
            Together we fly, together we climb the sky.
          </p>
        </div>

        <div>
          <div className="mb-4 font-mono text-[11px] uppercase tracking-instrument text-white/40">
            {t("footer.navigation")}
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/cellules" className="hover:text-brand-cyan">{t("nav.cells")}</Link>
            <Link to="/evenements" className="hover:text-brand-cyan">{t("nav.events")}</Link>
            <Link to="/bureau" className="hover:text-brand-cyan">{t("nav.board")}</Link>
            <Link to="/store" className="hover:text-brand-cyan">{t("nav.store")}</Link>
          </div>
        </div>

        <div>
          <div className="mb-4 font-mono text-[11px] uppercase tracking-instrument text-white/40">
            {t("footer.contact")}
          </div>
          <div className="flex flex-col gap-2 text-sm text-white/60">
            <span>club-aeronautique@ensem.ac.ma</span>
            <span>+212 770-190444</span>
            <span>{t("footer.address")}</span>
          </div>
        </div>

        <div>
          <div className="mb-4 font-mono text-[11px] uppercase tracking-instrument text-white/40">
            {t("footer.newsletter")}
          </div>
          <p className="text-sm text-white/50">{t("footer.newsletterText")}</p>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {new Date().getFullYear()} {t("footer.rights")}
        </span>
        <span>
          Created with 💙 by{" "}
          <a
            href="https://www.linkedin.com/in/mohamed-taoufyk-93b538370/"
            target="_blank"
            rel="noreferrer"
            className="text-white/60 transition-colors hover:text-brand-cyan"
          >
            Mohamed Taoufyk
          </a>
        </span>
      </div>
    </footer>
  );
}
