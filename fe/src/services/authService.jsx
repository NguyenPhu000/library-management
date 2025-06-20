import API, { PublicAPI } from "./api";

// Hàm lấy thông tin người dùng hiện tại dựa trên token
const getCurrentUser = async () => {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem("auth_token");
    if (!token) {
      return null;
    }

    // Gọi API để lấy thông tin người dùng từ token
    const response = await API.get("/me");

    if (response.data && response.data.user) {
      return response.data.user;
    }

    return null;
  } catch (error) {
    console.error("Get current user error:", error);
    // Xóa token nếu không hợp lệ
    localStorage.removeItem("auth_token");
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
      // Lưu token vào localStorage
      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
        console.log("Token saved:", response.data.token);
      } else {
        console.warn("No token received in login response");
      }

      // Đảm bảo response.data có chứa thông tin user
      if (!response.data.user && response.data.token) {
        try {
          // Lấy thông tin user từ token nếu response không chứa
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
const register = async (username, password, email, fullName) => {
  try {
    // Sử dụng PublicAPI vì đây là request trước khi có token
    const response = await PublicAPI.post("/register", {
      username,
      password,
      email,
      fullName,
    });

    if (response.data.success) {
      // Tự động đăng nhập sau khi đăng ký thành công nếu có token
      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
        console.log("Token saved after registration:", response.data.token);

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

// Hàm đăng xuất
const logout = async () => {
  try {
    // Gọi API logout ở server để hủy session nếu cần
    await API.get("/logout");
    console.log("Logout successful");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Luôn xóa token khỏi localStorage kể cả khi API lỗi
    localStorage.removeItem("auth_token");
  }
};

export default { getCurrentUser, login, register, logout };
