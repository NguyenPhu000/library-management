import memberService from "../services/memberService.js";

// Hàm này lấy danh sách thành viên và hiển thị
const getDisplayMember = async (req, res) => {
  try {
    const result = await memberService.getAllMembers();

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    if (req.headers.accept?.includes("application/json")) {
      return res.json(result);
    }
    res.render("memberPage", { dataTable: result.members });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// Hàm này lấy thông tin thành viên theo User ID
const getMemberByUserId = async (req, res) => {
  try {
    if (!req.params.userId) {
      return res.status(400).json({ message: "Thiếu User ID" });
    }

    const result = await memberService.getMemberByUserId(req.params.userId);

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// Hàm này cập nhật thông tin thành viên
const updateMember = async (req, res) => {
  try {
    const updateResult = await memberService.updateMember(req.body);

    if (!updateResult.success) {
      return res.status(400).json({ message: updateResult.message });
    }

    const result = await memberService.getAllMembers();

    if (req.headers.accept?.includes("application/json")) {
      return res.json({ success: true, message: updateResult.message });
    }

    res.render("memberPage", { dataTable: result.members });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// Hàm này xóa thành viên theo ID
const deleteMember = async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(400).json({ message: "Thiếu ID thành viên" });
    }

    const deleteResult = await memberService.deleteMemberById(req.query.id);

    if (!deleteResult.success) {
      return res.status(400).json({ message: deleteResult.message });
    }

    const result = await memberService.getAllMembers();

    if (req.headers.accept?.includes("application/json")) {
      return res.json({ success: true, message: deleteResult.message });
    }

    res.render("memberPage", { dataTable: result.members });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// Hàm này đồng bộ hóa thành viên từ người dùng
const syncMember = async (req, res) => {
  try {
    const syncResult = await memberService.syncMembersFromUsers();

    if (!syncResult.success) {
      return res.status(400).json({ message: syncResult.message });
    }

    const result = await memberService.getAllMembers();

    if (req.headers.accept?.includes("application/json")) {
      return res.json({ success: true, message: syncResult.message });
    }

    res.render("memberPage", { dataTable: result.members });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// Hàm này lấy ID thành viên theo User ID
const getMemberIdByUserId = async (req, res) => {
  if (!req.params.userId)
    return res.status(400).json({ message: "Thiếu User ID" });

  try {
    const result = await memberService.getMemberIdByUserId(req.params.userId);
    if (!result.success)
      return res.status(404).json({ message: result.message });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

export default {
  getDisplayMember,
  getMemberByUserId,
  updateMember,
  deleteMember,
  syncMember,
  getMemberIdByUserId,
};
