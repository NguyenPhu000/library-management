import { Loan, Book, Member } from "../models";
const { sequelize } = require("../models"); // Đã export sequelize instance

// Lấy danh sách tất cả lượt mượn
const getAllLoans = async () => {
  try {
    return await Loan.findAll({
      include: [
        { model: Member, attributes: ["member_code"] },
        { model: Book, attributes: ["title"] },
      ],
    });
  } catch (error) {
    throw new Error("Lỗi lấy danh sách mượn: " + error.message);
  }
};

// Xử lý mượn sách
const borrowBook = async (member_id, book_id) => {
  const transaction = await sequelize.transaction(); // Bắt đầu transaction
  try {
    const book = await Book.findByPk(book_id);
    if (!book) {
      return { success: false, message: "Không tìm thấy sách!" };
    }

    if (book.available_copies <= 0) {
      return {
        success: false,
        message: "Sách này hiện đã hết bản sao để mượn!",
      };
    }

    const member = await Member.findByPk(member_id);
    if (!member) {
      return { success: false, message: "Thành viên không tồn tại!" };
    }

    // Kiểm tra hạn thẻ thành viên
    const currentDate = new Date();
    if (new Date(member.expiry_date) < currentDate) {
      return { success: false, message: "Thẻ thành viên đã hết hạn!" };
    }

    // Kiểm tra số sách đang mượn
    const activeLoans = await Loan.count({
      where: { member_id, returned: false },
    });
    if (activeLoans >= member.max_loans) {
      return {
        success: false,
        message: "Bạn đã đạt giới hạn số sách có thể mượn!",
      };
    }

    // Tạo sách đang mượn mới
    const loan = await Loan.create(
      {
        member_id,
        book_id,
        loan_date: new Date(),
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        returned: false,
      },
      { transaction }
    );

    // Giảm số lượng bản sao có sẵn của sách
    await Book.update(
      { available_copies: book.available_copies - 1 },
      { where: { book_id }, transaction }
    );

    await transaction.commit();
    return { success: true, message: "Mượn sách thành công!", loan };
  } catch (error) {
    await transaction.rollback(); // Rollback nếu có lỗi
    return {
      success: false,
      message: "Lỗi khi mượn sách!",
      error: error.message,
    };
  }
};

// Xử lý trả sách
const returnBook = async (loan_id) => {
  const transaction = await sequelize.transaction(); // Bắt đầu transaction
  try {
    const loan = await Loan.findOne({ where: { loan_id, returned: false } });
    if (!loan) {
      await transaction.rollback(); // Rollback nếu không tìm thấy sách đang mượn hợp lệ
      return {
        success: false,
        message: "Sách đã được trả hoặc không tìm thấy!",
      };
    }

    // Tính tiền phạt nếu trả trễ
    const today = new Date();
    let fine_amount = 0;

    if (today > loan.due_date) {
      fine_amount =
        Math.ceil((today - loan.due_date) / (1000 * 60 * 60 * 24)) * 5000;
    }

    // Cập nhật trạng thái trả sách
    await loan.update(
      { returned: true, return_date: today, fine_amount },
      { transaction }
    );

    // Tăng lại số lượng sách có sẵn
    await Book.increment("available_copies", {
      where: { book_id: loan.book_id },
      transaction,
    });

    await transaction.commit(); // Commit nếu thành công
    return { success: true, message: "Sách đã được trả!", fine_amount };
  } catch (error) {
    await transaction.rollback(); // Rollback nếu có lỗi
    return { success: false, message: "Lỗi khi trả sách: " + error.message };
  }
};

const getLoanByBookId = async (bookId) => {
  try {
    const loan = await Loan.findOne({
      where: { book_id: bookId, returned: false },
      attributes: ["loan_id", "due_date", "renewal_status", "renew_count"],
    });

    if (!loan)
      return { success: false, message: "Không tìm thấy thông tin mượn sách!" };

    return { success: true, loan };
  } catch (error) {
    throw new Error("Lỗi khi lấy thông tin mượn sách: " + error.message);
  }
};

// Lấy danh sách sách đang mượn hiện tại cho thành viên
const getLoansByMemberId = async (member_id) => {
  try {
    const loans = await Loan.findAll({
      where: { member_id, returned: false }, // Chỉ lấy sách chưa trả
      include: [
        { model: Book, attributes: ["title", "author"] }, // Lấy thông tin sách
        { model: Member, attributes: ["member_code"] }, // Lấy mã thành viên
      ],
      attributes: [
        "loan_id",
        "loan_date",
        "due_date",

        "renew_count",
        "renewal_status",
      ],
      order: [["loan_date", "DESC"]], // Sắp xếp theo ngày mượn mới nhất
    });

    return { success: true, loans };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi khi lấy danh sách sách đang mượn!",
      error: error.message,
    };
  }
};

// Yêu cầu gia hạn sách
const requestRenewLoan = async (loan_id) => {
  try {
    const loan = await Loan.findByPk(loan_id);
    if (!loan) return { success: false, message: "Không tìm thấy lượt mượn!" };

    if (loan.returned) {
      return {
        success: false,
        message: "Sách đã được trả, không thể gia hạn!",
      };
    }

    if (loan.renew_count >= 2) {
      return { success: false, message: "Bạn đã gia hạn tối đa 2 lần!" };
    }

    await loan.update({ renewal_status: "pending" });

    return {
      success: true,
      message: "Yêu cầu gia hạn đã được gửi, vui lòng đợi xác nhận!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi khi yêu cầu gia hạn: " + error.message,
    };
  }
};

// Phê duyệt gia hạn sách
const approveRenewLoan = async (loan_id, approve = true) => {
  try {
    const loan = await Loan.findByPk(loan_id);
    if (!loan) return { success: false, message: "Không tìm thấy lượt mượn!" };

    if (approve) {
      if (loan.renew_count >= 2) {
        return { success: false, message: "Không thể gia hạn, đã đạt tối đa!" };
      }

      await loan.update({
        due_date: new Date(loan.due_date.getTime() + 14 * 24 * 60 * 60 * 1000), // +14 ngày
        renew_count: loan.renew_count + 1,
        renewal_status: "approved",
      });

      return { success: true, message: "Gia hạn thành công, thêm 14 ngày!" };
    } else {
      await loan.update({ renewal_status: "rejected" });

      return { success: false, message: "Yêu cầu gia hạn đã bị từ chối!" };
    }
  } catch (error) {
    return {
      success: false,
      message: "Lỗi khi xử lý gia hạn: " + error.message,
    };
  }
};

const getLoanHistory = async (memberId) => {
  try {
    const loans = await Loan.findAll({
      where: { member_id: memberId, returned: true },
      include: [
        { model: Book, attributes: ["title", "author"] }, // Lấy thông tin sách
        { model: Member, attributes: ["member_code"] }, // Lấy mã thành viên
      ],
      attributes: [
        "loan_id",
        "loan_date",
        "due_date",
        "return_date",
        "renew_count",
        "renewal_status",
        "fine_amount",
      ],
      order: [["loan_date", "DESC"]], // Sắp xếp theo ngày mượn giảm dần
    });

    if (!loans.length) {
      return { success: false, message: "Không có lịch sử mượn nào." };
    }

    return { success: true, data: loans };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi khi lấy lịch sử mượn: " + error.message,
    };
  }
};

export default {
  getAllLoans,
  borrowBook,
  returnBook,
  getLoanByBookId,
  getLoansByMemberId,
  requestRenewLoan,
  approveRenewLoan,
  getLoanHistory,
};
