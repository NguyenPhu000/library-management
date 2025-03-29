import API from "./api";

// Hàm lấy thông tin người dùng hiện tại
const getCurrentUser = async () => {
  try {
    const response = await API.get("/me");
    return response.data.user;
  } catch (error) {
    return null;
  }
};

// Hàm đăng nhập
const login = async (username, password) => {
  try {
    const response = await API.post("/login", { username, password });
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message);
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi đăng nhập");
  }
};

// Hàm đăng xuất
const logout = async () => {
  try {
    const response = await API.get("/logout");
    if (response.data.success) {
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Lỗi logout:", error);
  }
};

export default { getCurrentUser, login, logout };
