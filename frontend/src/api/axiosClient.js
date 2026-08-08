import axios from "axios";

// Frontend et backend sur des domaines différents (Vercel/Render) :
// VITE_API_URL doit pointer vers l'URL complète du backend, ex.
// https://areoensem.onrender.com/api/v1. Sans cette variable, on retombe
// sur une URL relative (utile seulement si un jour le backend sert à
// nouveau le frontend en service unique, même origine).
const API_URL = import.meta.env.VITE_API_URL || "/api/v1";

export const axiosClient = axios.create({
  baseURL: API_URL,
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
