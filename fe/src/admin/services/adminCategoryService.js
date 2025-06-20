import { AdminAPI } from "../../services/api";

const adminCategoryService = {
  // Lấy danh sách tất cả danh mục
  getAllCategories: async () => {
    try {
      const response = await AdminAPI.get("/categories");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories for admin:", error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết của một danh mục
  getCategoryById: async (categoryId) => {
    try {
      const response = await AdminAPI.get(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${categoryId} for admin:`, error);
      throw error;
    }
  },

  // Tạo danh mục mới
  createCategory: async (categoryData) => {
    try {
      const response = await AdminAPI.post("/categories", categoryData);
      return response.data;
    } catch (error) {
      console.error("Error creating category for admin:", error);
      throw error;
    }
  },

  // Cập nhật thông tin danh mục
  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await AdminAPI.put(
        `/categories/${categoryId}`,
        categoryData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating category ${categoryId} for admin:`, error);
      throw error;
    }
  },

  // Xóa danh mục
  deleteCategory: async (categoryId) => {
    try {
      const response = await AdminAPI.delete(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting category ${categoryId} for admin:`, error);
      throw error;
    }
  },

  // Tìm kiếm danh mục
  searchCategories: async (query) => {
    try {
      const response = await AdminAPI.get("/categories/search", {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching categories for admin:", error);
      throw error;
    }
  },

  // Lấy thống kê về danh mục
  getCategoryStats: async () => {
    try {
      const response = await AdminAPI.get("/categories/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching category stats for admin:", error);
      throw error;
    }
  },
};

export default adminCategoryService;
