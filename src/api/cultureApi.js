import axiosClient from "./axiosClient";

const cultureApi = {
  getAll: () => axiosClient.get("/culture"),
  getById: (id) => axiosClient.get(`/culture/${id}`),
  create: (data) => axiosClient.post("/culture", data),
  update: (id, data) => axiosClient.put(`/culture/${id}`, data),
  remove: (id) => axiosClient.delete(`/culture/${id}`),
};

export default cultureApi;
