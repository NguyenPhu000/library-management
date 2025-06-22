import { Loan, Book, Member, Category, sequelize } from "../models";
const fineAmount = 1000;

// Hàm lấy danh sách tất cả lượt mượn
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

// Hàm xử lý mượn sách
const borrowBook = async (member_id, book_id) => {
  const transaction = await sequelize.transaction();
  try {
    const book = await Book.findByPk(book_id);
    if (!book) {
      await transaction.rollback();
      return { success: false, message: "Không tìm thấy sách!" };
    }

    if (book.available_copies <= 0) {
      await transaction.rollback();
      return {
        success: false,
        message: "Sách này hiện đã hết bản sao để mượn!",
      };
    }

    const member = await Member.findByPk(member_id);
    if (!member) {
      await transaction.rollback();
      return { success: false, message: "Thành viên không tồn tại!" };
    }

    const currentDate = new Date();
    if (new Date(member.expiry_date) < currentDate) {
      await transaction.rollback();
      return { success: false, message: "Thẻ thành viên đã hết hạn!" };
    }

    // Kiểm tra số sách đang mượn
    const activeLoans = await Loan.count({
      where: { member_id, returned: false },
    });
    if (activeLoans >= member.max_loans) {
      await transaction.rollback();
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
    await Book.decrement("available_copies", {
      where: { book_id },
      transaction,
    });

    // Tăng số sách đang mượn của thành viên
    await Member.increment("current_loans", {
      where: { member_id },
      transaction,
    });

    await transaction.commit();
    return { success: true, message: "Mượn sách thành công!", loan };
  } catch (error) {
    await transaction.rollback();
    return {
      success: false,
      message: "Lỗi khi mượn sách: " + error.message,
    };
  }
};

// Hàm xử lý trả sách
const returnBook = async (loan_id) => {
  const transaction = await sequelize.transaction();
  try {
    const loan = await Loan.findOne({ where: { loan_id, returned: false } });
    if (!loan) {
      await transaction.rollback();
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
        Math.ceil((today - loan.due_date) / (1000 * 60 * 60 * 24)) * fineAmount;
    }

    // Cập nhật trạng thái trả sách
    await loan.update(
      { returned: true, return_date: today, fine_amount },
      { transaction }
    );

    // Tăng số lượng bản sao có sẵn
    await Book.increment("available_copies", {
      where: { book_id: loan.book_id },
      transaction,
    });

    // Giảm số sách đang mượn của thành viên
    await Member.decrement("current_loans", {
      where: { member_id: loan.member_id },
      transaction,
    });

    await transaction.commit();
    return {
      success: true,
      message: "Sách đã được trả!",
      fine_amount,
      loan,
    };
  } catch (error) {
    await transaction.rollback();
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

// Hàm lấy danh sách sách đang mượn hiện tại cho thành viên
const getCurrentLoansByMemberId = async (member_id) => {
  try {
    const loans = await Loan.findAll({
      where: { member_id, returned: false }, // Chỉ lấy sách chưa trả
      include: [
        {
          model: Book,
          attributes: [
            "book_id",
            "title",
            "author",
            "isbn",
            "publisher",
            "publication_year",
            "cover_image",
            "total_copies",
            "available_copies",
          ],
          include: [
            {
              model: Category,
              as: "categories",
              attributes: ["category_id", "name"],
              through: { attributes: [] }, // Không lấy attributes từ bảng trung gian
            },
          ],
        }, // Lấy thông tin sách đầy đủ
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

    return loans;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách sách đang mượn: " + error.message);
  }
};

// Hàm lấy lịch sử mượn sách cho thành viên
const getLoanHistoryByMemberId = async (member_id) => {
  try {
    const loans = await Loan.findAll({
      where: { member_id, returned: true }, // Chỉ lấy sách đã trả
      include: [
        { model: Book, attributes: ["title", "author", "cover_image"] },
        { model: Member, attributes: ["member_code"] },
      ],
      attributes: [
        "loan_id",
        "loan_date",
        "due_date",
        "return_date",
        "fine_amount",
      ],
      order: [["return_date", "DESC"]], // Sắp xếp theo ngày trả mới nhất
      raw: true, // Trả về dữ liệu dạng plain object thay vì instance
      nest: true, // Lồng các mối quan hệ vào object
    });

    return loans;
  } catch (error) {
    throw new Error("Lỗi khi lấy lịch sử mượn sách: " + error.message);
  }
};

// Hàm yêu cầu gia hạn sách
const requestRenewLoan = async (loan_id) => {
  try {
    const loan = await Loan.findByPk(loan_id);
    if (!loan)
      return { success: false, message: "Không tìm thấy thông tin mượn sách!" };

    if (loan.returned) {
      return {
        success: false,
        message: "Sách đã được trả, không thể yêu cầu gia hạn!",
      };
    }

    const currentDate = new Date();
    const overdueDays = Math.ceil(
      (currentDate - new Date(loan.due_date)) / (1000 * 60 * 60 * 24)
    );
    if (overdueDays > 7) {
      return {
        success: false,
        message: "Không thể gia hạn, đã quá hạn hơn 7 ngày!",
      };
    }

    if (loan.renew_count >= 1) {
      return { success: false, message: "Bạn đã đạt giới hạn gia hạn tối đa!" };
    }

    await loan.update({ renewal_status: "pending" });

    return {
      success: true,
      message: "Yêu cầu gia hạn đã được gửi thành công!",
      loan,
    };
  } catch (error) {
    return {
      success: false,
      message: "Đã xảy ra lỗi khi gửi yêu cầu gia hạn: " + error.message,
    };
  }
};

// Hàm phê duyệt gia hạn sách
const approveRenewLoan = async (loan_id) => {
  try {
    const loan = await Loan.findByPk(loan_id);
    if (!loan) {
      return { success: false, message: "Không tìm thấy lượt mượn!" };
    }

    if (loan.renewal_status !== "pending") {
      return {
        success: false,
        message: "Yêu cầu gia hạn không ở trạng thái chờ duyệt!",
      };
    }

    if (loan.renew_count >= 1) {
      return { success: false, message: "Không thể gia hạn, đã đạt tối đa!" };
    }

    const currentDate = new Date();
    const overdueDays = Math.ceil(
      (currentDate - new Date(loan.due_date)) / (1000 * 60 * 60 * 24)
    );

    if (overdueDays > 7) {
      return {
        success: false,
        message: "Không thể gia hạn, đã quá hạn hơn 7 ngày!",
      };
    }

    // Cập nhật ngày hẹn trả và trạng thái gia hạn
    await loan.update({
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Thêm 7 ngày từ ngày hiện tại
      renewal_status: "approved",
      renew_count: loan.renew_count + 1,
    });

    return {
      success: true,
      message: "Gia hạn đã được phê duyệt!",
      loan,
    };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi khi duyệt gia hạn: " + error.message,
    };
  }
};

export default {
  getAllLoans,
  borrowBook,
  returnBook,
  getLoanByBookId,
  getCurrentLoansByMemberId,
  getLoanHistoryByMemberId,
  requestRenewLoan,
  approveRenewLoan,
};
