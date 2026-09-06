import { useEffect, useState, useCallback } from "react";

// Cache mémoire partagé entre toutes les instances du hook, pour la durée
// de la session (vidé au rechargement complet de la page). Certaines
// réponses pèsent plusieurs Mo (médias en base64) — sans ça, revenir sur
// une page déjà visitée (ex. Accueil -> Cellules -> Accueil) retélécharge
// tout depuis zéro à chaque fois. Strictement opt-in via `cacheKey` : sans
// lui, comportement identique à avant (aucune mise en cache).
const cache = new Map();
const CACHE_TTL_MS = 60_000;

/**
 * Petit hook générique pour un GET : `fetcher` est une fonction qui
 * retourne une promesse (ex. () => cellsApi.list()). Redéclenché quand
 * `deps` change. `cacheKey` (optionnel) sert une réponse récente depuis le
 * cache mémoire sans requête si elle a moins de 60s, pour les pages
 * publiques régulièrement revisitées dans une même session.
 */
export function useFetch(fetcher, deps = [], cacheKey = null) {
  const cached = cacheKey ? cache.get(cacheKey) : null;
  const isFresh = !!cached && Date.now() - cached.time < CACHE_TTL_MS;

  const [data, setData] = useState(isFresh ? cached.data : null);
  const [loading, setLoading] = useState(!isFresh);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    return fetcher()
      .then((result) => {
        setData(result);
        if (cacheKey) cache.set(cacheKey, { data: result, time: Date.now() });
      })
      .catch(setError)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (isFresh) return;
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  return { data, loading, error, refetch };
}
