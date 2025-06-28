import loanService from "../services/loanService.js";

// === MEMBER FUNCTIONS ===

// Member yêu cầu mượn sách
const requestBook = async (req, res) => {
  try {
    const { memberId, bookId } = req.params;
    const { notes } = req.body;

    if (!memberId || !bookId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin member_id hoặc book_id",
      });
    }

    const result = await loanService.requestBook(memberId, bookId, notes);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.json({
      success: true,
      message: result.message,
      loan: result.loan,
      pickup_code: result.pickup_code,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi trong quá trình yêu cầu mượn sách: " + error.message,
    });
  }
};

// Member yêu cầu gia hạn
const requestRenewal = async (req, res) => {
  try {
    const { loan_id } = req.body;

    if (!loan_id) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin loan_id",
      });
    }

    const result = await loanService.requestRenewal(loan_id);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.json({
      success: true,
      message: result.message,
      loan: result.loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi trong quá trình yêu cầu gia hạn: " + error.message,
    });
  }
};

// Lấy sách đang mượn của member
const getMemberCurrentLoans = async (req, res) => {
  try {
    const memberId = req.params.memberId;

    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin member_id",
      });
    }

    const loans = await loanService.getMemberCurrentLoans(memberId);

    return res.json({
      success: true,
      loans: loans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi trong quá trình lấy sách đang mượn: " + error.message,
    });
  }
};

// Lấy lịch sử mượn sách của member
const getMemberLoanHistory = async (req, res) => {
  try {
    const memberId = req.params.memberId;

    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin member_id",
      });
    }

    const history = await loanService.getMemberLoanHistory(memberId);

    return res.json({
      success: true,
      history: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi trong quá trình lấy lịch sử mượn sách: " + error.message,
    });
  }
};

// === PICKUP CODE FUNCTIONS ===

// Admin xác thực pickup code
const validatePickupCode = async (req, res) => {
  try {
    const { pickup_code } = req.body;

    if (!pickup_code) {
      return res.status(400).json({
        success: false,
        message: "Thiếu mã nhận sách",
      });
    }

    const result = await loanService.validatePickupCode(pickup_code);

    return res.json({
      success: result.valid,
      message: result.message,
      loan: result.loan || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi khi xác thực mã nhận sách: " + error.message,
    });
  }
};

// Admin xác nhận đưa sách cho member bằng pickup code
const confirmPickupWithCode = async (req, res) => {
  try {
    const { pickup_code, admin_id } = req.body;

    if (!pickup_code || !admin_id) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin pickup_code hoặc admin_id",
      });
    }

    const result = await loanService.confirmPickupWithCode(
      pickup_code,
      admin_id
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.json({
      success: true,
      message: result.message,
      loan: result.loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi khi xác nhận nhận sách: " + error.message,
    });
  }
};

// === ADMIN FUNCTIONS ===

// Admin lấy danh sách yêu cầu mượn chờ duyệt
const getPendingRequests = async (req, res) => {
  try {
    const requests = await loanService.getPendingRequests();
    return res.json({
      success: true,
      requests: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi khi lấy danh sách yêu cầu chờ duyệt: " + error.message,
    });
  }
};

// Admin duyệt yêu cầu mượn sách
const approveBookRequest = async (req, res) => {
  try {
    const { loan_id, admin_id, notes } = req.body;

    if (!loan_id || !admin_id) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin loan_id hoặc admin_id",
      });
    }

    const result = await loanService.approveBookRequest(
      loan_id,
      admin_id,
      notes
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.json({
      success: true,
      message: result.message,
      loan: result.loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi trong quá trình duyệt yêu cầu: " + error.message,
    });
  }
};

// Admin từ chối yêu cầu mượn sách
const rejectBookRequest = async (req, res) => {
  try {
    const { loan_id, admin_id, rejection_reason } = req.body;

    if (!loan_id || !admin_id || !rejection_reason) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin loan_id, admin_id hoặc lý do từ chối",
      });
    }

    const result = await loanService.rejectBookRequest(
      loan_id,
      admin_id,
      rejection_reason
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.json({
      success: true,
      message: result.message,
      loan: result.loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi trong quá trình từ chối yêu cầu: " + error.message,
    });
  }
};

// Admin lấy danh sách sách đã duyệt chờ nhận
const getApprovedLoans = async (req, res) => {
  try {
    const loans = await loanService.getApprovedLoans();
    return res.json({
      success: true,
      loans: loans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi khi lấy danh sách sách chờ nhận: " + error.message,
    });
  }
};

// Admin xác nhận member nhận sách
const confirmBookPickup = async (req, res) => {
  try {
    const { loan_id, admin_id } = req.body;

    if (!loan_id || !admin_id) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin loan_id hoặc admin_id",
      });
    }

    const result = await loanService.confirmBookPickup(loan_id, admin_id);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.json({
      success: true,
      message: result.message,
      loan: result.loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi trong quá trình xác nhận nhận sách: " + error.message,
    });
  }
};

// Admin lấy danh sách sách đang mượn
const getCurrentLoansAdmin = async (req, res) => {
  try {
    const loans = await loanService.getCurrentLoans();
    return res.json({
      success: true,
      loans: loans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi khi lấy danh sách sách đang mượn: " + error.message,
    });
  }
};

// Admin lấy danh sách sách quá hạn
const getOverdueLoans = async (req, res) => {
  try {
    const loans = await loanService.getOverdueLoans();
    return res.json({
      success: true,
      loans: loans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi khi lấy danh sách sách quá hạn: " + error.message,
    });
  }
};

// Admin xác nhận trả sách
const confirmBookReturn = async (req, res) => {
  try {
    const { loan_id, admin_id, pickup_code, condition_notes } = req.body;

    if (!loan_id || !admin_id) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin loan_id hoặc admin_id",
      });
    }

    const result = await loanService.confirmBookReturn(
      loan_id,
      admin_id,
      pickup_code,
      condition_notes
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.json({
      success: true,
      message: result.message,
      fine_amount: result.fine_amount,
      loan: result.loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi trong quá trình xác nhận trả sách: " + error.message,
    });
  }
};

// Admin lấy danh sách yêu cầu gia hạn chờ duyệt
const getPendingRenewals = async (req, res) => {
  try {
    const renewals = await loanService.getPendingRenewals();
    return res.json({
      success: true,
      renewals: renewals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi khi lấy danh sách yêu cầu gia hạn: " + error.message,
    });
  }
};

// Admin duyệt gia hạn
const approveRenewal = async (req, res) => {
  try {
    const { loan_id, admin_id } = req.body;

    if (!loan_id || !admin_id) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin loan_id hoặc admin_id",
      });
    }

    const result = await loanService.approveRenewal(loan_id, admin_id);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.json({
      success: true,
      message: result.message,
      loan: result.loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi trong quá trình duyệt gia hạn: " + error.message,
    });
  }
};

// Admin từ chối gia hạn
const rejectRenewal = async (req, res) => {
  try {
    const { loan_id, admin_id, reason } = req.body;

    if (!loan_id || !admin_id || !reason) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin loan_id, admin_id hoặc lý do từ chối",
      });
    }

    const result = await loanService.rejectRenewal(loan_id, admin_id, reason);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.json({
      success: true,
      message: result.message,
      loan: result.loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi trong quá trình từ chối gia hạn: " + error.message,
    });
  }
};

// === LEGACY FUNCTIONS (for backward compatibility) ===

// GET /api/loans
const listLoans = async (_req, res) => {
  try {
    const loans = await loanService.getAllLoans();
    return res.json({ success: true, loans });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách loan:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// API lấy tất cả lượt mượn sách
const getAllLoans = async (req, res) => {
  try {
    const loans = await loanService.getAllLoans();
    res.json({ success: true, loans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Deprecated - API mượn sách (chuyển thành yêu cầu mượn)
const borrowBook = async (req, res) => {
  console.warn(
    "borrowBook() endpoint is deprecated. Use requestBook() instead."
  );
  return await requestBook(req, res);
};

// Deprecated - API trả sách (yêu cầu admin xác nhận)
const returnBook = async (req, res) => {
  console.warn(
    "returnBook() endpoint is deprecated. Admin must confirm return."
  );
  return res.status(400).json({
    success: false,
    message:
      "Chức năng này đã được thay đổi. Vui lòng liên hệ thủ thư để trả sách.",
  });
};

// API lấy sách đang mượn (backward compatibility)
const getCurrentLoans = async (req, res) => {
  try {
    const memberId = req.params.memberId;

    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin member_id",
      });
    }

    const loans = await loanService.getMemberCurrentLoans(memberId);

    return res.json({
      success: true,
      loans: loans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi trong quá trình lấy sách đang mượn: " + error.message,
    });
  }
};

// API lấy lịch sử mượn sách (backward compatibility)
const getLoanHistory = async (req, res) => {
  try {
    const memberId = req.params.memberId;

    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin member_id",
      });
    }

    const history = await loanService.getMemberLoanHistory(memberId);

    return res.json({
      success: true,
      history: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi trong quá trình lấy lịch sử mượn sách: " + error.message,
    });
  }
};

// API yêu cầu gia hạn (backward compatibility)
const requestRenewLoan = async (req, res) => {
  return await requestRenewal(req, res);
};

// API duyệt yêu cầu gia hạn (backward compatibility)
const approveRenewLoan = async (req, res) => {
  return await approveRenewal(req, res);
};

// API từ chối gia hạn (backward compatibility)
const rejectRenewLoan = async (req, res) => {
  return await rejectRenewal(req, res);
};

const getLoanByBookId = async (req, res) => {
  try {
    const bookId = req.params.bookId;

    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin book_id",
      });
    }

    const result = await loanService.getLoanByBookId(bookId);

    return res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Có lỗi trong quá trình lấy thông tin mượn sách: " + error.message,
    });
  }
};

const getLoanStats = async (req, res) => {
  try {
    const stats = await loanService.getLoanStats();
    return res.json(stats);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi khi lấy thống kê: " + error.message,
    });
  }
};

// Lấy thống kê tổng quan cho admin dashboard - NEW
const getLoanStatistics = async (req, res) => {
  try {
    const result = await loanService.getLoanStatistics();

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.json({
      success: true,
      statistics: result.statistics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi khi lấy thống kê: " + error.message,
    });
  }
};

export default {
  // New pickup code workflow endpoints
  requestBook, // POST /api/loans/request/:memberId/:bookId - Tự động sinh mã
  validatePickupCode, // POST /api/loans/admin/validate-pickup-code
  confirmPickupWithCode, // POST /api/loans/admin/confirm-pickup-with-code
  requestRenewal, // POST /api/loans/renewal/request
  getMemberCurrentLoans, // GET /api/loans/member/:memberId/current
  getMemberLoanHistory, // GET /api/loans/member/:memberId/history

  // Traditional admin endpoints
  getPendingRequests, // GET /api/loans/admin/pending-requests
  approveBookRequest, // POST /api/loans/admin/approve-request
  rejectBookRequest, // POST /api/loans/admin/reject-request
  getApprovedLoans, // GET /api/loans/admin/approved
  confirmBookPickup, // POST /api/loans/admin/confirm-pickup
  getCurrentLoansAdmin, // GET /api/loans/admin/current
  getOverdueLoans, // GET /api/loans/admin/overdue
  confirmBookReturn, // POST /api/loans/admin/confirm-return
  getPendingRenewals, // GET /api/loans/admin/pending-renewals
  approveRenewal, // POST /api/loans/admin/approve-renewal
  rejectRenewal, // POST /api/loans/admin/reject-renewal

  // Statistics
  getLoanStatistics, // NEW

  // Legacy endpoints (for backward compatibility)
  listLoans,
  getAllLoans,
  borrowBook, // Deprecated
  returnBook, // Deprecated
  getCurrentLoans, // Deprecated - use getMemberCurrentLoans
  getLoanHistory, // Deprecated - use getMemberLoanHistory
  requestRenewLoan, // Deprecated - use requestRenewal
  approveRenewLoan, // Deprecated - use approveRenewal
  rejectRenewLoan, // Deprecated - use rejectRenewal
  getLoanByBookId,
  getLoanStats,
};
