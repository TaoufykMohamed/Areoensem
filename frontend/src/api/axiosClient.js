import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

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
