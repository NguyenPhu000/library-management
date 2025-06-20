import loanService from "../services/loanService.js";

// Hiển thị trang mượn sách
const showLoanPage = async (req, res) => {
  try {
    const loans = await loanService.getAllLoans();
    res.render("loanPage", {
      loans: loans,
      successMessage: req.query.successMessage,
      errorMessage: req.query.errorMessage,
    });
  } catch (error) {
    res.status(500).render("error", { message: error.message });
  }
};

// API lấy tất cả lượt mượn sách
const getAllLoans = async (req, res) => {
  try {
    const loans = await loanService.getAllLoans();
    res.json(loans);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// API mượn sách
const borrowBook = async (req, res) => {
  try {
    const { memberId, bookId } = req.params;

    if (!memberId || !bookId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin member_id hoặc book_id",
      });
    }

    const result = await loanService.borrowBook(memberId, bookId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.json({
      success: true,
      message: "Mượn sách thành công",
      loan: result.loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi trong quá trình mượn sách: " + error.message,
    });
  }
};

// API trả sách
const returnBook = async (req, res) => {
  try {
    const { loan_id } = req.body;

    if (!loan_id) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin loan_id",
      });
    }

    const result = await loanService.returnBook(loan_id);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.json({
      success: true,
      message: "Trả sách thành công",
      loan: result.loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi trong quá trình trả sách: " + error.message,
    });
  }
};

// API lấy sách đang mượn
const getCurrentLoans = async (req, res) => {
  try {
    const memberId = req.params.memberId;

    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin member_id",
      });
    }

    const loans = await loanService.getCurrentLoansByMemberId(memberId);

    return res.json(loans);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi trong quá trình lấy sách đang mượn: " + error.message,
    });
  }
};

// API lấy lịch sử mượn sách
const getLoanHistory = async (req, res) => {
  try {
    const memberId = req.params.memberId;

    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin member_id",
      });
    }

    const history = await loanService.getLoanHistoryByMemberId(memberId);

    return res.json(history);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi trong quá trình lấy lịch sử mượn sách: " + error.message,
    });
  }
};

// API yêu cầu gia hạn
const requestRenewLoan = async (req, res) => {
  try {
    const { loan_id } = req.body;

    if (!loan_id) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin loan_id",
      });
    }

    const result = await loanService.requestRenewLoan(loan_id);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.json({
      success: true,
      message: "Yêu cầu gia hạn thành công",
      loan: result.loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi trong quá trình yêu cầu gia hạn: " + error.message,
    });
  }
};

// API duyệt yêu cầu gia hạn
const approveRenewLoan = async (req, res) => {
  try {
    const { loan_id } = req.body;

    if (!loan_id) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin loan_id",
      });
    }

    const result = await loanService.approveRenewLoan(loan_id);

    if (!result || !result.success) {
      return res.status(400).json({
        success: false,
        message: result?.message || "Không thể duyệt yêu cầu gia hạn",
      });
    }

    return res.json({
      success: true,
      message: "Duyệt gia hạn thành công",
      loan: result.loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi trong quá trình duyệt gia hạn: " + error.message,
    });
  }
};

export default {
  showLoanPage,
  getAllLoans,
  borrowBook,
  returnBook,
  getCurrentLoans,
  getLoanHistory,
  requestRenewLoan,
  approveRenewLoan,
};
