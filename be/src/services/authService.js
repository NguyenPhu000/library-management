import bcrypt from "bcryptjs";
import { User } from "../models";
import userService from "./userService";

// Hàm đăng nhập
const login = async (username, password) => {
  try {
    const user = await User.findOne({
      where: {
        username,
        is_active: true,
      },
      attributes: { exclude: ["password"] }, // Loại bỏ password khỏi kết quả trả về
    });

    if (!user) {
      return {
        success: false,
        message: "Tài khoản không tồn tại hoặc đã bị khóa!",
      };
    }

    // Lấy lại user có password để kiểm tra
    const userWithPassword = await User.findOne({
      where: { username, is_active: true },
    });

    const isMatch = await bcrypt.compare(password, userWithPassword.password);
    if (!isMatch) {
      return {
        success: false,
        message: "Mật khẩu không chính xác!",
      };
    }

    // Tạo đối tượng user trả về không chứa password
    const userObj = {
      id: user.user_id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      role: user.role || "member",
      isActive: user.is_active,
    };

    return { success: true, user: userObj };
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return { success: false, message: "Lỗi hệ thống!" };
  }
};

// Hàm đăng xuất
const logout = async (req) => {
  return new Promise((resolve) => {
    if (req.session) {
      req.session.destroy(() => {
        resolve({ success: true, message: "Đăng xuất thành công!" });
      });
    } else {
      resolve({ success: true, message: "Đăng xuất thành công!" });
    }
  });
};

// Hàm đăng ký
const register = async (data) => {
  try {
    const existingUser = await User.findOne({
      where: { username: data.username },
    });
    if (existingUser) {
      return { success: false, message: "Tên đăng nhập đã tồn tại!" };
    }

    const newUser = await userService.createNewUser(data);

    // Trả về user mới tạo nhưng không có password
    const userObj = {
      id: newUser.user_id,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.full_name,
      role: newUser.role || "member",
      isActive: newUser.is_active,
    };

    return { success: true, message: "Đăng ký thành công!", user: userObj };
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return { success: false, message: "Lỗi hệ thống!" };
  }
};

// Hàm lấy thông tin người dùng theo ID (cho JWT)
const getUserById = async (userId) => {
  try {
    const user = await User.findOne({
      where: {
        user_id: userId,
        is_active: true,
      },
      attributes: { exclude: ["password"] }, // Loại bỏ password
    });

    if (!user) {
      return null;
    }

    // Trả về đối tượng user với tên trường chuẩn hóa
    return {
      id: user.user_id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      role: user.role || "member",
      isActive: user.is_active,
    };
  } catch (error) {
    console.error("Lỗi lấy thông tin user:", error);
    return null;
  }
};

// Hàm lấy thông tin người dùng hiện tại từ session (cho backward compatibility)
const getCurrentUser = async (req) => {
  if (!req.session?.user) {
    return { success: false, message: "Chưa đăng nhập" };
  }

  const user = await User.findOne({
    where: {
      user_id: req.session.user.user_id,
      is_active: true,
    },
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    return {
      success: false,
      message: "Tài khoản không tồn tại hoặc đã bị khóa",
    };
  }

  return { success: true, user: req.session.user };
};

export default { login, logout, getCurrentUser, register, getUserById };
