import axiosClient from "./axiosClient";

const authApi = {
  login: (username, password) => axiosClient.post("/auth/login", { username, password }),
  me: () => axiosClient.get("/auth/me"),
};

export default authApi;
