import { axiosClient } from "./axiosClient.js";

export const galleryApi = {
  list: (params) => axiosClient.get("/gallery", { params }),
  create: (data) => axiosClient.post("/gallery", data),
  remove: (id) => axiosClient.delete(`/gallery/${id}`),
};
