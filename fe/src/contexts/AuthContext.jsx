import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kiểm tra xác thực khi component mount
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        // Lấy thông tin người dùng từ httpOnly cookie
        const userData = await authService.getCurrentUser();
        if (userData) {
          setCurrentUser(userData);
          setError(null);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setError(error.message);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const userData = await authService.getCurrentUser();
      if (userData) {
        setCurrentUser(userData);
        setError(null);
        return userData;
      }
      return null;
    } catch (error) {
      console.error("Check auth error:", error);
      setError(error.message);
      setCurrentUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    try {
      const result = await authService.login(username, password);

      if (result.success && result.user) {
        setCurrentUser(result.user);
        setError(null);

        // Trả về thông tin người dùng để component xử lý chuyển hướng
        return {
          success: true,
          user: result.user,
          redirectUrl: result.redirectUrl || "/",
        };
      }

      return {
        success: false,
        message: result.message || "Đăng nhập thất bại",
      };
    } catch (error) {
      console.error("Login error in context:", error);
      setError(error.message);
      return {
        success: false,
        message: error.message || "Đã xảy ra lỗi khi đăng nhập",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, password, email, fullName) => {
    setLoading(true);
    try {
      const result = await authService.register(
        username,
        password,
        email,
        fullName
      );
      if (result.success) {
        // Cập nhật currentUser nếu API trả về thông tin người dùng
        if (result.user) {
          setCurrentUser(result.user);
        }
        setError(null);
        return { success: true, redirectUrl: result.redirectUrl || "/" };
      }
      return { success: false, message: result.message };
    } catch (error) {
      console.error("Register error:", error);
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log("AuthContext: Starting logout...");
    setLoading(true);

    try {
      // 1. Call logout service để clear server-side data
      const result = await authService.logout();
      console.log("AuthContext: Service logout result:", result);

      // 2. Reset tất cả state ngay lập tức
      setCurrentUser(null);
      setError(null);
      console.log("AuthContext: State cleared");

      // 3. Force reload page để đảm bảo clear tất cả cached data
      setTimeout(() => {
        console.log("AuthContext: Reloading page to ensure clean state");
        window.location.reload();
      }, 100);

      return { success: true };
    } catch (error) {
      console.error("AuthContext: Logout error:", error);

      // Dù có lỗi vẫn reset state
      setCurrentUser(null);
      setError(null);

      // Force reload để đảm bảo clean state
      setTimeout(() => {
        window.location.reload();
      }, 100);

      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = () => {
    return currentUser && currentUser.role === "admin";
  };

  // Giá trị được chia sẻ cho context
  const authValue = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    isAdmin,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
