import db from "../models/index.js";

let getAllAdmins = async () => {
  try {
    let admins = await db.Admin.findAll({
      include: [{ model: db.User, attributes: ["username"] }],
    });
    return admins;
  } catch (error) {
    throw new Error("Lỗi lấy dữ liệu admin: " + error.message);
  }
};

let syncAdminFromUsers = async () => {
  try {
    const users = await db.User.findAll({ where: { role: "admin" } });

    const existingAdmins = await db.Admin.findAll({ attributes: ["user_id"] });
    const existingUserIds = existingAdmins.map((a) => a.user_id);

    const newAdmins = users
      .filter((u) => !existingUserIds.includes(u.user_id))
      .map((u) => ({
        user_id: u.user_id,
        department: "General",
        admin_type: "librarian", // mặc định
      }));

    if (newAdmins.length) await db.Admin.bulkCreate(newAdmins);

    return {
      success: true,
      message: `${newAdmins.length} admin được thêm thành công!`,
      data: newAdmins,
    };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi đồng bộ Admin từ Users: " + error.message,
    };
  }
};
let updateAdmin = async (data) => {
  try {
    let admin = await db.Admin.findByPk(data.admin_id);
    if (!admin) throw new Error("Không tìm thấy Admin");

    let user = await db.User.findByPk(admin.user_id);
    if (!user || user.role !== "admin")
      throw new Error("User này không phải Admin");

    // Nếu thay đổi admin_type, đảm bảo còn ít nhất 1 super admin
    if (
      data.admin_type &&
      data.admin_type !== admin.admin_type &&
      admin.admin_type === "admin" &&
      data.admin_type === "librarian"
    ) {
      const countAdmin = await db.Admin.count({
        where: { admin_type: "admin" },
      });
      if (countAdmin <= 1) {
        throw new Error("Hệ thống phải có ít nhất 1 Super Admin!");
      }
    }

    await admin.update({
      department: data.department || admin.department,
      admin_type: data.admin_type || admin.admin_type,
    });

    return { message: "Cập nhật Admin thành công!" };
  } catch (error) {
    throw new Error("Lỗi update admin: " + error.message);
  }
};

let getAdminById = async (admin_id) => {
  try {
    const admin = await db.Admin.findByPk(admin_id, {
      include: [
        {
          model: db.User,
          attributes: ["username", "email", "first_name", "last_name"],
        },
      ],
    });
    return admin;
  } catch (error) {
    throw new Error("Lỗi lấy thông tin admin: " + error.message);
  }
};

let getAdminCount = async () => {
  try {
    return await db.Admin.count();
  } catch (error) {
    throw new Error("Lỗi đếm số admin: " + error.message);
  }
};

let getRecentAdmins = async (limit = 5) => {
  try {
    return await db.Admin.findAll({
      include: [
        { model: db.User, attributes: ["username", "first_name", "last_name"] },
      ],
      order: [["created_at", "DESC"]],
      limit: limit,
    });
  } catch (error) {
    throw new Error("Lỗi lấy admin gần đây: " + error.message);
  }
};

let getAllAdminsWithPagination = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    const { count, rows } = await db.Admin.findAndCountAll({
      include: [
        {
          model: db.User,
          attributes: ["username", "email", "first_name", "last_name"],
        },
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [["created_at", "DESC"]],
    });

    return {
      admins: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    };
  } catch (error) {
    throw new Error("Lỗi lấy danh sách admin với pagination: " + error.message);
  }
};

let deleteAdminById = async (admin_id) => {
  try {
    const admin = await db.Admin.findByPk(admin_id);
    if (!admin) throw new Error("Không tìm thấy Admin");

    await admin.destroy();
    return { message: "Xóa Admin thành công" };
  } catch (error) {
    throw new Error("Lỗi xóa admin: " + error.message);
  }
};

export default {
  getAllAdmins,
  getAdminById,
  getAdminCount,
  getRecentAdmins,
  getAllAdminsWithPagination,
  syncAdminFromUsers,
  updateAdmin,
  deleteAdminById,
};
