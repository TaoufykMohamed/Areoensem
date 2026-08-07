/**
 * Retourne la valeur localisée d'un champ bilingue `${base}Fr`/`${base}En`,
 * avec repli sur le français si la traduction anglaise est absente.
 * `doc` peut être un document Mongoose ou un objet brut.
 */
export function localize(doc, base, lang = "fr") {
  const fr = doc[`${base}Fr`];
  const en = doc[`${base}En`];
  return lang === "en" && en ? en : fr;
}
