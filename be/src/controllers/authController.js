import authService from "../services/authService.js";
import jwt from "jsonwebtoken";
import config from "../config/configJWT.js";

const showLogin = async (req, res) => {
  res.render("auth/login", { errorMessage: req.query.errorMessage || null });
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      const message = "Vui lòng nhập đầy đủ thông tin!";
      return req.headers.accept?.includes("application/json")
        ? res.status(400).json({ success: false, message })
        : res.redirect(
            `/api/login?errorMessage=${encodeURIComponent(message)}`
          );
    }

    const result = await authService.login(username, password);

    if (!result.success) {
      return req.headers.accept?.includes("application/json")
        ? res.status(401).json({ success: false, message: result.message })
        : res.redirect(
            `/api/login?errorMessage=${encodeURIComponent(result.message)}`
          );
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        id: result.user.id,
        username: result.user.username,
        role: result.user.role,
      },
      config.secret,
      { expiresIn: config.expiresIn }
    );

    // Lưu token vào cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    const redirectUrl = result.user.role === "admin" ? "/admin" : "/";

    return req.headers.accept?.includes("application/json")
      ? res.json({
          success: true,
          message: "Đăng nhập thành công!",
          user: result.user,
          token: token,
          redirectUrl,
        })
      : res.redirect(redirectUrl);
  } catch (error) {
    console.error("Lỗi login:", error);
    const message = "Lỗi hệ thống!";
    return req.headers.accept?.includes("application/json")
      ? res.status(500).json({ success: false, message })
      : res.redirect(`/api/login?errorMessage=${encodeURIComponent(message)}`);
  }
};

const logout = async (req, res) => {
  try {
    // Xóa cookie chứa token với cùng options như khi set
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    console.log("Backend: Cookie cleared");

    // Xử lý logout trong service
    const result = await authService.logout(req);
    console.log("Backend: Service logout completed");

    return req.headers.accept?.includes("application/json")
      ? res.json({ success: true, message: "Đăng xuất thành công" })
      : res.redirect("/api/login");
  } catch (error) {
    console.error("Backend: Logout error:", error);

    // Dù có lỗi vẫn clear cookie
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.status(500).json({
      success: false,
      message: "Lỗi khi đăng xuất!",
    });
  }
};

const showRegister = async (req, res) => {
  try {
    res.render("auth/register", {
      errorMessage: req.query.errorMessage || null,
    });
  } catch (error) {
    console.error("Lỗi khi hiển thị trang đăng ký:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
    });
  }
};

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);

    if (!result.success) {
      return req.headers.accept?.includes("application/json")
        ? res.status(400).json({ success: false, message: result.message })
        : res.redirect(
            `/api/register?errorMessage=${encodeURIComponent(result.message)}`
          );
    }

    // Nếu request từ React, trả về JSON
    if (req.headers.accept?.includes("application/json")) {
      return res.json({
        success: true,
        message: "Đăng ký thành công!",
        user: result.user,
      });
    }

    // Nếu request từ EJS, chuyển hướng đến trang đăng nhập
    return res.redirect("/api/login");
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    return req.headers.accept?.includes("application/json")
      ? res.status(500).json({
          success: false,
          message: "Có lỗi xảy ra trong quá trình đăng ký!",
        })
      : res.redirect(
          `/api/register?errorMessage=${encodeURIComponent(
            "Có lỗi xảy ra trong quá trình đăng ký!"
          )}`
        );
  }
};

const getCurrentUser = async (req, res) => {
  try {
    // Lấy token từ cookie hoặc header
    const token =
      req.cookies?.auth_token || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    try {
      // Xác thực token
      const decoded = jwt.verify(token, config.secret);

      // Lấy thông tin user từ decoded token
      const user = await authService.getUserById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: User not found",
        });
      }

      return res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      });
    } catch (err) {
      // Token không hợp lệ
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token",
      });
    }
  } catch (error) {
    console.error("Lỗi get current user:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống!",
    });
  }
};

export default {
  showLogin,
  login,
  logout,
  showRegister,
  register,
  getCurrentUser,
};
