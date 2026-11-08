import axios from "axios";

export const TOKEN_KEY = "daklak_token";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5093/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Gắn token JWT vào mọi request nếu đã đăng nhập
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Token hết hạn → xóa và báo cho AuthContext
axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error, fallback = "Đã có lỗi xảy ra") {
  if (error?.response?.status === 429) return "Bạn thao tác quá nhanh, vui lòng thử lại sau ít phút.";
  return error?.response?.data?.message || (error?.request && !error?.response ? "Không kết nối được máy chủ" : fallback);
}

export default axiosClient;
