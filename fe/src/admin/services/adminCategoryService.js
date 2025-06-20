import api from "../../services/api";

class AdminCategoryService {
  getAllCategories() {
    return api.get("/api/admin/categories");
  }

  getCategoryById(id) {
    return api.get(`/api/admin/categories/${id}`);
  }

  createCategory(data) {
    return api.post("/api/admin/categories", data);
  }

  updateCategory(id, data) {
    return api.put(`/api/admin/categories/${id}`, data);
  }

  deleteCategory(id) {
    return api.delete(`/api/admin/categories/${id}`);
  }
}

const adminCategoryService = new AdminCategoryService();
export default adminCategoryService;
