import { axiosClient } from "./axiosClient.js";

export const applicationsApi = {
  create: (data) => axiosClient.post("/applications", data),
  list: () => axiosClient.get("/applications"),
  updateStatut: (id, statut) => axiosClient.patch(`/applications/${id}`, { statut }),
};
