import { createContext, useContext, useEffect, useState } from "react";
import { fetchUserById, updateMemberProfile } from "../services/userService";
import { useAuth } from "./AuthContext";

const UserContext = createContext();

// Cung cấp thông tin người dùng và các hàm liên quan
export const UserProvider = ({ children }) => {
  const { currentUser } = useAuth();
  // Backend /me trả về user.id không phải user.user_id
  const userId = currentUser ? currentUser.id : null;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setUserData(null);
        setError(null);
        return;
      }

      // Avoid refetching too frequently
      const now = Date.now();
      if (lastFetch && now - lastFetch < 30000) {
        // 30 seconds cache
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchUserById(userId);
        setUserData(data);
        setLastFetch(now);
      } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin người dùng:", error);

        // More specific error messages
        let errorMessage = "Không thể lấy thông tin người dùng";
        if (error.response?.status === 404) {
          errorMessage = "Không tìm thấy thông tin người dùng";
        } else if (error.response?.status === 403) {
          errorMessage = "Không có quyền truy cập thông tin này";
        } else if (error.response?.status >= 500) {
          errorMessage = "Lỗi server, vui lòng thử lại sau";
        } else if (!navigator.onLine) {
          errorMessage = "Không có kết nối internet";
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, lastFetch]);

  const updateUser = async (data) => {
    if (!userId) {
      throw new Error("Không có ID người dùng để cập nhật");
    }

    setLoading(true);
    setError(null);

    try {
      const updatedUser = await updateMemberProfile(userId, data);
      setUserData(updatedUser);
      setLastFetch(Date.now()); // Reset cache
      return updatedUser;
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật thông tin người dùng:", error);

      // More specific error messages for updates
      let errorMessage = "Không thể cập nhật thông tin người dùng";
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || "Dữ liệu không hợp lệ";
      } else if (error.response?.status === 409) {
        errorMessage = "Email hoặc tên đăng nhập đã tồn tại";
      } else if (error.response?.status === 403) {
        errorMessage = "Không có quyền cập nhật thông tin này";
      } else if (error.response?.status >= 500) {
        errorMessage = "Lỗi server, vui lòng thử lại sau";
      } else if (!navigator.onLine) {
        errorMessage = "Không có kết nối internet";
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    setLastFetch(null); // Force refetch
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        loading,
        error,
        updateUser,
        refreshUserData,
        clearError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser phải được sử dụng trong UserProvider");
  }
  return context;
};
