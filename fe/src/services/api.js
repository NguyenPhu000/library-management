import axios from "axios";

// Cấu hình chung cho tất cả các instance
const baseConfig = {
  timeout: 15000, // Timeout 15s cho tất cả các request
};

// API instance với xác thực (dùng cho các tính năng yêu cầu đăng nhập)
const API = axios.create({
  baseURL: "/api",
  withCredentials: true,
  ...baseConfig,
});

// API instance không yêu cầu xác thực (dùng cho các trang công khai)
const PublicAPI = axios.create({
  baseURL: "/api",
  withCredentials: false,
  ...baseConfig,
});

// API instance cho trang quản trị
const AdminAPI = axios.create({
  baseURL: "/api/admin",
  withCredentials: true,
  ...baseConfig,
});

console.log("AdminAPI configured with baseURL:", "/api/admin");

// Thêm token Authorization vào header nếu có
const addAuthToken = (config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Added auth token to request");
  }
  return config;
};

// Áp dụng interceptor cho tất cả API instances
API.interceptors.request.use(addAuthToken);
AdminAPI.interceptors.request.use(addAuthToken);

// Xử lý response thành công
const handleResponse = (response) => {
  // Nếu response chứa token, lưu vào localStorage
  if (response.data && response.data.token) {
    localStorage.setItem("auth_token", response.data.token);
    console.log("Token saved from response");
  }
  return response;
};

// Xử lý lỗi chung
const handleError = (error) => {
  console.error("API Error details:", {
    message: error.message,
    status: error.response?.status,
    statusText: error.response?.statusText,
    url: error.config?.url,
    method: error.config?.method,
    data: error.response?.data,
  });

  // Xử lý lỗi xác thực
  if (error?.response?.status === 401) {
    console.log("Authentication error (401), clearing token");

    // Xóa token không hợp lệ
    localStorage.removeItem("auth_token");

    // Lấy đường dẫn hiện tại
    const currentPath = window.location.pathname;

    // Chuyển hướng đến trang đăng nhập phù hợp
    if (currentPath.startsWith("/admin")) {
      console.log("Redirecting to admin login");
      window.location.href = "/login?admin=true";
    } else if (!currentPath.includes("/login")) {
      console.log("Redirecting to user login");
      window.location.href = "/login";
    }
  }

  return Promise.reject(error);
};

// Áp dụng xử lý response cho tất cả API instances
API.interceptors.response.use(handleResponse, handleError);
PublicAPI.interceptors.response.use(handleResponse, handleError);
AdminAPI.interceptors.response.use(handleResponse, handleError);

// Kiểm tra auth token
console.log("Auth token:", localStorage.getItem("auth_token"));

// Kiểm tra current user
console.log("Current path:", window.location.pathname);

export { API, PublicAPI, AdminAPI };
export default API;
