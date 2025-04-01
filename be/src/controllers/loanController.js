import loanService from "../services/loanService.js";

// Lấy tất cả các khoản vay
const getAllLoans = async (req, res) => {
  try {
    let loans = await loanService.getAllLoans();
    if (req.headers.accept?.includes("application/json")) {
      return res.json({ success: true, data: loans });
    }
    res.render("loanPage", {
      dataTable: loans,
      successMessage: req.query.successMessage || null,
      errorMessage: req.query.errorMessage || null,
    });
  } catch (error) {
    res.status(500).json({
      error: "Không thể lấy danh sách mượn sách",
      error: error.message,
    });
  }
};

// Mượn sách
const borrowBook = async (req, res) => {
  try {
    const member_id = req.params.memberId;
    const book_id = req.params.bookId;
    let result = await loanService.borrowBook(member_id, book_id);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Mượn sách thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi mượn sách:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi mượn sách. Vui lòng thử lại sau.",
    });
  }
};

// Trả sách
const returnBook = async (req, res) => {
  try {
    let result = await loanService.returnBook(req.body.loan_id);

    if (!result.success) {
      return res.redirect(
        `/api/loans?errorMessage=${encodeURIComponent(result.message)}`
      );
    }

    res.redirect("/api/loans?successMessage=Trả sách thành công!");
  } catch (error) {
    res.redirect(
      `/api/loans?errorMessage=Lỗi khi trả sách: ${encodeURIComponent(
        error.message
      )}`
    );
  }
};

//  Lấy danh sách loan chưa trả
const getCurrentLoans = async (req, res) => {
  try {
    const { memberId } = req.params;

    if (!memberId) {
      return res.status(400).json({ message: "Thiếu memberId!" });
    }

    let result = await loanService.getLoansByMemberId(memberId);

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    res.status(200).json(result.loans);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách loan!", error: error.message });
  }
};

//  Yêu cầu gia hạn sách
const requestRenewLoan = async (req, res) => {
  try {
    let result = await loanService.requestRenewLoan(req.body.loan_id);

    if (!result.success) {
      return res.redirect(
        `/api/loans?errorMessage=${encodeURIComponent(result.message)}`
      );
    }

    res.redirect(
      `/api/loans?successMessage=${encodeURIComponent(result.message)}`
    );
  } catch (error) {
    res.redirect(
      `/api/loans?errorMessage=Lỗi khi yêu cầu gia hạn: ${encodeURIComponent(
        error.message
      )}`
    );
  }
};

// Phê duyệt yêu cầu gia hạn
const approveRenewLoan = async (req, res) => {
  try {
    const { loan_id, action } = req.body;
    let result = await loanService.approveRenewLoan(
      loan_id,
      action === "approve"
    );

    if (!result.success) {
      return res.redirect(
        `/api/loans?errorMessage=${encodeURIComponent(result.message)}`
      );
    }

    res.redirect(
      `/api/loans?successMessage=${encodeURIComponent(result.message)}`
    );
  } catch (error) {
    res.redirect(
      `/api/loans?errorMessage=Lỗi khi xử lý yêu cầu gia hạn: ${encodeURIComponent(
        error.message
      )}`
    );
  }
};

// Lấy lịch sử mượn sách
const getLoanHistory = async (req, res) => {
  try {
    const { memberId } = req.params;
    if (!memberId) return res.status(400).json({ message: "Thiếu memberId!" });

    let result = await loanService.getLoanHistory(memberId);

    if (!result.success)
      return res.status(404).json({ message: result.message });

    res.status(200).json(result.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy lịch sử mượn!", error: error.message });
  }
};

export default {
  getAllLoans,
  borrowBook,
  returnBook,
  getCurrentLoans,
  requestRenewLoan,
  approveRenewLoan,
  getLoanHistory,
};
