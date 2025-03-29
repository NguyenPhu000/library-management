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
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Hàm để tạo người dùng mới
const postCreateUser = async (req, res) => {
  try {
    await userService.createNewUser(req.body);
    const data = await userService.getAllUser();

    res.render("userPage", {
      dataTable: data,
      criteria: req.query.criteria || "",
      query: req.query.query || "",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Lỗi khi tạo người dùng.");
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
    res.render("userPage", {
      dataTable: updatedData,
      criteria: req.query.criteria || "",
      query: req.query.query || "",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Hàm để xóa người dùng
const deleteUser = async (req, res) => {
  try {
    if (!req.query.id) return res.status(400).send("User ID is required");

    await userService.deleteUserById(req.query.id);
    const data = await userService.getAllUser();

    res.render("userPage", {
      dataTable: data,
      criteria: req.query.criteria || "",
      query: req.query.query || "",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Hàm để chuyển đổi trạng thái hoạt động của người dùng
const toggleActive = async (req, res) => {
  try {
    if (!req.query.id) return res.status(400).send("User ID is required");

    await userService.toggleActive(req.query.id);
    const users = await userService.getAllUser();

    res.render("userPage", {
      dataTable: users,
      currentPage: "users",
      criteria: req.query.criteria || "",
      query: req.query.query || "",
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
    res.status(500).send(error.message);
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
    res.status(500).send(error.message);
  }
};

// Hàm để cập nhật hồ sơ người dùng
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).send("User ID is required");

    await userService.updateUserProfile(userId, req.body);

    return res.status(200).send("Cập nhật thông tin thành công");
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng:", error);
    res.status(500).send("Lỗi: " + error.message);
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
