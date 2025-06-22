import memberService from "../services/memberService.js";

// GET /api/admin/members - với pagination và search
const listMembers = async (req, res) => {
  try {
    // Lấy pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    console.log("listMembers params:", { page, limit, search });

    // Sync members trước khi lấy data
    await memberService.syncMembersFromUsers();

    // Lấy members với pagination và search
    const result = await memberService.getAllMembers({
      page,
      limit,
      search,
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.json({
      success: true,
      members: result.members,
      total: result.total,
      page: page,
      limit: limit,
      totalPages: Math.ceil(result.total / limit),
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách member:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Hàm này lấy thông tin thành viên theo User ID
const getMemberByUserId = async (req, res) => {
  try {
    if (!req.params.userId) {
      return res.status(400).json({ success: false, message: "Thiếu User ID" });
    }

    const result = await memberService.getMemberByUserId(req.params.userId);

    if (!result.success) {
      return res.status(404).json({ success: false, message: result.message });
    }

    // Trả về dữ liệu thành viên
    res.json(result.member);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server: " + error.message });
  }
};

// POST /api/admin/members/update
const updateMember = async (req, res) => {
  try {
    const updateResult = await memberService.updateMember(req.body);

    if (!updateResult.success) {
      return res
        .status(400)
        .json({ success: false, message: updateResult.message });
    }

    return res.json({ success: true, message: updateResult.message });
  } catch (error) {
    console.error("Lỗi khi cập nhật member:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/admin/members/delete
const deleteMember = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu ID thành viên" });
    }

    const deleteResult = await memberService.deleteMemberById(id);

    if (!deleteResult.success) {
      return res
        .status(400)
        .json({ success: false, message: deleteResult.message });
    }

    return res.json({ success: true, message: deleteResult.message });
  } catch (error) {
    console.error("Lỗi khi xóa member:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/admin/members/sync
const syncMember = async (_req, res) => {
  try {
    const syncResult = await memberService.syncMembersFromUsers();

    if (!syncResult.success) {
      return res
        .status(400)
        .json({ success: false, message: syncResult.message });
    }

    return res.json({ success: true, message: syncResult.message });
  } catch (error) {
    console.error("Lỗi khi đồng bộ member:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Hàm này lấy ID thành viên theo User ID
const getMemberIdByUserId = async (req, res) => {
  if (!req.params.userId)
    return res.status(400).json({ success: false, message: "Thiếu User ID" });

  try {
    const result = await memberService.getMemberIdByUserId(req.params.userId);

    if (!result.success)
      return res.status(404).json({ success: false, message: result.message });

    // Đảm bảo trả về đúng định dạng dữ liệu
    res.json({
      success: true,
      member_id: result.member_id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server: " + error.message });
  }
};

export default {
  listMembers,
  getMemberByUserId,
  updateMember,
  deleteMember,
  syncMember,
  getMemberIdByUserId,
};
