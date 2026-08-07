import { axiosClient } from "./axiosClient.js";

export const productsApi = {
  list: () => axiosClient.get("/products"),
  create: (data) => axiosClient.post("/products", data),
  update: (id, data) => axiosClient.patch(`/products/${id}`, data),
  remove: (id) => axiosClient.delete(`/products/${id}`),
};

export const ordersApi = {
  create: (data) => axiosClient.post("/orders", data),
  list: () => axiosClient.get("/orders"),
  updateStatut: (id, statut) => axiosClient.patch(`/orders/${id}`, { statut }),
};
