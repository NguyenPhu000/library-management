import adminService from "../services/adminService.js";

//  Hiển thị danh sách admin (Admin: Render | React: JSON)
const getDisplayAdmin = async (req, res) => {
  try {
    let data = await adminService.getAllAdmins();

    if (req.headers.accept?.includes("application/json")) {
      return res.json(data);
    }

    res.render("adminPage", { dataTable: data });
  } catch (error) {
    res.status(500).json({ lỗi: error.message });
  }
};

//  Cập nhật admin (Admin: Render | React: JSON)
const updateAdmin = async (req, res) => {
  try {
    await adminService.updateAdmin(req.body);
    let updatedData = await adminService.getAllAdmins();

    if (req.headers.accept?.includes("application/json")) {
      return res.json({ message: "Cập nhật admin thành công!" });
    }

    res.render("adminPage", { dataTable: updatedData });
  } catch (error) {
    res.status(500).json({ lỗi: error.message });
  }
};

// Xóa admin (Admin: Render | React: JSON)
const deleteAdmin = async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(400).json({ lỗi: "Thiếu ID admin" });
    }

    await adminService.deleteAdminById(req.query.id);
    const data = await adminService.getAllAdmins();

    if (req.headers.accept?.includes("application/json")) {
      return res.json({ message: "Xóa admin thành công!" });
    }

    res.render("adminPage", { dataTable: data });
  } catch (error) {
    res.status(500).json({ lỗi: error.message });
  }
};

// Đồng bộ admin từ Users (Admin: Render | React: JSON)
const syncAdmin = async (req, res) => {
  try {
    await adminService.syncAdminFromUsers();
    let data = await adminService.getAllAdmins();

    if (req.headers.accept?.includes("application/json")) {
      return res.json({ message: "Đồng bộ admin thành công!" });
    }

    res.render("adminPage", { dataTable: data });
  } catch (error) {
    res.status(500).json({ lỗi: "Lỗi server: " + error.message });
  }
};

export default {
  getDisplayAdmin,
  updateAdmin,
  deleteAdmin,
  syncAdmin,
};
