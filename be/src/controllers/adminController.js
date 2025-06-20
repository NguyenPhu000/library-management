import adminService from "../services/adminService.js";

// Lấy thống kê dành cho trang dashboard admin
const getAdminStats = async (req, res) => {
  try {
    // Lấy tất cả thông tin thống kê cần thiết
    const adminCount = await adminService.getAdminCount();
    const recentAdmins = await adminService.getRecentAdmins();

    return res.status(200).json({
      success: true,
      data: {
        adminCount,
        recentAdmins,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi lấy thống kê admin: " + error.message,
    });
  }
};

// Lấy danh sách admin
const getAllAdmins = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const data = await adminService.getAllAdminsWithPagination(page, limit);

    return res.status(200).json({
      success: true,
      data: data.admins,
      totalPages: data.totalPages,
      currentPage: page,
      totalItems: data.totalItems,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi lấy danh sách admin: " + error.message,
    });
  }
};

// Lấy thông tin chi tiết một admin
const getAdminById = async (req, res) => {
  try {
    const adminId = req.params.id;
    const admin = await adminService.getAdminById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy admin",
      });
    }

    return res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi lấy thông tin admin: " + error.message,
    });
  }
};

// Cập nhật admin
const updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await adminService.updateAdmin(req.body);

    return res.status(200).json({
      success: true,
      message: "Cập nhật admin thành công",
      data: updatedAdmin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi cập nhật admin: " + error.message,
    });
  }
};

// Xóa admin
const deleteAdmin = async (req, res) => {
  try {
    const adminId = req.params.id || req.body.id;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu ID admin",
      });
    }

    await adminService.deleteAdminById(adminId);

    return res.status(200).json({
      success: true,
      message: "Xóa admin thành công",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi xóa admin: " + error.message,
    });
  }
};

// Đồng bộ admin từ Users
const syncAdmin = async (req, res) => {
  try {
    const syncResult = await adminService.syncAdminFromUsers();

    if (!syncResult.success) {
      return res.status(400).json({
        success: false,
        message: syncResult.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Đồng bộ admin thành công",
      data: syncResult.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi đồng bộ admin: " + error.message,
    });
  }
};

export default {
  getAdminStats,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  syncAdmin,
};
