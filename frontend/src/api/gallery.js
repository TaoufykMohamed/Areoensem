import { axiosClient } from "./axiosClient.js";

export const galleryApi = {
  list: (params) => axiosClient.get("/gallery", { params }),
  create: (data) => axiosClient.post("/gallery", data),
  remove: (id) => axiosClient.delete(`/gallery/${id}`),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return axiosClient.post("/gallery/upload", formData);
  },
};
