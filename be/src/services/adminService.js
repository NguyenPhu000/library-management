import { Admin, User } from "../models";

let getAllAdmins = async () => {
  try {
    let admins = await Admin.findAll({
      include: [{ model: User, attributes: ["username"] }],
    });
    return admins;
  } catch (error) {
    throw new Error("Lỗi lấy dữ liệu admin: " + error.message);
  }
};

let syncAdminFromUsers = async () => {
  try {
    let users = await User.findAll({ where: { role: "admin" } });

    let existingAdmins = await Admin.findAll({ attributes: ["user_id"] });
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
      await Admin.bulkCreate(newAdmins);
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
    let admin = await Admin.findByPk(data.admin_id);
    if (!admin) throw new Error("Không tìm thấy Admin");

    let user = await User.findByPk(admin.user_id);
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

let deleteAdminById = async (admin_id) => {
  try {
    const admin = await Admin.findByPk(admin_id);
    if (!admin) throw new Error("Không tìm thấy Admin");

    await admin.destroy();
    return { message: "Xóa Admin thành công" };
  } catch (error) {
    throw new Error("Lỗi xóa admin: " + error.message);
  }
};
module.exports = {
  getAllAdmins,
  syncAdminFromUsers,
  updateAdmin,
  deleteAdminById,
};
