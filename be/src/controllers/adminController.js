import adminService from "../services/adminService.js";

//  Hiển thị danh sách admin
const getDisplayAdmin = async (req, res) => {
  try {
    let data = await adminService.getAllAdmins();

    res.render("adminPage", { dataTable: data });
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

    res.render("adminPage", { dataTable: updatedData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Có lỗi xảy ra khi cập nhật admin: " + error.message });
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

    res.render("adminPage", { dataTable: data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Có lỗi xảy ra khi xóa admin: " + error.message });
  }
};

// Đồng bộ admin từ Users
const syncAdmin = async (req, res) => {
  try {
    await adminService.syncAdminFromUsers();
    let data = await adminService.getAllAdmins();

    res.render("adminPage", { dataTable: data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Có lỗi xảy ra khi đồng bộ admin: " + error.message });
  }
};

export default {
  getDisplayAdmin,
  updateAdmin,
  deleteAdmin,
  syncAdmin,
};
