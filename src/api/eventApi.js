import axiosClient from "./axiosClient";

const eventApi = {
  getAll: (params) => axiosClient.get("/events", { params }),
  getById: (id) => axiosClient.get(`/events/${id}`),
  create: (data) => axiosClient.post("/events", data),
  update: (id, data) => axiosClient.put(`/events/${id}`, data),
  remove: (id) => axiosClient.delete(`/events/${id}`),
};

export default eventApi;
