import { axiosClient } from "./axiosClient.js";

export const messagesApi = {
  create: (data) => axiosClient.post("/messages", data),
  list: () => axiosClient.get("/messages"),
  markRead: (id) => axiosClient.patch(`/messages/${id}`),
};
