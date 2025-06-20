import userService from "../services/userService.js";

// GET /api/users  (list với pagination & filter)
const listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "all" } = req.query;

    const result = await userService.getUsersWithPagination(
      page,
      limit,
      search,
      status
    );

    return res.json({ success: true, ...result });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách users:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/users  (create new)
const createUser = async (req, res) => {
  try {
    const payload = {
      username: req.body.username,
      password: req.body.password,
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      gender: req.body.gender,
      role: req.body.role,
    };
    await userService.createNewUser(payload);
    return res.json({ success: true, message: "Tạo người dùng thành công!" });
  } catch (error) {
    console.error("Lỗi khi tạo user:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// POST /api/users/update
const updateUser = async (req, res) => {
  try {
    const payload = {
      user_id: req.body.user_id || req.body.id,
      username: req.body.username,
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      gender: req.body.gender,
      role: req.body.role,
    };
    await userService.updateUserData(payload);
    return res.json({ success: true, message: "Cập nhật thành công!" });
  } catch (error) {
    console.error("Lỗi khi cập nhật user:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// POST /api/users/delete
const deleteUser = async (req, res) => {
  try {
    const userId = req.body.user_id || req.body.id;
    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });

    await userService.deleteUserById(userId);
    return res.json({ success: true, message: "Xóa người dùng thành công!" });
  } catch (error) {
    console.error("Lỗi khi xóa user:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// POST /api/users/toggle-active
const toggleActive = async (req, res) => {
  try {
    const userId = req.body.user_id || req.body.id;
    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });

    const isActive = await userService.toggleActive(userId);
    return res.json({
      success: true,
      isActive,
      message: "Cập nhật trạng thái thành công!",
    });
  } catch (error) {
    console.error("Lỗi toggleActive:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/users/:userId
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserInfoById(req.params.userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    return res.json({ success: true, user });
  } catch (error) {
    console.error("Lỗi khi lấy user by id:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// POST /api/users/update-profile/:userId
const updateUserProfile = async (req, res) => {
  try {
    const payload = {
      username: req.body.username,
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      gender: req.body.gender,
      password: req.body.password,
    };
    await userService.updateUserProfile(req.params.userId, payload);
    return res.json({
      success: true,
      message: "Cập nhật thông tin thành công",
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật hồ sơ:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// POST /api/users/sync
const syncUsers = async (_req, res) => {
  try {
    const result = await userService.syncUsers();
    return res.json({ success: true, ...result });
  } catch (error) {
    console.error("Lỗi sync users:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/users/stats
const getUserStats = async (_req, res) => {
  try {
    const stats = await userService.getUserStats();
    return res.json({ success: true, stats });
  } catch (error) {
    console.error("Lỗi stats:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleActive,
  getUserById,
  updateUserProfile,
  syncUsers,
  getUserStats,
};
