import db from "../models";

// Hàm lấy dữ liệu bảng điều khiển
const getDashboardData = async () => {
  const totalMembers = await db.User.count();
  const totalBooks = await db.Book.count();
  const totalLoans = await db.Loan.count();
  const totalOverdueLoans = await db.Loan.count({
    where: {
      returned: false,
      due_date: {
        [db.Sequelize.Op.lt]: new Date(),
      },
    },
  });

  return {
    totalMembers,
    totalBooks,
    totalLoans,
    totalOverdueLoans,
  };
};

// Hàm lấy trạng thái thành viên
const getMemberStatus = async () => {
  const active = await db.User.count({ where: { is_active: true } });
  const inactive = await db.User.count({ where: { is_active: false } });

  return [active, inactive];
};

// Hàm lấy danh sách tài khoản đang hoạt động
const getActiveMembers = async () => {
  try {
    const activeMembers = await db.User.findAll({
      where: { is_active: true },
    });
    return activeMembers;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tài khoản đang hoạt động:", error);
    return [];
  }
};

// Hàm lấy số lượt mượn theo tháng
const getLoansByMonth = async () => {
  try {
    const loans = await db.Loan.findAll({
      attributes: [
        [db.Sequelize.fn("MONTH", db.Sequelize.col("loan_date")), "month"],
        [db.Sequelize.fn("COUNT", db.Sequelize.col("loan_id")), "count"],
      ],
      group: ["month"],
      order: [["month", "ASC"]],
    });

    return loans.map((loan) => loan.get({ plain: true }));
  } catch (error) {
    console.error("Lỗi khi lấy số lượt mượn theo tháng:", error);
    return [];
  }
};

export default {
  getDashboardData,
  getLoansByMonth,
  getMemberStatus,
  getActiveMembers,
};
