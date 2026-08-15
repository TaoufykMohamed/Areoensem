import { axiosClient } from "./axiosClient.js";

export const boardApi = {
  list: () => axiosClient.get("/board"),
  create: (data) => axiosClient.post("/board", data),
  update: (id, data) => axiosClient.patch(`/board/${id}`, data),
  remove: (id) => axiosClient.delete(`/board/${id}`),
  uploadPhoto: (file) => {
    const formData = new FormData();
    formData.append("photo", file);
    return axiosClient.post("/board/upload", formData);
  },
};
