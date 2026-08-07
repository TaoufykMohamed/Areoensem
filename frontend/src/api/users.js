import { axiosClient } from "./axiosClient.js";

export const usersApi = {
  list: () => axiosClient.get("/users"),
  create: (data) => axiosClient.post("/users", data),
  update: (id, data) => axiosClient.patch(`/users/${id}`, data),
};
