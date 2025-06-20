import { AdminAPI } from "../../services/api";

const adminUserService = {
  // Lấy danh sách người dùng với phân trang
  getAllUsers: async (page = 1, limit = 10) => {
    try {
      const response = await AdminAPI.get("/users", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users for admin:", error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết của một người dùng
  getUserById: async (userId) => {
    try {
      const response = await AdminAPI.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${userId} for admin:`, error);
      throw error;
    }
  },

  // Tạo người dùng mới
  createUser: async (userData) => {
    try {
      const response = await AdminAPI.post("/users/create", userData);
      return response.data;
    } catch (error) {
      console.error("Error creating user for admin:", error);
      throw error;
    }
  },

  // Cập nhật thông tin người dùng
  updateUser: async (userId, userData) => {
    try {
      const response = await AdminAPI.post("/users/update", {
        ...userData,
        id: userId,
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${userId} for admin:`, error);
      throw error;
    }
  },

  // Xóa người dùng
  deleteUser: async (userId) => {
    try {
      const response = await AdminAPI.post("/users/delete", { id: userId });
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${userId} for admin:`, error);
      throw error;
    }
  },

  // Tìm kiếm người dùng
  searchUsers: async (query, page = 1, limit = 10) => {
    try {
      const response = await AdminAPI.get("/users/search", {
        params: { q: query, page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching users for admin:", error);
      throw error;
    }
  },

  // Lấy thống kê về người dùng
  getUserStats: async () => {
    try {
      const response = await AdminAPI.get("/users/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching user stats for admin:", error);
      throw error;
    }
  },

  // Bật/tắt trạng thái hoạt động của người dùng
  toggleUserActive: async (userId) => {
    try {
      const response = await AdminAPI.post("/users/toggle-active", {
        id: userId,
      });
      return response.data;
    } catch (error) {
      console.error(`Error toggling active status for user ${userId}:`, error);
      throw error;
    }
  },

  // Đồng bộ dữ liệu người dùng
  syncUsers: async () => {
    try {
      const response = await AdminAPI.post("/users/sync");
      return response.data;
    } catch (error) {
      console.error("Error syncing users:", error);
      throw error;
    }
  },
};

export default adminUserService;
