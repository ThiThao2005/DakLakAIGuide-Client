import axiosClient from "./axiosClient";

const ocopApi = {
  getAll: () => axiosClient.get("/ocop"),
  getById: (id) => axiosClient.get(`/ocop/${id}`),
  create: (data) => axiosClient.post("/ocop", data),
  update: (id, data) => axiosClient.put(`/ocop/${id}`, data),
  remove: (id) => axiosClient.delete(`/ocop/${id}`),
};

export default ocopApi;
