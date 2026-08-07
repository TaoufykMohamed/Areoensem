import { axiosClient } from "./axiosClient.js";

export const dashboardApi = {
  stats: () => axiosClient.get("/dashboard/stats"),
};
