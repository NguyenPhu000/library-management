import userService from "../services/userService.js";

// Hàm để hiển thị trang tạo người dùng
const getCreateUser = (req, res) => {
  res.render("partials/createUser.ejs");
};

// Hàm để hiển thị danh sách người dùng
const getDisplayUser = async (req, res) => {
  try {
    let { criteria, query } = req.query;
    let data =
      criteria && query
        ? await userService.searchUser({ criteria, query })
        : await userService.getAllUser();

    if (req.headers.accept?.includes("application/json")) {
      return res.json({ success: true, data: data });
    }
    res.render("userPage", {
      dataTable: data,
      currentPage: "users",
      criteria,
      query,
      successMessage: req.query.successMessage || null,
      errorMessage: req.query.errorMessage || null,
    });
  } catch (error) {
    if (req.headers.accept?.includes("application/json")) {
      return res.status(500).json({ success: false, message: error.message });
    }
    res.redirect(
      "/api/users?errorMessage=Có lỗi xảy ra khi hiển thị danh sách người dùng."
    );
  }
};

// Hàm để tạo người dùng mới
const postCreateUser = async (req, res) => {
  try {
    await userService.createNewUser(req.body);
    if (req.headers.accept?.includes("application/json")) {
      return res.json({ success: true, message: "Tạo người dùng thành công!" });
    }
    const data = await userService.getAllUser();
    res.redirect("/api/users?successMessage=Tạo người dùng thành công!");
  } catch (error) {
    console.error(error);
    if (req.headers.accept?.includes("application/json")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.redirect(
      "/api/users?errorMessage=Có lỗi xảy ra khi tạo người dùng: " +
        encodeURIComponent(error.message)
    );
  }
};

// Hàm để cập nhật thông tin người dùng
const updateUser = async (req, res) => {
  try {
    await userService.updateUserData(req.body);
    if (req.headers.accept?.includes("application/json")) {
      return res.json({
        success: true,
        message: "Cập nhật thông tin thành công!",
      });
    }
    const updatedData = await userService.getAllUser();
    res.redirect("/api/users?successMessage=Cập nhật thông tin thành công!");
  } catch (error) {
    if (req.headers.accept?.includes("application/json")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.redirect(
      "/api/users?errorMessage=Có lỗi xảy ra khi cập nhật thông tin người dùng: " +
        encodeURIComponent(error.message)
    );
  }
};

// Hàm để xóa người dùng
const deleteUser = async (req, res) => {
  try {
    if (!req.query.id) {
      if (req.headers.accept?.includes("application/json")) {
        return res
          .status(400)
          .json({ success: false, message: "User ID is required" });
      }
      return res.status(400).send("User ID is required");
    }
    await userService.deleteUserById(req.query.id);
    if (req.headers.accept?.includes("application/json")) {
      return res.json({ success: true, message: "Xóa người dùng thành công!" });
    }
    const data = await userService.getAllUser();
    res.redirect("/api/users?successMessage=Xóa người dùng thành công!");
  } catch (error) {
    console.error(error);
    if (req.headers.accept?.includes("application/json")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.redirect(
      "/api/users?errorMessage=Có lỗi xảy ra khi xóa người dùng: " +
        encodeURIComponent(error.message)
    );
  }
};

// Hàm để chuyển đổi trạng thái hoạt động của người dùng
const toggleActive = async (req, res) => {
  try {
    if (!req.query.id) {
      if (req.headers.accept?.includes("application/json")) {
        return res
          .status(400)
          .json({ success: false, message: "User ID is required" });
      }
      return res.status(400).send("User ID is required");
    }
    await userService.toggleActive(req.query.id);
    if (req.headers.accept?.includes("application/json")) {
      return res.json({
        success: true,
        message: "Cập nhật trạng thái người dùng thành công!",
      });
    }
    const users = await userService.getAllUser();
    res.redirect(
      "/api/users?successMessage=Cập nhật trạng thái người dùng thành công!"
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
    if (req.headers.accept?.includes("application/json")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.redirect(
      "/api/users?errorMessage=Có lỗi xảy ra khi cập nhật trạng thái người dùng: " +
        encodeURIComponent(error.message)
    );
  }
};

// Hàm để lấy thông tin người dùng theo ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      if (req.headers.accept?.includes("application/json")) {
        return res
          .status(400)
          .json({ success: false, message: "User ID is required" });
      }
      return res.status(400).send("User ID is required");
    }
    const user = await userService.getUserInfoById(userId);
    if (!user) {
      if (req.headers.accept?.includes("application/json")) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      return res.status(404).send("User not found");
    }
    if (req.headers.accept?.includes("application/json")) {
      return res.json({ success: true, data: user });
    }
    return res.json(user);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    if (req.headers.accept?.includes("application/json")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.redirect(
      "/api/users?errorMessage=Có lỗi xảy ra khi lấy thông tin người dùng: " +
        encodeURIComponent(error.message)
    );
  }
};

// Hàm để cập nhật hồ sơ người dùng
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      if (req.headers.accept?.includes("application/json")) {
        return res
          .status(400)
          .json({ success: false, message: "User ID is required" });
      }
      return res.status(400).send("User ID is required");
    }
    await userService.updateUserProfile(userId, req.body);
    if (req.headers.accept?.includes("application/json")) {
      return res.json({
        success: true,
        message: "Cập nhật thông tin thành công",
      });
    }
    return res.redirect(
      "/api/users?successMessage=Cập nhật thông tin thành công"
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng:", error);
    if (req.headers.accept?.includes("application/json")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.redirect(
      "/api/users?errorMessage=Lỗi: " + encodeURIComponent(error.message)
    );
  }
};

// API: Lấy danh sách người dùng dạng JSON
const getUserListJson = async (req, res) => {
  try {
    let { criteria, query } = req.query;
    let data =
      criteria && query
        ? await userService.searchUser({ criteria, query })
        : await userService.getAllUser();
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// API: Tạo người dùng mới (JSON)
const postCreateUserJson = async (req, res) => {
  try {
    await userService.createNewUser(req.body);
    res.json({ success: true, message: "Tạo người dùng thành công!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// API: Cập nhật thông tin người dùng (JSON)
const updateUserJson = async (req, res) => {
  try {
    await userService.updateUserData(req.body);
    res.json({ success: true, message: "Cập nhật thông tin thành công!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// API: Xóa người dùng (JSON)
const deleteUserJson = async (req, res) => {
  try {
    if (!req.query.id)
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    await userService.deleteUserById(req.query.id);
    res.json({ success: true, message: "Xóa người dùng thành công!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// API: Chuyển đổi trạng thái hoạt động của người dùng (JSON)
const toggleActiveJson = async (req, res) => {
  try {
    if (!req.query.id)
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    await userService.toggleActive(req.query.id);
    res.json({
      success: true,
      message: "Cập nhật trạng thái người dùng thành công!",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// API: Lấy thông tin người dùng theo ID (JSON)
const getUserByIdJson = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    const user = await userService.getUserInfoById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// API: Cập nhật hồ sơ người dùng (JSON)
const updateUserProfileJson = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    await userService.updateUserProfile(userId, req.body);
    res.json({ success: true, message: "Cập nhật thông tin thành công" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export default {
  getCreateUser,
  getDisplayUser,
  postCreateUser,
  updateUser,
  deleteUser,
  toggleActive,
  updateUserProfile,
  getUserById,
  // JSON API cho React FE
  getUserListJson,
  postCreateUserJson,
  updateUserJson,
  deleteUserJson,
  toggleActiveJson,
  getUserByIdJson,
  updateUserProfileJson,
};
