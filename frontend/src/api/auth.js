import { axiosClient } from "./axiosClient.js";

export const authApi = {
  login: (email, motDePasse) => axiosClient.post("/auth/login", { email, motDePasse }).then((d) => d.user),
  logout: () => axiosClient.post("/auth/logout"),
  me: () => axiosClient.get("/auth/me").then((d) => d.user),
  updatePassword: (ancienMotDePasse, nouveauMotDePasse) =>
    axiosClient.patch("/auth/password", { ancienMotDePasse, nouveauMotDePasse }),
};
