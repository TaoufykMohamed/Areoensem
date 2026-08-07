import { axiosClient } from "./axiosClient.js";

export const partnersApi = {
  list: () => axiosClient.get("/partners"),
  create: (data) => axiosClient.post("/partners", data),
  update: (id, data) => axiosClient.patch(`/partners/${id}`, data),
  remove: (id) => axiosClient.delete(`/partners/${id}`),
};
