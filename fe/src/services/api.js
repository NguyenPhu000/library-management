import axios from "axios";

// Cấu hình chung cho tất cả các instance
const baseConfig = {
  timeout: 15000, // Timeout 15s cho tất cả các request
};

// Determine base URL based on environment
const getBaseURL = () => {
  // In production, use relative URLs (same domain)
  if (process.env.NODE_ENV === "production") {
    return "/api";
  }

  // In development, use the backend server URL
  return "http://localhost:8081/api";
};

const baseURL = getBaseURL();

// API instance với xác thực (dùng cho các tính năng yêu cầu đăng nhập)
const API = axios.create({
  baseURL,
  withCredentials: true, // Quan trọng: cho phép gửi cookies
  ...baseConfig,
});

// API instance không yêu cầu xác thực (dùng cho các trang công khai)
const PublicAPI = axios.create({
  baseURL,
  withCredentials: true, // Vẫn cần cookies cho consistency
  ...baseConfig,
});

// API instance cho trang quản trị
const AdminAPI = axios.create({
  baseURL: `${baseURL}/admin`,
  withCredentials: true, // Quan trọng: cho phép gửi cookies
  ...baseConfig,
});

console.log("API configured with httpOnly cookies");
console.log("Base URL:", baseURL);
console.log("Admin API URL:", `${baseURL}/admin`);

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
  // Nếu response chứa token, lưu vào localStorage như backup
  if (response.data && response.data.token) {
    localStorage.setItem("auth_token", response.data.token);
    console.log("Token saved to localStorage as backup");
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
    console.log("Authentication error (401), clearing token and redirecting");

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

// Kiểm tra current user
console.log("Current path:", window.location.pathname);

export { API, PublicAPI, AdminAPI };
export default API;
