import adminService from "../services/adminService.js";

//  Hiển thị danh sách admin
const getDisplayAdmin = async (req, res) => {
  try {
    await adminService.syncAdminFromUsers();
    let data = await adminService.getAllAdmins();
    res.render("adminPage", {
      dataTable: data,
      successMessage: req.query.successMessage || null,
      errorMessage: req.query.errorMessage || null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Có lỗi xảy ra khi lấy danh sách admin: " + error.message,
    });
  }
};

//  Cập nhật admin
const updateAdmin = async (req, res) => {
  try {
    await adminService.updateAdmin(req.body);
    let updatedData = await adminService.getAllAdmins();

    res.redirect("/api/admin?successMessage=Cập nhật admin thành công!");
  } catch (error) {
    res.redirect(
      `/api/admin?errorMessage=Có lỗi xảy ra khi cập nhật admin: ${encodeURIComponent(
        error.message
      )}`
    );
  }
};

// Xóa admin
const deleteAdmin = async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(400).json({ message: "Thiếu ID admin" });
    }
    await adminService.deleteAdminById(req.query.id);
    const data = await adminService.getAllAdmins();

    res.redirect("/api/admin?successMessage=Xóa admin thành công!");
  } catch (error) {
    res.redirect(
      `/api/admin?errorMessage=Có lỗi xảy ra khi xóa admin: ${encodeURIComponent(
        error.message
      )}`
    );
  }
};

// Đồng bộ admin từ Users
const syncAdmin = async (req, res) => {
  try {
    const syncResult = await adminService.syncAdminFromUsers();

    if (!syncResult.success) {
      return res.status(400).json({ message: syncResult.message });
    }

    res.redirect("/api/admin?successMessage=Đồng bộ admin thành công!");
  } catch (error) {
    res.redirect(
      `/api/admin?errorMessage=Có lỗi xảy ra khi đồng bộ admin: ${encodeURIComponent(
        error.message
      )}`
    );
  }
};

export default {
  getDisplayAdmin,
  updateAdmin,
  deleteAdmin,
  syncAdmin,
};
