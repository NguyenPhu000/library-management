import bcrypt from "bcryptjs";
import db from "../models/index.js";
import { Op } from "sequelize";
const salt = bcrypt.genSaltSync(10);

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePhone = (phone) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(phone);
};

const validateName = (name) => {
  const regex = /^[a-zA-Z\s]+$/;
  return regex.test(name);
};

// Hàm tạo người dùng mới
let createNewUser = async (data) => {
  try {
    if (!data.username || data.username.length <= 6) {
      throw new Error("Tên người dùng phải lớn hơn 6 ký tự");
    }
    if (!data.password || data.password.length <= 6) {
      throw new Error("Mật khẩu phải lớn hơn 6 ký tự");
    }
    if (!data.first_name || !validateName(data.first_name)) {
      throw new Error("Tên không hợp lệ. Tên chỉ được chứa chữ cái.");
    }
    if (!data.last_name || !validateName(data.last_name)) {
      throw new Error("Họ không hợp lệ. Họ chỉ được chứa chữ cái.");
    }
    if (!data.email || !validateEmail(data.email)) {
      throw new Error("Email không hợp lệ");
    }
    if (!data.phone || !validatePhone(data.phone)) {
      throw new Error("Số điện thoại không hợp lệ. Phải là số và đúng 10 số.");
    }

    // Kiểm tra username đã tồn tại chưa
    const userByUsername = await db.User.findOne({
      where: { username: data.username },
    });
    if (userByUsername) {
      throw new Error("Tên người dùng đã tồn tại");
    }

    // Kiểm tra email đã tồn tại chưa
    const userByEmail = await db.User.findOne({
      where: { email: data.email },
    });
    if (userByEmail) {
      throw new Error("Email đã tồn tại");
    }

    let hashPasswordFromBcrypt = await bcrypt.hash(data.password, salt);

    await db.User.create({
      username: data.username,
      password: hashPasswordFromBcrypt,
      first_name: data.first_name,
      last_name: data.last_name,
      gender: data.gender === "1",
      role: data.role || "member",
      email: data.email,
      phone: data.phone,
      address: data.address,
    });
  } catch (error) {
    throw new Error("Lỗi khi tạo người dùng: " + error.message);
  }
};

// Hàm lấy tất cả người dùng
let getAllUser = async () => {
  try {
    return await db.User.findAll({ raw: true });
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách người dùng: " + error.message);
  }
};

// Hàm lấy thông tin người dùng theo ID
let getUserInfoById = async (userId) => {
  try {
    const user = await db.User.findOne({
      where: { user_id: userId },
      raw: true,
    });
    return user || {};
  } catch (error) {
    throw new Error("Lỗi khi lấy thông tin người dùng: " + error.message);
  }
};

// Hàm cập nhật dữ liệu người dùng
let updateUserData = async (data) => {
  try {
    if (!data.username || data.username.length <= 6) {
      throw new Error("Tên người dùng phải lớn hơn 6 ký tự");
    }
    if (!data.first_name || !validateName(data.first_name)) {
      throw new Error("Tên không hợp lệ. Tên chỉ được chứa chữ cái.");
    }
    if (!data.last_name || !validateName(data.last_name)) {
      throw new Error("Họ không hợp lệ. Họ chỉ được chứa chữ cái.");
    }
    if (!data.email || !validateEmail(data.email)) {
      throw new Error("Email không hợp lệ");
    }
    if (!data.phone || !validatePhone(data.phone)) {
      throw new Error("Số điện thoại không hợp lệ. Phải là số và đúng 10 số.");
    }

    const user = await db.User.findOne({ where: { user_id: data.user_id } });
    if (!user) throw new Error("Không tìm thấy người dùng");

    await db.User.update(
      {
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data.gender === "1",
        role: data.role,
        email: data.email,
        phone: data.phone,
        address: data.address,
      },
      { where: { user_id: data.user_id } }
    );
  } catch (error) {
    throw new Error("Lỗi khi cập nhật người dùng: " + error.message);
  }
};

// Hàm xóa người dùng theo ID
let deleteUserById = async (id) => {
  try {
    console.log("📥 Nhận yêu cầu xóa user với ID:", id);
    const user = await db.User.findOne({ where: { user_id: id } });
    if (!user) throw new Error("Không tìm thấy người dùng");

    await user.destroy();
  } catch (error) {
    throw new Error("Lỗi khi xóa người dùng: " + error.message);
  }
};

// Hàm chuyển đổi trạng thái người dùng
let toggleActive = async (id) => {
  try {
    const user = await db.User.findByPk(id);
    if (!user) throw new Error("Không tìm thấy người dùng");

    // đảo trạng thái
    user.is_active = !user.is_active;
    await user.save();

    return user.is_active;
  } catch (error) {
    throw new Error(
      "Lỗi khi chuyển đổi trạng thái người dùng: " + error.message
    );
  }
};

// Hàm tìm kiếm người dùng
let searchUser = async (filters) => {
  try {
    let whereClause = {};

    if (filters.criteria && filters.query) {
      whereClause[filters.criteria] = { [Op.like]: `%${filters.query}%` };
    }

    let users = await db.User.findAll({ where: whereClause, raw: true });
    return users;
  } catch (error) {
    throw new Error("Lỗi khi tìm kiếm người dùng: " + error.message);
  }
};

// Hàm cập nhật hồ sơ người dùng
let updateUserProfile = async (userId, data) => {
  try {
    if (!data.username || data.username.length <= 6) {
      throw new Error("Tên người dùng phải lớn hơn 6 ký tự");
    }
    if (!data.first_name || !validateName(data.first_name)) {
      throw new Error("Tên không hợp lệ. Tên chỉ được chứa chữ cái.");
    }
    if (!data.last_name || !validateName(data.last_name)) {
      throw new Error("Họ không hợp lệ. Họ chỉ được chứa chữ cái.");
    }
    if (!data.email || !validateEmail(data.email)) {
      throw new Error("Email không hợp lệ");
    }
    if (!data.phone || !validatePhone(data.phone)) {
      throw new Error("Số điện thoại không hợp lệ. Phải là số và đúng 10 số.");
    }

    const user = await db.User.findOne({ where: { user_id: userId } });
    if (!user) throw new Error("Không tìm thấy người dùng");

    // Kiểm tra username đã tồn tại chưa và không phải của user hiện tại
    const userByUsername = await db.User.findOne({
      where: {
        username: data.username,
        user_id: { [Op.not]: userId },
      },
    });
    if (userByUsername) {
      throw new Error("Tên người dùng đã tồn tại");
    }

    // Kiểm tra email đã tồn tại chưa và không phải của user hiện tại
    const userByEmail = await db.User.findOne({
      where: {
        email: data.email,
        user_id: { [Op.not]: userId },
      },
    });
    if (userByEmail) {
      throw new Error("Email đã tồn tại");
    }

    const updates = {
      username: data.username,
      first_name: data.first_name,
      last_name: data.last_name,
      gender: data.gender === "1",
      email: data.email,
      phone: data.phone,
      address: data.address,
    };

    if (data.password) {
      if (!data.password || data.password.length <= 6) {
        throw new Error("Mật khẩu phải lớn hơn 6 ký tự");
      }
      const salt = bcrypt.genSaltSync(10);
      updates.password = bcrypt.hashSync(data.password, salt);
    }

    await db.User.update(updates, { where: { user_id: userId } });
  } catch (error) {
    throw new Error("Lỗi khi cập nhật hồ sơ người dùng: " + error.message);
  }
};

export default {
  createNewUser,
  getAllUser,
  getUserInfoById,
  updateUserData,
  deleteUserById,
  toggleActive,
  searchUser,
  updateUserProfile,
};
