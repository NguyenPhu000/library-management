import userService from "../services/userService.js";

const getCreateUser = (req, res) => {
  res.render("partials/createUser.ejs");
};

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
