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
    let users = await db.User.findAll({ where: { role: "admin" } });

    let existingAdmins = await db.Admin.findAll({ attributes: ["user_id"] });
    let existingUserIds = existingAdmins.map((admin) => admin.user_id);

    let newAdmins = users
      .filter((user) => !existingUserIds.includes(user.user_id))
      .map((user) => ({
        user_id: user.user_id,
        access_level: 1,
        department: "General",
        can_manage_users: true,
        can_manage_books: true,
      }));

    if (newAdmins.length > 0) {
      await db.Admin.bulkCreate(newAdmins);
    }

    return {
      success: true,
      message: `${newAdmins.length} Admins được thêm thành công!`,
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

    await admin.update({
      access_level: data.access_level,
      department: data.department,
      can_manage_users: data.can_manage_users === "on",
      can_manage_books: data.can_manage_books === "on",
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
