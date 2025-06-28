import {
  Loan,
  Book,
  Member,
  Category,
  User,
  sequelize,
} from "../models/index.js";
const { Op } = sequelize;

/**
 * Simplified Enhanced Loan Service
 * Sử dụng models hiện có, business logic hoàn chỉnh
 */

// =============================================================================
// BUSINESS RULES - Constants
// =============================================================================
const LIBRARY_SETTINGS = {
  max_books_per_member: 5,
  loan_duration_days: 10,
  daily_fine_rate: 2000.0,
  max_renewal_times: 1,
  reservation_hold_days: 3,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const calculateDueDate = (fromDate = new Date()) => {
  const dueDate = new Date(fromDate);
  dueDate.setDate(dueDate.getDate() + LIBRARY_SETTINGS.loan_duration_days);
  return dueDate;
};

const calculateFine = (returnDate, dueDate) => {
  if (returnDate <= dueDate) return 0;

  const daysOverdue = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
  return daysOverdue * LIBRARY_SETTINGS.daily_fine_rate;
};

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Kiểm tra điều kiện mượn sách đầy đủ
 */
const validateBorrowConditions = async (memberId, bookId) => {
  const errors = [];

  // Kiểm tra thành viên
  const member = await Member.findByPk(memberId);
  if (!member) {
    errors.push("Thành viên không tồn tại");
    return { valid: false, errors, member: null, book: null };
  }

  // Kiểm tra thẻ hết hạn
  if (new Date(member.expiry_date) < new Date()) {
    errors.push("Thẻ thành viên đã hết hạn");
  }

  // Kiểm tra sách
  const book = await Book.findByPk(bookId);
  if (!book) {
    errors.push("Sách không tồn tại");
    return { valid: false, errors, member, book: null };
  }

  if (book.available_copies <= 0) {
    errors.push("Sách hiện không có sẵn");
  }

  // Kiểm tra số sách đang mượn
  const activeLoans = await Loan.count({
    where: { member_id: memberId, returned: false },
  });

  if (activeLoans >= LIBRARY_SETTINGS.max_books_per_member) {
    errors.push(
      `Đã đạt giới hạn mượn ${LIBRARY_SETTINGS.max_books_per_member} cuốn sách`
    );
  }

  // Kiểm tra phí phạt chưa thanh toán
  const unpaidFines = await Loan.sum("fine_amount", {
    where: {
      member_id: memberId,
      fine_amount: { [Op.gt]: 0 },
      returned: true, // Sách đã trả nhưng chưa thanh toán phí phạt
    },
  });

  if (unpaidFines > 0) {
    errors.push(
      `Vui lòng thanh toán phí phạt ${unpaidFines.toLocaleString(
        "vi-VN"
      )} VND trước khi mượn sách mới`
    );
  }

  // Kiểm tra đã mượn sách này chưa
  const existingLoan = await Loan.findOne({
    where: { member_id: memberId, book_id: bookId, returned: false },
  });

  if (existingLoan) {
    errors.push("Bạn đã mượn sách này rồi");
  }

  return {
    valid: errors.length === 0,
    errors,
    member,
    book,
    settings: LIBRARY_SETTINGS,
  };
};

// =============================================================================
// CORE BUSINESS FUNCTIONS
// =============================================================================

/**
 * 🎯 QUY TRÌNH MƯỢN SÁCH HOÀN CHỈNH
 */
const borrowBook = async (memberId, bookId, adminId = null) => {
  const transaction = await sequelize.transaction();

  try {
    // Bước 1: Kiểm tra điều kiện
    const validation = await validateBorrowConditions(memberId, bookId);
    if (!validation.valid) {
      await transaction.rollback();
      return {
        success: false,
        message: validation.errors.join(", "),
        errors: validation.errors,
      };
    }

    const { member, book } = validation;

    // Bước 2: Tạo loan record
    const loanDate = new Date();
    const dueDate = calculateDueDate(loanDate);

    const loan = await Loan.create(
      {
        member_id: memberId,
        book_id: bookId,
        loan_date: loanDate,
        due_date: dueDate,
        returned: false,
        fine_amount: 0,
        renew_count: 0,
        renewal_status: "none",
      },
      { transaction }
    );

    // Bước 3: Cập nhật inventory
    await Book.decrement("available_copies", {
      where: { book_id: bookId },
      transaction,
    });

    await Member.increment("current_loans", {
      where: { member_id: memberId },
      transaction,
    });

    await transaction.commit();

    return {
      success: true,
      message: "Mượn sách thành công!",
      loan: {
        ...loan.dataValues,
        due_date_formatted: dueDate.toLocaleDateString("vi-VN"),
        Book: book,
        Member: member,
      },
    };
  } catch (error) {
    await transaction.rollback();
    console.error("Error in borrowBook:", error);
    return {
      success: false,
      message: "Lỗi hệ thống khi mượn sách: " + error.message,
    };
  }
};

/**
 * 📚 QUY TRÌNH TRẢ SÁCH HOÀN CHỈNH
 */
const returnBook = async (loanId, adminId = null, condition = "good") => {
  const transaction = await sequelize.transaction();

  try {
    // Bước 1: Tìm loan record
    const loan = await Loan.findOne({
      where: { loan_id: loanId, returned: false },
      include: [
        { model: Book, attributes: ["book_id", "title"] },
        { model: Member, attributes: ["member_id", "member_code"] },
      ],
    });

    if (!loan) {
      await transaction.rollback();
      return {
        success: false,
        message: "Không tìm thấy thông tin mượn sách hoặc sách đã được trả",
      };
    }

    // Bước 2: Tính phí phạt
    const returnDate = new Date();
    const fineAmount = calculateFine(returnDate, loan.due_date);

    // Bước 3: Cập nhật loan record
    await loan.update(
      {
        returned: true,
        return_date: returnDate,
        fine_amount: fineAmount,
      },
      { transaction }
    );

    // Bước 4: Cập nhật inventory
    await Book.increment("available_copies", {
      where: { book_id: loan.book_id },
      transaction,
    });

    await Member.decrement("current_loans", {
      where: { member_id: loan.member_id },
      transaction,
    });

    await transaction.commit();

    return {
      success: true,
      message:
        fineAmount > 0
          ? `Trả sách thành công! Phí phạt: ${fineAmount.toLocaleString(
              "vi-VN"
            )} VND`
          : "Trả sách thành công!",
      loan: {
        ...loan.dataValues,
        return_date: returnDate,
        fine_amount: fineAmount,
      },
      fine_amount: fineAmount,
    };
  } catch (error) {
    await transaction.rollback();
    console.error("Error in returnBook:", error);
    return {
      success: false,
      message: "Lỗi hệ thống khi trả sách: " + error.message,
    };
  }
};

/**
 * 🔄 QUY TRÌNH GIA HẠN SÁCH
 */
const requestRenewal = async (loanId, memberId) => {
  const transaction = await sequelize.transaction();

  try {
    const loan = await Loan.findOne({
      where: { loan_id: loanId, member_id: memberId, returned: false },
      include: [{ model: Book, attributes: ["book_id", "title"] }],
    });

    if (!loan) {
      await transaction.rollback();
      return {
        success: false,
        message: "Không tìm thấy thông tin mượn sách",
      };
    }

    // Kiểm tra điều kiện gia hạn
    if (loan.renew_count >= LIBRARY_SETTINGS.max_renewal_times) {
      await transaction.rollback();
      return {
        success: false,
        message: `Đã đạt giới hạn gia hạn ${LIBRARY_SETTINGS.max_renewal_times} lần`,
      };
    }

    if (new Date() > loan.due_date) {
      await transaction.rollback();
      return {
        success: false,
        message: "Không thể gia hạn sách đã quá hạn",
      };
    }

    // Tạo yêu cầu gia hạn
    await loan.update(
      {
        renewal_status: "pending",
      },
      { transaction }
    );

    await transaction.commit();

    return {
      success: true,
      message: "Đã gửi yêu cầu gia hạn, chờ thủ thư duyệt",
      loan,
    };
  } catch (error) {
    await transaction.rollback();
    return {
      success: false,
      message: "Lỗi khi yêu cầu gia hạn: " + error.message,
    };
  }
};

/**
 * ✅ DUYỆT GIA HẠN (ADMIN)
 */
const approveRenewal = async (loanId, adminId) => {
  const transaction = await sequelize.transaction();

  try {
    const loan = await Loan.findByPk(loanId, {
      include: [{ model: Book, attributes: ["title"] }],
    });

    if (!loan || loan.renewal_status !== "pending") {
      await transaction.rollback();
      return {
        success: false,
        message: "Không tìm thấy yêu cầu gia hạn",
      };
    }

    const newDueDate = new Date(loan.due_date);
    newDueDate.setDate(
      newDueDate.getDate() + LIBRARY_SETTINGS.loan_duration_days
    );

    await loan.update(
      {
        due_date: newDueDate,
        renew_count: loan.renew_count + 1,
        renewal_status: "approved",
      },
      { transaction }
    );

    await transaction.commit();

    return {
      success: true,
      message: "Đã duyệt gia hạn thành công",
      loan: {
        ...loan.dataValues,
        due_date: newDueDate,
      },
    };
  } catch (error) {
    await transaction.rollback();
    return {
      success: false,
      message: "Lỗi khi duyệt gia hạn: " + error.message,
    };
  }
};

/**
 * ❌ TỪ CHỐI GIA HẠN (ADMIN)
 */
const rejectRenewal = async (loanId, adminId, reason = "") => {
  const transaction = await sequelize.transaction();

  try {
    const loan = await Loan.findByPk(loanId, {
      include: [{ model: Book, attributes: ["title"] }],
    });

    if (!loan || loan.renewal_status !== "pending") {
      await transaction.rollback();
      return {
        success: false,
        message: "Không tìm thấy yêu cầu gia hạn",
      };
    }

    await loan.update(
      {
        renewal_status: "rejected",
      },
      { transaction }
    );

    await transaction.commit();

    return {
      success: true,
      message: "Đã từ chối yêu cầu gia hạn",
      loan,
    };
  } catch (error) {
    await transaction.rollback();
    return {
      success: false,
      message: "Lỗi khi từ chối gia hạn: " + error.message,
    };
  }
};

// =============================================================================
// QUERY FUNCTIONS
// =============================================================================

/**
 * 📋 Lấy danh sách loans với filters
 */
const getAllLoans = async (filters = {}) => {
  const whereClause = {};

  if (filters.status === "active") {
    whereClause.returned = false;
  } else if (filters.status === "returned") {
    whereClause.returned = true;
  }

  if (filters.overdue) {
    whereClause.due_date = { [Op.lt]: new Date() };
    whereClause.returned = false;
  }

  if (filters.renewal_status) {
    whereClause.renewal_status = filters.renewal_status;
  }

  return await Loan.findAll({
    where: whereClause,
    include: [
      {
        model: Member,
        attributes: ["member_id", "member_code"],
        include: [
          {
            model: User,
            attributes: ["first_name", "last_name", "email"],
          },
        ],
      },
      {
        model: Book,
        attributes: ["book_id", "title", "author", "isbn"],
      },
    ],
    order: [["loan_date", "DESC"]],
  });
};

/**
 * 📊 Thống kê loans cho dashboard
 */
const getLoanStats = async () => {
  const totalLoans = await Loan.count();
  const activeLoans = await Loan.count({ where: { returned: false } });
  const overdueLoans = await Loan.count({
    where: {
      returned: false,
      due_date: { [Op.lt]: new Date() },
    },
  });
  const pendingRenewals = await Loan.count({
    where: { renewal_status: "pending" },
  });

  return {
    total: totalLoans,
    active: activeLoans,
    returned: totalLoans - activeLoans,
    overdue: overdueLoans,
    pendingRenewal: pendingRenewals,
  };
};

/**
 * 👤 Lấy loans của member specific
 */
const getMemberLoans = async (memberId, status = "all") => {
  const whereClause = { member_id: memberId };

  if (status === "active") {
    whereClause.returned = false;
  } else if (status === "returned") {
    whereClause.returned = true;
  }

  return await Loan.findAll({
    where: whereClause,
    include: [
      {
        model: Book,
        attributes: ["book_id", "title", "author", "isbn", "cover_image"],
        include: [
          {
            model: Category,
            as: "categories",
            attributes: ["category_id", "name"],
            through: { attributes: [] },
          },
        ],
      },
    ],
    order: [["loan_date", "DESC"]],
  });
};

/**
 * ⚙️ Lấy library settings
 */
const getLibrarySettings = async () => {
  return LIBRARY_SETTINGS;
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Core functions
  borrowBook,
  returnBook,
  requestRenewal,
  approveRenewal,
  rejectRenewal,

  // Query functions
  getAllLoans,
  getLoanStats,
  getMemberLoans,
  getLibrarySettings,
  validateBorrowConditions,

  // Helper functions
  calculateFine,
  calculateDueDate,
};
