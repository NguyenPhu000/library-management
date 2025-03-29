import { createContext, useContext, useEffect, useState } from "react";

import { fetchUserById, updateMemberProfile } from "../services/userService";
import { useAuth } from "./AuthContext";

const UserContext = createContext();

// Cung cấp thông tin người dùng và các hàm liên quan
export const UserProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user ? user.user_id : null;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      setLoading(true);
      setError(null);
      try {
        const data = await fetchUserById(userId);
        setUserData(data);
      } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin người dùng:", error);
        setError("Không thể lấy thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const updateUser = async (data) => {
    if (!userId) throw new Error("Không có ID người dùng để cập nhật");

    try {
      const updatedUser = await updateMemberProfile(userId, data);
      setUserData(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật thông tin người dùng:", error);
      throw new Error("Không thể cập nhật thông tin người dùng");
    }
  };

  return (
    <UserContext.Provider value={{ userData, loading, error, updateUser }}>
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
