import { Member, User, Loan } from "../models";

// Lấy tất cả member
const getAllMembers = async () => {
  try {
    const members = await Member.findAll({
      include: [
        {
          model: User,
        },
      ],
    });
    return { success: true, members };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi lấy danh sách Member: " + error.message,
    };
  }
};

// Lấy thông tin member theo user ID
const getMemberByUserId = async (userId) => {
  try {
    const member = await Member.findOne({
      where: { user_id: userId },
      include: [
        {
          model: User,
          attributes: { exclude: ["password"] }, // Loại bỏ mật khẩu
        },
      ],
    });

    if (!member) {
      return {
        success: false,
        message: "Không tìm thấy thông tin thành viên",
      };
    }

    return {
      success: true,
      member,
    };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi lấy thông tin Member: " + error.message,
    };
  }
};

// Đồng bộ Member từ User
const syncMembersFromUsers = async () => {
  try {
    const users = await User.findAll({ where: { role: "member" } });

    const existingMembers = await Member.findAll({ attributes: ["user_id"] });
    const existingUserIds = existingMembers.map((m) => m.user_id);

    const newMembers = users
      .filter((user) => !existingUserIds.includes(user.user_id))
      .map((user) => ({
        user_id: user.user_id,
        member_code: `MEM-${user.user_id}`,
        join_date: new Date(),
        expiry_date: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ),
        max_loans: 5,
        current_loans: 0,
        status: "Active",
      }));

    if (newMembers.length > 0) {
      await Member.bulkCreate(newMembers);
    }

    return {
      success: true,
      message: `${newMembers.length} Members được thêm thành công!`,
    };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi đồng bộ Members từ Users: " + error.message,
    };
  }
};

// Cập nhật Member
const updateMember = async (data) => {
  try {
    const member = await Member.findByPk(data.member_id);
    if (!member) {
      return { success: false, message: "Không tìm thấy Member" };
    }

    const user = await User.findByPk(member.user_id);
    if (!user || user.role !== "member") {
      return { success: false, message: "User này không phải Member" };
    }

    await member.update({
      expiry_date: data.expiry_date,
      max_loans: data.max_loans,
      current_loans: data.current_loans,
      status: data.status,
    });

    return { success: true, message: "Cập nhật Member thành công!" };
  } catch (error) {
    return { success: false, message: "Lỗi update Member: " + error.message };
  }
};

// Xóa Member
const deleteMemberById = async (member_id) => {
  try {
    const member = await Member.findByPk(member_id);
    if (!member) {
      return { success: false, message: "Không tìm thấy Member" };
    }

    // Kiểm tra xem member có đang mượn sách không
    const activeLoans = await Loan.count({
      where: { member_id, returned: false },
    });

    if (activeLoans > 0) {
      return {
        success: false,
        message: "Không thể xóa Member đang mượn sách!",
      };
    }

    await member.destroy();
    return { success: true, message: "Xóa Member thành công" };
  } catch (error) {
    return { success: false, message: "Lỗi xóa Member: " + error.message };
  }
};
// Lấy member_id từ user_id
const getMemberIdByUserId = async (user_id) => {
  try {
    const member = await Member.findOne({ where: { user_id } });
    if (!member) {
      return { success: false, message: "Không tìm thấy Member" };
    }
    return { success: true, member_id: member.member_id };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi khi lấy member_id từ user_id: " + error.message,
    };
  }
};

export default {
  getAllMembers,
  syncMembersFromUsers,
  updateMember,
  deleteMemberById,
  getMemberByUserId,
  getMemberIdByUserId,
};
