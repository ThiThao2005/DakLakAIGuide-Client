import axiosClient from "./axiosClient";

const ocopApi = {
  getAll: () => axiosClient.get("/ocop"),
  getById: (id) => axiosClient.get(`/ocop/${id}`),
};

export default ocopApi;