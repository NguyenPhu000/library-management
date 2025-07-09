import api from "../../services/api";

const AdminService = {
  getAllAdmins: async () => {
    const response = await api.get("/admin/admins");
    return response.data;
  },

  updateAdminType: async (id, newType) => {
    const response = await api.post("/admin/admins", {
      admin_id: id,
      admin_type: newType,
    });
    return response.data;
  },
};

export default AdminService;
