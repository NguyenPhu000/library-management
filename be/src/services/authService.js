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
    });

    if (!user) {
      return {
        success: false,
        message: "Tài khoản không tồn tại hoặc đã bị khóa!",
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        success: false,
        message: "Mật khẩu không chính xác!",
      };
    }

    return { success: true, user };
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return { success: false, message: "Lỗi hệ thống!" };
  }
};

// Hàm đăng xuất
const logout = async (req) => {
  return new Promise((resolve) => {
    req.session.destroy(() => {
      resolve({ success: true, message: "Đăng xuất thành công!" });
    });
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

    await userService.createNewUser(data);

    return { success: true, message: "Đăng ký thành công!" };
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return { success: false, message: "Lỗi hệ thống!" };
  }
};

// Hàm lấy thông tin người dùng hiện tại
const getCurrentUser = async (req) => {
  if (!req.session?.user) {
    return { success: false, message: "Chưa đăng nhập" };
  }

  const user = await User.findOne({
    where: {
      user_id: req.session.user.user_id,
      is_active: true,
    },
  });

  if (!user) {
    return {
      success: false,
      message: "Tài khoản không tồn tại hoặc đã bị khóa",
    };
  }

  return { success: true, user: req.session.user };
};

export default { login, logout, getCurrentUser, register };
