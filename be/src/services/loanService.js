import {
  Loan,
  Book,
  Member,
  Category,
  Admin,
  User,
  sequelize,
} from "../models";
import { Op } from "sequelize";

// Constants theo quy tắc nghiệp vụ
const LIBRARY_RULES = {
  FINE_PER_DAY: 2000, // 2,000 VND/ngày trễ hạn
  LOAN_PERIOD_DAYS: 10, // Thời hạn mượn 10 ngày
  MAX_BOOKS_PER_MEMBER: 5, // Tối đa 5 cuốn/thành viên
  HOLD_PERIOD_DAYS: 3, // Giữ chỗ đặt trước 3 ngày
  MAX_RENEWALS: 1, // Tối đa 1 lần gia hạn
};

// === PHASE 1: BOOK RESERVATION (Đặt trước sách) ===

// Hàm tạo pickup code ngẫu nhiên
const generatePickupCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "PICK-";
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Member yêu cầu mượn sách - TỰ ĐỘNG SINH MÃ
const requestBook = async (member_id, book_id, notes = "") => {
  const transaction = await sequelize.transaction();
  try {
    // Kiểm tra sách có tồn tại không
    const book = await Book.findByPk(book_id);
    if (!book) {
      await transaction.rollback();
      return { success: false, message: "Không tìm thấy sách!" };
    }

    // Kiểm tra thành viên
    const member = await Member.findByPk(member_id);
    if (!member) {
      await transaction.rollback();
      return { success: false, message: "Thành viên không tồn tại!" };
    }

    // Kiểm tra thẻ thành viên còn hiệu lực
    if (new Date(member.expiry_date) < new Date()) {
      await transaction.rollback();
      return { success: false, message: "Thẻ thành viên đã hết hạn!" };
    }

    // Kiểm tra sách còn sẵn không
    if (book.available_copies <= 0) {
      await transaction.rollback();
      return {
        success: false,
        message: "Sách này hiện đã hết bản sao để mượn!",
      };
    }

    // Kiểm tra số sách đang mượn hiện tại
    const currentLoansCount = await Loan.count({
      where: {
        member_id,
        status: { [Op.in]: ["pending_pickup", "borrowed"] },
      },
    });

    if (currentLoansCount >= LIBRARY_RULES.MAX_BOOKS_PER_MEMBER) {
      await transaction.rollback();
      return {
        success: false,
        message: `Bạn đã đạt giới hạn ${LIBRARY_RULES.MAX_BOOKS_PER_MEMBER} cuốn sách có thể mượn!`,
      };
    }

    // Kiểm tra member đã yêu cầu sách này chưa
    const existingRequest = await Loan.findOne({
      where: {
        member_id,
        book_id,
        status: { [Op.in]: ["pending_pickup", "borrowed"] },
      },
    });

    if (existingRequest) {
      await transaction.rollback();
      return {
        success: false,
        message: "Bạn đã yêu cầu hoặc đang mượn sách này rồi!",
      };
    }

    // Tạo pickup code unique
    let pickupCode;
    let isUnique = false;
    while (!isUnique) {
      pickupCode = generatePickupCode();
      const existingCode = await Loan.findOne({
        where: { pickup_code: pickupCode, status: "pending_pickup" },
      });
      if (!existingCode) isUnique = true;
    }

    // Tính ngày hết hạn nhận sách (3 ngày từ khi tạo)
    const holdUntil = new Date();
    holdUntil.setDate(holdUntil.getDate() + LIBRARY_RULES.HOLD_PERIOD_DAYS);

    // Tạo yêu cầu mượn sách với mã nhận sách
    const loanRequest = await Loan.create(
      {
        member_id,
        book_id,
        status: "pending_pickup", // Trạng thái mới: chờ nhận sách
        pickup_code: pickupCode,
        request_date: new Date(),
        hold_until: holdUntil,
        notes: notes,
      },
      { transaction }
    );

    // Giảm số lượng sách có sẵn (giữ chỗ)
    await Book.decrement("available_copies", {
      where: { book_id: book_id },
      transaction,
    });

    await transaction.commit();
    return {
      success: true,
      message: `Yêu cầu mượn sách thành công! Mã nhận sách của bạn là: ${pickupCode}. Vui lòng đưa mã này cho thủ thư để nhận sách trong ${LIBRARY_RULES.HOLD_PERIOD_DAYS} ngày.`,
      loan: loanRequest,
      pickup_code: pickupCode,
    };
  } catch (error) {
    await transaction.rollback();
    return {
      success: false,
      message: "Lỗi khi gửi yêu cầu mượn sách: " + error.message,
    };
  }
};

// === PHASE 2: LIBRARIAN APPROVAL (Thủ thư duyệt) ===

// Admin/Thủ thư duyệt yêu cầu mượn
const approveBookRequest = async (loan_id, admin_id, notes = "") => {
  const transaction = await sequelize.transaction();
  try {
    const loan = await Loan.findOne({
      where: { loan_id, status: "requested" },
      include: [{ model: Book }, { model: Member }],
    });

    if (!loan) {
      await transaction.rollback();
      return { success: false, message: "Không tìm thấy yêu cầu mượn sách!" };
    }

    // Kiểm tra sách còn sẵn không
    if (loan.Book.available_copies <= 0) {
      await transaction.rollback();
      return {
        success: false,
        message: "Sách này hiện đã hết bản sao để mượn!",
      };
    }

    // Tính ngày hết hạn giữ chỗ (3 ngày từ khi duyệt)
    const holdUntil = new Date();
    holdUntil.setDate(holdUntil.getDate() + LIBRARY_RULES.HOLD_PERIOD_DAYS);

    // Nếu chưa có pickup_code (luồng cũ), phát sinh mã mới
    let pickupCode = loan.pickup_code;
    if (!pickupCode) {
      let unique = false;
      while (!unique) {
        pickupCode = generatePickupCode();
        const exists = await Loan.findOne({
          where: { pickup_code: pickupCode },
        });
        if (!exists) unique = true;
      }
    }

    // Cập nhật trạng thái thành pending_pickup (thay vì approved) để dùng chung workflow
    await loan.update(
      {
        status: "pending_pickup",
        approved_date: new Date(),
        approved_by: admin_id,
        hold_until: holdUntil,
        pickup_code: pickupCode,
        notes: notes,
      },
      { transaction }
    );

    // Giảm số lượng sách có sẵn (giữ chỗ)
    await Book.decrement("available_copies", {
      where: { book_id: loan.book_id },
      transaction,
    });

    await transaction.commit();
    return {
      success: true,
      message: `Đã duyệt yêu cầu. Mã nhận sách: ${pickupCode}. Thành viên có ${LIBRARY_RULES.HOLD_PERIOD_DAYS} ngày để đến nhận sách.`,
      pickup_code: pickupCode,
      loan,
    };
  } catch (error) {
    await transaction.rollback();
    return {
      success: false,
      message: "Lỗi khi duyệt yêu cầu: " + error.message,
    };
  }
};

// Admin từ chối yêu cầu mượn
const rejectBookRequest = async (loan_id, admin_id, rejection_reason) => {
  const transaction = await sequelize.transaction();
  try {
    const loan = await Loan.findOne({
      where: { loan_id, status: "requested" },
    });

    if (!loan) {
      await transaction.rollback();
      return { success: false, message: "Không tìm thấy yêu cầu mượn sách!" };
    }

    await loan.update(
      {
        status: "rejected",
        approved_by: admin_id,
        approved_date: new Date(),
        rejection_reason: rejection_reason,
      },
      { transaction }
    );

    await transaction.commit();
    return {
      success: true,
      message: "Yêu cầu đã bị từ chối.",
      loan: loan,
    };
  } catch (error) {
    await transaction.rollback();
    return {
      success: false,
      message: "Lỗi khi từ chối yêu cầu: " + error.message,
    };
  }
};

// === PHASE 2: PICKUP CODE SYSTEM (Hệ thống mã nhận sách) ===

// Admin xác thực pickup code
const validatePickupCode = async (pickup_code) => {
  try {
    const loan = await Loan.findOne({
      where: {
        pickup_code: pickup_code,
        status: { [Op.in]: ["pending_pickup", "approved", ""] }, // Chấp nhận approved để tương thích
      },
      include: [
        {
          model: Book,
          attributes: ["book_id", "title", "author"],
        },
        {
          model: Member,
          attributes: ["member_id", "member_code"],
        },
      ],
    });

    if (!loan) {
      return {
        valid: false,
        message: "Mã nhận sách không hợp lệ hoặc đã được sử dụng!",
      };
    }

    // Kiểm tra mã có hết hạn không
    if (new Date() > new Date(loan.hold_until)) {
      return {
        valid: false,
        message: "Mã nhận sách đã hết hạn!",
      };
    }

    return {
      valid: true,
      message: "Mã nhận sách hợp lệ!",
      loan: loan,
    };
  } catch (error) {
    return {
      valid: false,
      message: "Lỗi khi xác thực mã: " + error.message,
    };
  }
};

// Admin xác nhận đưa sách cho member bằng pickup code
const confirmPickupWithCode = async (pickup_code, admin_id) => {
  const transaction = await sequelize.transaction();
  try {
    // Validate pickup code trước
    const validation = await validatePickupCode(pickup_code);
    if (!validation.valid) {
      await transaction.rollback();
      return { success: false, message: validation.message };
    }

    const loan = validation.loan;

    // Kiểm tra member chưa vượt quá giới hạn sách
    const member = await Member.findByPk(loan.member_id, { transaction });
    if (!member) {
      await transaction.rollback();
      return {
        success: false,
        message: "Không tìm thấy thông tin thành viên!",
      };
    }

    if (member.current_loans >= LIBRARY_RULES.MAX_BOOKS_PER_MEMBER) {
      await transaction.rollback();
      return {
        success: false,
        message: `Thành viên đã đạt giới hạn ${LIBRARY_RULES.MAX_BOOKS_PER_MEMBER} cuốn sách!`,
      };
    }

    // Tính ngày hết hạn trả sách (10 ngày từ khi nhận)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + LIBRARY_RULES.LOAN_PERIOD_DAYS);

    // Cập nhật trạng thái loan
    await loan.update(
      {
        status: "borrowed",
        loan_date: new Date(),
        due_date: dueDate,
        // Giữ lại pickup_code để sử dụng khi trả sách
      },
      { transaction }
    );

    // QUAN TRỌNG: Tăng số sách đang mượn của member
    await Member.increment("current_loans", {
      where: { member_id: loan.member_id },
      transaction,
    });

    await transaction.commit();
    return {
      success: true,
      message: `Đã xác nhận member nhận sách thành công! Hạn trả: ${dueDate.toLocaleDateString(
        "vi-VN"
      )}`,
      loan: loan,
    };
  } catch (error) {
    await transaction.rollback();
    return {
      success: false,
      message: "Lỗi khi xác nhận nhận sách: " + error.message,
    };
  }
};

// === PHASE 3: BOOK PICKUP (Nhận sách) ===

// Member đến thư viện nhận sách (Admin xác nhận)
const confirmBookPickup = async (loan_id, admin_id) => {
  const transaction = await sequelize.transaction();
  try {
    const loan = await Loan.findOne({
      where: { loan_id, status: { [Op.in]: ["approved", "pending_pickup"] } },
      include: [{ model: Book }, { model: Member }],
    });

    if (!loan) {
      await transaction.rollback();
      return {
        success: false,
        message: "Không tìm thấy yêu cầu đã được duyệt!",
      };
    }

    // Kiểm tra còn trong thời hạn giữ chỗ không
    if (new Date() > loan.hold_until) {
      // Hết hạn giữ chỗ -> hủy yêu cầu và hoàn lại sách
      await loan.update(
        { status: "rejected", rejection_reason: "Hết hạn giữ chỗ" },
        { transaction }
      );
      await Book.increment("available_copies", {
        where: { book_id: loan.book_id },
        transaction,
      });
      await transaction.commit();
      return {
        success: false,
        message: "Đã hết hạn giữ chỗ! Yêu cầu đã bị hủy.",
      };
    }

    // Tính ngày hết hạn trả (10 ngày từ khi nhận)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + LIBRARY_RULES.LOAN_PERIOD_DAYS);

    // Cập nhật trạng thái thành borrowed
    await loan.update(
      {
        status: "borrowed",
        loan_date: new Date(),
        due_date: dueDate,
      },
      { transaction }
    );

    // Tăng số sách đang mượn của member
    await Member.increment("current_loans", {
      where: { member_id: loan.member_id },
      transaction,
    });

    await transaction.commit();
    return {
      success: true,
      message: `Đã xác nhận nhận sách! Hạn trả: ${dueDate.toLocaleDateString(
        "vi-VN"
      )}`,
      loan: loan,
    };
  } catch (error) {
    await transaction.rollback();
    return {
      success: false,
      message: "Lỗi khi xác nhận nhận sách: " + error.message,
    };
  }
};

// === PHASE 4: BOOK RETURN (Trả sách) ===

// Admin xác nhận trả sách
const confirmBookReturn = async (
  loan_id,
  admin_id,
  pickup_code,
  condition_notes = ""
) => {
  const transaction = await sequelize.transaction();
  try {
    const loan = await Loan.findOne({
      where: { loan_id, status: "borrowed" },
      include: [{ model: Book }, { model: Member }],
    });

    if (!loan) {
      await transaction.rollback();
      return { success: false, message: "Không tìm thấy thông tin mượn sách!" };
    }

    // Kiểm tra pickup_code khớp
    if (pickup_code && loan.pickup_code && loan.pickup_code !== pickup_code) {
      await transaction.rollback();
      return { success: false, message: "Mã nhận sách không khớp!" };
    }

    const returnDate = new Date();
    let fine_amount = 0;

    // Tính tiền phạt nếu trả trễ
    if (returnDate > loan.due_date) {
      const daysLate = Math.ceil(
        (returnDate - loan.due_date) / (1000 * 60 * 60 * 24)
      );
      fine_amount = daysLate * LIBRARY_RULES.FINE_PER_DAY;
    }

    // Cập nhật trạng thái trả sách
    await loan.update(
      {
        status: "returned",
        return_date: returnDate,
        fine_amount: fine_amount,
        returned: true,
        notes: condition_notes,
      },
      { transaction }
    );

    // Tăng số lượng sách có sẵn
    await Book.increment("available_copies", {
      where: { book_id: loan.book_id },
      transaction,
    });

    // Giảm số sách đang mượn của member nhưng không nhỏ hơn 0
    const member = await Member.findByPk(loan.member_id, { transaction });
    if (member && member.current_loans > 0) {
      await Member.decrement("current_loans", {
        where: { member_id: loan.member_id },
        transaction,
      });
    }

    await transaction.commit();
    return {
      success: true,
      message:
        fine_amount > 0
          ? `Sách đã được trả! Tiền phạt: ${fine_amount.toLocaleString(
              "vi-VN"
            )} VND`
          : "Sách đã được trả thành công!",
      fine_amount,
      loan: loan,
    };
  } catch (error) {
    await transaction.rollback();
    return {
      success: false,
      message: "Lỗi khi xác nhận trả sách: " + error.message,
    };
  }
};

// === RENEWAL SYSTEM (Hệ thống gia hạn) ===

// Member yêu cầu gia hạn
const requestRenewal = async (loan_id) => {
  const transaction = await sequelize.transaction();
  try {
    const loan = await Loan.findOne({
      where: { loan_id, status: "borrowed" },
      include: [{ model: Book }],
    });

    if (!loan) {
      await transaction.rollback();
      return { success: false, message: "Không tìm thấy thông tin mượn sách!" };
    }

    // Kiểm tra đã gia hạn tối đa chưa
    if (loan.renew_count >= LIBRARY_RULES.MAX_RENEWALS) {
      await transaction.rollback();
      return {
        success: false,
        message: `Đã đạt giới hạn ${LIBRARY_RULES.MAX_RENEWALS} lần gia hạn!`,
      };
    }

    // Kiểm tra có yêu cầu gia hạn đang chờ không
    if (loan.renewal_status === "requested") {
      await transaction.rollback();
      return {
        success: false,
        message: "Đã có yêu cầu gia hạn đang chờ duyệt!",
      };
    }

    // Kiểm tra sách có người đặt trước không
    const pendingRequests = await Loan.count({
      where: {
        book_id: loan.book_id,
        status: "requested",
      },
    });

    if (pendingRequests > 0) {
      await transaction.rollback();
      return {
        success: false,
        message: "Không thể gia hạn vì có người đang đặt trước sách này!",
      };
    }

    await loan.update(
      {
        renewal_status: "requested",
      },
      { transaction }
    );

    await transaction.commit();
    return {
      success: true,
      message: "Yêu cầu gia hạn đã được gửi! Vui lòng chờ thủ thư duyệt.",
      loan: loan,
    };
  } catch (error) {
    await transaction.rollback();
    return {
      success: false,
      message: "Lỗi khi yêu cầu gia hạn: " + error.message,
    };
  }
};

// Admin duyệt gia hạn
const approveRenewal = async (loan_id, admin_id) => {
  const transaction = await sequelize.transaction();
  try {
    const loan = await Loan.findOne({
      where: {
        loan_id,
        status: "borrowed",
        renewal_status: "requested",
      },
    });

    if (!loan) {
      await transaction.rollback();
      return { success: false, message: "Không tìm thấy yêu cầu gia hạn!" };
    }

    // Gia hạn thêm 10 ngày
    const newDueDate = new Date(loan.due_date);
    newDueDate.setDate(newDueDate.getDate() + LIBRARY_RULES.LOAN_PERIOD_DAYS);

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
      message: `Gia hạn thành công! Hạn trả mới: ${newDueDate.toLocaleDateString(
        "vi-VN"
      )}`,
      loan: loan,
    };
  } catch (error) {
    await transaction.rollback();
    return {
      success: false,
      message: "Lỗi khi duyệt gia hạn: " + error.message,
    };
  }
};

// Admin từ chối gia hạn
const rejectRenewal = async (loan_id, admin_id, reason) => {
  const transaction = await sequelize.transaction();
  try {
    const loan = await Loan.findOne({
      where: {
        loan_id,
        status: "borrowed",
        renewal_status: "requested",
      },
    });

    if (!loan) {
      await transaction.rollback();
      return { success: false, message: "Không tìm thấy yêu cầu gia hạn!" };
    }

    await loan.update(
      {
        renewal_status: "rejected",
        notes: reason,
      },
      { transaction }
    );

    await transaction.commit();
    return {
      success: true,
      message: "Yêu cầu gia hạn đã bị từ chối.",
      loan: loan,
    };
  } catch (error) {
    await transaction.rollback();
    return {
      success: false,
      message: "Lỗi khi từ chối gia hạn: " + error.message,
    };
  }
};

// === QUERY FUNCTIONS ===

// Lấy danh sách yêu cầu mượn chờ duyệt (cho admin)
const getPendingRequests = async () => {
  try {
    return await Loan.findAll({
      where: { status: "requested" },
      include: [
        {
          model: Member,
          attributes: ["member_code", "user_id"],
          include: [
            {
              model: sequelize.models.User,
              attributes: ["username", "email", "full_name"],
            },
          ],
        },
        { model: Book, attributes: ["title", "author", "isbn"] },
      ],
      order: [["request_date", "ASC"]],
    });
  } catch (error) {
    throw new Error("Lỗi lấy danh sách yêu cầu chờ duyệt: " + error.message);
  }
};

// Lấy danh sách sách đã duyệt chờ nhận (cho admin)
const getApprovedLoans = async () => {
  try {
    return await Loan.findAll({
      where: { status: "approved" },
      include: [
        {
          model: Member,
          attributes: ["member_code"],
          include: [
            {
              model: sequelize.models.User,
              attributes: ["username", "full_name"],
            },
          ],
        },
        { model: Book, attributes: ["title", "author"] },
      ],
      order: [["approved_date", "ASC"]],
    });
  } catch (error) {
    throw new Error("Lỗi lấy danh sách sách chờ nhận: " + error.message);
  }
};

// Lấy danh sách sách đang mượn
const getCurrentLoans = async () => {
  try {
    return await Loan.findAll({
      where: { status: "borrowed" },
      include: [
        {
          model: Member,
          attributes: ["member_code"],
          include: [
            {
              model: sequelize.models.User,
              attributes: ["username", "full_name"],
            },
          ],
        },
        { model: Book, attributes: ["title", "author"] },
      ],
      order: [["due_date", "ASC"]],
    });
  } catch (error) {
    throw new Error("Lỗi lấy danh sách sách đang mượn: " + error.message);
  }
};

// Lấy sách quá hạn
const getOverdueLoans = async () => {
  try {
    const today = new Date();
    return await Loan.findAll({
      where: {
        status: "borrowed",
        due_date: { [Op.lt]: today },
      },
      include: [
        {
          model: Member,
          attributes: ["member_code"],
          include: [
            {
              model: sequelize.models.User,
              attributes: ["username", "full_name", "email"],
            },
          ],
        },
        { model: Book, attributes: ["title", "author"] },
      ],
      order: [["due_date", "ASC"]],
    });
  } catch (error) {
    throw new Error("Lỗi lấy danh sách sách quá hạn: " + error.message);
  }
};

// Lấy yêu cầu gia hạn chờ duyệt
const getPendingRenewals = async () => {
  try {
    return await Loan.findAll({
      where: {
        status: "borrowed",
        renewal_status: "requested",
      },
      include: [
        {
          model: Member,
          attributes: ["member_code"],
          include: [
            {
              model: sequelize.models.User,
              attributes: ["username", "full_name"],
            },
          ],
        },
        { model: Book, attributes: ["title", "author"] },
      ],
      order: [["updated_at", "ASC"]],
    });
  } catch (error) {
    throw new Error("Lỗi lấy danh sách yêu cầu gia hạn: " + error.message);
  }
};

// Lấy lịch sử mượn của member
const getMemberLoanHistory = async (member_id) => {
  try {
    return await Loan.findAll({
      where: { member_id },
      include: [
        {
          model: Book,
          attributes: ["title", "author", "isbn", "cover_image"],
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
      order: [["request_date", "DESC"]],
    });
  } catch (error) {
    throw new Error("Lỗi lấy lịch sử mượn sách: " + error.message);
  }
};

// Lấy sách đang mượn của member
const getMemberCurrentLoans = async (member_id) => {
  try {
    return await Loan.findAll({
      where: {
        member_id,
        status: { [Op.in]: ["pending_pickup", "borrowed"] },
      },
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
      order: [["request_date", "DESC"]],
    });
  } catch (error) {
    throw new Error("Lỗi lấy sách đang mượn: " + error.message);
  }
};

// === BACKWARD COMPATIBILITY ===
// Giữ lại các function cũ để không break existing code

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

// Deprecated functions (for backward compatibility)
const borrowBook = async (member_id, book_id) => {
  console.warn("borrowBook() is deprecated. Use requestBook() instead.");
  return await requestBook(member_id, book_id);
};

const returnBook = async (loan_id) => {
  console.warn("returnBook() is deprecated. Use confirmBookReturn() instead.");
  return {
    success: false,
    message: "Function deprecated. Admin must confirm return.",
  };
};

const getCurrentLoansByMemberId = getMemberCurrentLoans;
const getLoanHistoryByMemberId = getMemberLoanHistory;

// Legacy renewal functions
const requestRenewLoan = requestRenewal;
const approveRenewLoan = approveRenewal;
const rejectRenewLoan = rejectRenewal;

const getLoanByBookId = async (bookId) => {
  try {
    const loan = await Loan.findOne({
      where: { book_id: bookId, status: "borrowed" },
      attributes: ["loan_id", "due_date", "renewal_status", "renew_count"],
    });

    if (!loan)
      return { success: false, message: "Không tìm thấy thông tin mượn sách!" };

    return { success: true, loan };
  } catch (error) {
    throw new Error("Lỗi khi lấy thông tin mượn sách: " + error.message);
  }
};

const getLoanStats = async () => {
  try {
    const totalLoans = await Loan.count();
    const borrowedBooks = await Loan.count({ where: { status: "borrowed" } });
    const overdueBooks = await Loan.count({
      where: {
        status: "borrowed",
        due_date: { [Op.lt]: new Date() },
      },
    });
    const pendingRequests = await Loan.count({
      where: { status: "requested" },
    });

    return {
      success: true,
      stats: {
        totalLoans,
        borrowedBooks,
        overdueBooks,
        pendingRequests,
        returnedBooks: await Loan.count({ where: { status: "returned" } }),
      },
    };
  } catch (error) {
    throw new Error("Lỗi lấy thống kê: " + error.message);
  }
};

// === UTILITY FUNCTIONS ===

// Đồng bộ lại số sách đang mượn của member từ database
const syncMemberCurrentLoans = async (member_id = null) => {
  const transaction = await sequelize.transaction();
  try {
    // Nếu có member_id cụ thể, chỉ sync member đó, ngược lại sync tất cả
    const whereClause = member_id ? { member_id } : {};

    if (member_id) {
      // Sync một member cụ thể
      const actualCurrentLoans = await Loan.count({
        where: {
          member_id,
          status: "borrowed", // Chỉ tính sách đang mượn thực tế
        },
      });

      await Member.update(
        { current_loans: actualCurrentLoans },
        {
          where: { member_id },
          transaction,
        }
      );

      await transaction.commit();
      return {
        success: true,
        message: `Đã đồng bộ member ${member_id}: ${actualCurrentLoans} sách đang mượn`,
        member_id,
        current_loans: actualCurrentLoans,
      };
    } else {
      // Sync tất cả members
      const members = await Member.findAll({ transaction });
      let updated = 0;

      for (const member of members) {
        const actualCurrentLoans = await Loan.count({
          where: {
            member_id: member.member_id,
            status: "borrowed",
          },
        });

        // Chỉ update nếu khác với giá trị hiện tại
        if (member.current_loans !== actualCurrentLoans) {
          await Member.update(
            { current_loans: actualCurrentLoans },
            {
              where: { member_id: member.member_id },
              transaction,
            }
          );
          updated++;
        }
      }

      await transaction.commit();
      return {
        success: true,
        message: `Đã đồng bộ ${updated}/${members.length} thành viên`,
        updated_count: updated,
        total_members: members.length,
      };
    }
  } catch (error) {
    await transaction.rollback();
    return {
      success: false,
      message: "Lỗi khi đồng bộ current_loans: " + error.message,
    };
  }
};

// === DASHBOARD STATISTICS ===
// Tính các chỉ số tổng quan cho trang quản trị
const getLoanStatistics = async () => {
  try {
    const [
      total,
      pendingRequests,
      awaitingPickup,
      borrowedTotal,
      returned,
      rejected,
    ] = await Promise.all([
      Loan.count(),
      Loan.count({ where: { status: "requested" } }),
      Loan.count({ where: { status: "pending_pickup" } }),
      Loan.count({ where: { status: "borrowed" } }),
      Loan.count({ where: { status: "returned" } }),
      Loan.count({ where: { status: "rejected" } }),
    ]);

    // Trong borrowedTotal, tách active vs overdue
    const today = new Date();
    const [overdue] = await Promise.all([
      Loan.count({
        where: {
          status: "borrowed",
          due_date: { [Op.lt]: today },
        },
      }),
    ]);

    const active = borrowedTotal - overdue;

    // Renewal pending: borrowed loans đã yêu cầu gia hạn
    const pendingRenewal = await Loan.count({
      where: {
        status: "borrowed",
        renewal_status: "requested",
      },
    });

    // Tính tỷ lệ % (tránh chia cho 0)
    const overduePercentage = borrowedTotal
      ? parseFloat(((overdue / borrowedTotal) * 100).toFixed(2))
      : 0;
    const completionRate = total
      ? parseFloat(((returned / total) * 100).toFixed(2))
      : 0;

    return {
      success: true,
      statistics: {
        total,
        pendingRequests,
        awaitingPickup,
        active,
        overdue,
        pendingRenewal,
        returned,
        rejected,
        overduePercentage,
        completionRate,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi lấy thống kê: " + error.message,
    };
  }
};

export default {
  // New pickup code workflow functions
  requestBook, // Member yêu cầu + tự động sinh mã
  validatePickupCode, // Admin xác thực mã
  confirmPickupWithCode, // Admin xác nhận đưa sách bằng mã

  // Traditional workflow functions (legacy)
  approveBookRequest,
  rejectBookRequest,
  confirmBookPickup,
  confirmBookReturn,
  requestRenewal,
  approveRenewal,
  rejectRenewal,

  // Query functions
  getPendingRequests,
  getApprovedLoans,
  getCurrentLoans,
  getOverdueLoans,
  getPendingRenewals,
  getMemberLoanHistory,
  getMemberCurrentLoans,

  // Legacy functions (for backward compatibility)
  getAllLoans,
  borrowBook,
  returnBook,
  getCurrentLoansByMemberId,
  getLoanHistoryByMemberId,
  requestRenewLoan,
  approveRenewLoan,
  rejectRenewLoan,
  getLoanByBookId,
  getLoanStats,
  syncMemberCurrentLoans, // NEW, đồng bộ current_loans

  // Constants
  LIBRARY_RULES,
  getLoanStatistics, // NEW, sử dụng cho dashboard admin
};
