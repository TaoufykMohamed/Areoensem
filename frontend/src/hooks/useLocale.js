import { useTranslation } from "react-i18next";

/**
 * Lit un champ bilingue `${base}Fr`/`${base}En` d'un objet renvoyé par
 * l'API, avec repli sur le français — miroir de backend/src/utils/localize.js.
 */
export function useLocale() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("en") ? "en" : "fr";

  function t(obj, base) {
    if (!obj) return "";
    const en = obj[`${base}En`];
    const fr = obj[`${base}Fr`];
    return lang === "en" && en ? en : fr ?? "";
  }

  return { lang, t };
}
