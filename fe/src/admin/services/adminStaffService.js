import { AdminAPI } from "../../services/api";

const adminStaffService = {
  // Lấy danh sách admin với phân trang
  getAllAdmins: async (page = 1, limit = 10) => {
    try {
      const response = await AdminAPI.get("/admins", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching admins:", error);
      throw error;
    }
  },

  // Cập nhật thông tin admin
  updateAdmin: async (adminId, adminData) => {
    try {
      const response = await AdminAPI.post("/admins", {
        admin_id: adminId,
        ...adminData,
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating admin ${adminId}:`, error);
      throw error;
    }
  },

  // Xóa admin
  deleteAdmin: async (adminId) => {
    try {
      const response = await AdminAPI.delete(`/admins/${adminId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting admin ${adminId}:`, error);
      throw error;
    }
  },

  // Đồng bộ admin từ Users
  syncAdmins: async () => {
    try {
      const response = await AdminAPI.post("/admins/sync");
      return response.data;
    } catch (error) {
      console.error("Error syncing admins:", error);
      throw error;
    }
  },
};

export default adminStaffService;
