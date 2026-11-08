import axiosClient from "./axiosClient";

const placeApi = {
  getAll: () => axiosClient.get("/places"),
  getById: (id) => axiosClient.get(`/places/${id}`),
  create: (data) => axiosClient.post("/places", data),
  update: (id, data) => axiosClient.put(`/places/${id}`, data),
  remove: (id) => axiosClient.delete(`/places/${id}`),
};

export default placeApi;
