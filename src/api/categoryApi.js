import axiosClient from "./axiosClient";

// type: "places" | "ocop" | "culture"
const categoryApi = {
  getAll: (type) => axiosClient.get(`/categories/${type}`),
};

export default categoryApi;
