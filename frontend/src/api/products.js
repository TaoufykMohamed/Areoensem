import { axiosClient } from "./axiosClient.js";

export const productsApi = {
  // La liste n'inclut pas la vidéo (voir product.routes.js) : la fiche
  // complète se récupère à la demande via get(id).
  list: () => axiosClient.get("/products"),
  get: (id) => axiosClient.get(`/products/${id}`),
  create: (data) => axiosClient.post("/products", data),
  update: (id, data) => axiosClient.patch(`/products/${id}`, data),
  remove: (id) => axiosClient.delete(`/products/${id}`),
  uploadPoster: (file) => {
    const formData = new FormData();
    formData.append("poster", file);
    return axiosClient.post("/products/upload-poster", formData);
  },
  uploadVideo: (file) => {
    const formData = new FormData();
    formData.append("video", file);
    return axiosClient.post("/products/upload-video", formData);
  },
};

export const ordersApi = {
  create: (data) => axiosClient.post("/orders", data),
  list: () => axiosClient.get("/orders"),
  updateStatut: (id, statut) => axiosClient.patch(`/orders/${id}`, { statut }),
};
