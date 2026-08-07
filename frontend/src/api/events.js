import { axiosClient } from "./axiosClient.js";

export const eventsApi = {
  list: (params) => axiosClient.get("/events", { params }),
  getBySlug: (slug) => axiosClient.get(`/events/${slug}`),
  create: (data) => axiosClient.post("/events", data),
  update: (id, data) => axiosClient.patch(`/events/${id}`, data),
  remove: (id) => axiosClient.delete(`/events/${id}`),
  register: (id, data) => axiosClient.post(`/events/${id}/register`, data),
  listRegistrations: (id) => axiosClient.get(`/events/${id}/registrations`),
};
