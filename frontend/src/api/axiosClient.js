import axios from "axios";

// URL relative : même origine en production (le backend sert le build),
// et Vite proxifie /api vers le backend en développement (vite.config.js).
export const axiosClient = axios.create({
  baseURL: "/api/v1",
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
