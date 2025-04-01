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

    res.render("userPage", {
      dataTable: data,
      currentPage: "users",
      criteria,
      query,
      successMessage: req.query.successMessage || null,
      errorMessage: req.query.errorMessage || null,
    });
  } catch (error) {
    res.redirect(
      "/api/users?errorMessage=Có lỗi xảy ra khi hiển thị danh sách người dùng."
    );
  }
};

// Hàm để tạo người dùng mới
const postCreateUser = async (req, res) => {
  try {
    await userService.createNewUser(req.body);
    const data = await userService.getAllUser();
    res.redirect("/api/users?successMessage=Tạo người dùng thành công!");
  } catch (error) {
    console.error(error);
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
    const updatedData = await userService.getAllUser();
    if (req.headers.accept?.includes("application/json")) {
      return res.json(updatedData);
    }
    res.redirect("/api/users?successMessage=Cập nhật thông tin thành công!");
  } catch (error) {
    return res.redirect(
      "/api/users?errorMessage=Có lỗi xảy ra khi cập nhật thông tin người dùng: " +
        encodeURIComponent(error.message)
    );
  }
};

// Hàm để xóa người dùng
const deleteUser = async (req, res) => {
  try {
    if (!req.query.id) return res.status(400).send("User ID is required");

    await userService.deleteUserById(req.query.id);
    const data = await userService.getAllUser();
    res.redirect("/api/users?successMessage=Xóa người dùng thành công!");
  } catch (error) {
    console.error(error);
    return res.redirect(
      "/api/users?errorMessage=Có lỗi xảy ra khi xóa người dùng: " +
        encodeURIComponent(error.message)
    );
  }
};

// Hàm để chuyển đổi trạng thái hoạt động của người dùng
const toggleActive = async (req, res) => {
  try {
    if (!req.query.id) return res.status(400).send("User ID is required");

    await userService.toggleActive(req.query.id);
    const users = await userService.getAllUser();
    res.redirect(
      "/api/users?successMessage=Cập nhật trạng thái người dùng thành công!"
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
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
    if (!userId) return res.status(400).send("User ID is required");

    const user = await userService.getUserInfoById(userId);
    if (!user) return res.status(404).send("User not found");

    return res.json(user);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
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
    if (!userId) return res.status(400).send("User ID is required");

    await userService.updateUserProfile(userId, req.body);
    return res.redirect(
      "/api/users?successMessage=Cập nhật thông tin thành công"
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng:", error);
    return res.redirect(
      "/api/users?errorMessage=Lỗi: " + encodeURIComponent(error.message)
    );
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
};
