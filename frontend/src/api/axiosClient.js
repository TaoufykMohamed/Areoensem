import axios from "axios";

// Frontend et backend sur des domaines différents (Vercel/Render) :
// VITE_API_URL doit pointer vers le backend. On tolère qu'elle soit
// fournie avec ou sans le suffixe /api/v1 (erreur de saisie courante,
// ex. "https://mon-backend.onrender.com" au lieu de ".../api/v1") pour
// ne pas retomber en silence sur des 404 juste à cause d'une variable
// d'environnement mal renseignée.
function resolveApiUrl() {
  const raw = import.meta.env.VITE_API_URL;
  if (!raw) return "/api/v1"; // même origine (dev proxy Vite, ou service unique)

  const trimmed = raw.replace(/\/+$/, "");
  return trimmed.endsWith("/api/v1") ? trimmed : `${trimmed}/api/v1`;
}

export const axiosClient = axios.create({
  baseURL: resolveApiUrl(),
  withCredentials: true, // le cookie httpOnly voyage avec chaque requête
});

// Le backend répond toujours { success, data, message }. On déballe ici
// pour que le reste du frontend manipule directement `data`, et on
// remonte un Error(message) lisible en cas d'échec.
axiosClient.interceptors.response.use(
  (res) => res.data?.data,
  (err) => {
    const message = err.response?.data?.message ?? err.message ?? "Erreur réseau";
    const apiError = new Error(message);
    apiError.status = err.response?.status;
    apiError.errors = err.response?.data?.errors;
    return Promise.reject(apiError);
  }
);
