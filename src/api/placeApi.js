import axiosClient from "./axiosClient";

const placeApi = {
  getAll: () => axiosClient.get("/places"),
  getById: (id) => axiosClient.get(`/places/${id}`),
};

export default placeApi;