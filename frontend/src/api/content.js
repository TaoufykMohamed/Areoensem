import { axiosClient } from "./axiosClient.js";

export const contentApi = {
  list: () => axiosClient.get("/content"),
  upsert: (cle, valeurFr, valeurEn) => axiosClient.patch("/content", { cle, valeurFr, valeurEn }),
};

export const statsApi = {
  list: () => axiosClient.get("/stats"),
  upsert: (cle, labelFr, labelEn, valeur) => axiosClient.patch("/stats", { cle, labelFr, labelEn, valeur }),
};
