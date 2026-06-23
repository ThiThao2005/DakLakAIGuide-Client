import axiosClient from "./axiosClient";

const cultureApi = {
  getAll: () => axiosClient.get("/culture"),
  getById: (id) => axiosClient.get(`/culture/${id}`),
};

export default cultureApi;