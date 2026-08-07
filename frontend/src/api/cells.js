import { axiosClient } from "./axiosClient.js";

export const cellsApi = {
  list: () => axiosClient.get("/cells"),
  getBySlug: (slug) => axiosClient.get(`/cells/${slug}`),
  create: (data) => axiosClient.post("/cells", data),
  update: (id, data) => axiosClient.patch(`/cells/${id}`, data),
  remove: (id) => axiosClient.delete(`/cells/${id}`),
};
