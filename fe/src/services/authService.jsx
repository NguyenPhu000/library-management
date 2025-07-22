import API, { PublicAPI } from "./api";

// Hàm lấy thông tin người dùng hiện tại dựa trên token (từ cookie)
const getCurrentUser = async () => {
  try {
    // Gọi API để lấy thông tin người dùng từ cookie token
    const response = await API.get("/me");

    if (response.data && response.data.user) {
      return response.data.user;
    }

    return null;
  } catch (error) {
    console.error("Get current user error:", error);
    // Nếu lỗi 401 Unauthorized, không throw lỗi mà trả về null
    if (error.response && error.response.status === 401) {
      return null;
    }
    throw new Error(
      error.response?.data?.message || "Không thể lấy thông tin người dùng"
    );
  }
};

// Hàm đăng nhập
const login = async (username, password) => {
  try {
    // Sử dụng PublicAPI vì đây là request trước khi có token
    const response = await PublicAPI.post("/login", { username, password });

    if (response.data.success) {
      console.log("Login successful, token saved in httpOnly cookie");

      // Đảm bảo response.data có chứa thông tin user
      if (!response.data.user && response.data.success) {
        try {
          // Lấy thông tin user từ cookie token nếu response không chứa
          const userResponse = await API.get("/me");
          if (userResponse.data && userResponse.data.user) {
            response.data.user = userResponse.data.user;
            console.log("User info fetched:", response.data.user);
          } else {
            console.warn("Could not fetch user info after login");
          }
        } catch (userError) {
          console.error("Error fetching user after login:", userError);
        }
      }

      return response.data;
    }
    throw new Error(response.data.message || "Đăng nhập không thành công");
  } catch (error) {
    console.error("Login error:", error);
    throw new Error(
      error.response?.data?.message || "Lỗi đăng nhập: " + error.message
    );
  }
};

// Hàm đăng ký
const register = async (data) => {
  try {
    // Sử dụng PublicAPI vì đây là request trước khi có token
    const response = await PublicAPI.post("/register", data);

    if (response.data.success) {
      console.log("Registration successful");

      // Lấy thông tin user từ token nếu response không chứa
      if (!response.data.user) {
        try {
          const userResponse = await API.get("/me");
          if (userResponse.data && userResponse.data.user) {
            response.data.user = userResponse.data.user;
            console.log(
              "User info fetched after registration:",
              response.data.user
            );
          }
        } catch (userError) {
          console.error("Error fetching user after registration:", userError);
        }
      }

      return response.data;
    }
    throw new Error(response.data.message || "Đăng ký không thành công");
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error(
      error.response?.data?.message || "Lỗi đăng ký tài khoản: " + error.message
    );
  }
};

// Hàm đăng xuất - cải thiện để đảm bảo clear tất cả
const logout = async () => {
  try {
    console.log("Starting logout process...");

    // 1. Gọi API logout ở server để xóa httpOnly cookie
    try {
      await API.get("/logout");
      console.log("Server logout successful");
    } catch (error) {
      console.warn(
        "Server logout failed, continuing with client cleanup:",
        error
      );
    }

    // 2. Xóa token backup trong localStorage (nếu có)
    localStorage.removeItem("auth_token");
    console.log("LocalStorage token cleared");

    // 3. Clear tất cả storage khác nếu có
    sessionStorage.clear();

    console.log("Logout process completed successfully");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);

    // Dù có lỗi, vẫn clear client-side data
    localStorage.removeItem("auth_token");
    sessionStorage.clear();

    return { success: false, message: error.message };
  }
};

export default { getCurrentUser, login, register, logout };
