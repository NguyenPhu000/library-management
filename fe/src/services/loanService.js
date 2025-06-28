import API from "./api";

const loanService = {
  // =============================================================================
  // PICKUP CODE SYSTEM APIs FOR MEMBERS
  // =============================================================================

  // Lấy danh sách sách đang mượn theo member ID
  async getCurrentLoans(memberId) {
    try {
      const response = await API.get(`/loans/current/${memberId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể lấy danh sách sách mượn."
      );
    }
  },

  // Lấy lịch sử mượn sách của một thành viên
  async getLoanHistory(memberId) {
    try {
      const response = await API.get(`/loans/history/${memberId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể lấy lịch sử mượn sách."
      );
    }
  },

  // Member yêu cầu gia hạn
  async requestRenewLoan(loanId, reason = "") {
    try {
      const response = await API.post(`/loans/renewal/request`, {
        loan_id: loanId,
        reason: reason,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể yêu cầu gia hạn."
      );
    }
  },

  // Yêu cầu mượn sách (Member workflow) - NEW PICKUP CODE SYSTEM
  async requestLoan(memberId, bookId, notes = "") {
    try {
      const response = await API.post(`/loans/request/${memberId}/${bookId}`, {
        notes: notes,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể yêu cầu mượn sách."
      );
    }
  },

  // Lấy sách đang mượn của member (NEW API)
  async getMemberCurrentLoans(memberId) {
    try {
      const response = await API.get(`/loans/member/${memberId}/current`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể lấy danh sách sách mượn."
      );
    }
  },

  // Lấy lịch sử mượn sách của member (NEW API)
  async getMemberLoanHistory(memberId) {
    try {
      const response = await API.get(`/loans/member/${memberId}/history`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể lấy lịch sử mượn sách."
      );
    }
  },

  // === PICKUP CODE FUNCTIONS ===

  // Admin xác thực pickup code
  async validatePickupCode(pickupCode) {
    try {
      const response = await API.post("/loans/admin/validate-pickup-code", {
        pickup_code: pickupCode,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể xác thực mã nhận sách."
      );
    }
  },

  // Admin xác nhận đưa sách bằng pickup code
  async confirmPickupWithCode(pickupCode, adminId) {
    try {
      const response = await API.post("/loans/admin/confirm-pickup-with-code", {
        pickup_code: pickupCode,
        admin_id: adminId,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể xác nhận đưa sách."
      );
    }
  },

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================

  // Tính toán phí phạt cho sách quá hạn
  calculateFine(dueDate, returnDate = new Date()) {
    const due = new Date(dueDate);
    const returned = new Date(returnDate);

    if (returned <= due) return 0;

    const daysLate = Math.ceil((returned - due) / (1000 * 60 * 60 * 24));
    const FINE_PER_DAY = 2000; // 2,000 VND theo business rules

    return daysLate * FINE_PER_DAY;
  },

  // Format thời gian còn lại để trả sách
  formatTimeRemaining(dueDate) {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Quá hạn ${Math.abs(diffDays)} ngày`;
    } else if (diffDays === 0) {
      return "Hết hạn hôm nay";
    } else if (diffDays === 1) {
      return "Còn 1 ngày";
    } else {
      return `Còn ${diffDays} ngày`;
    }
  },

  // Kiểm tra xem loan có thể gia hạn không
  canRenew(loan) {
    // Business rules: Chỉ được gia hạn 1 lần, không có phí phạt
    return loan.renewal_count < 1 && loan.fine_amount === 0;
  },

  // =============================================================================
  // LEGACY COMPATIBILITY - Deprecated methods
  // =============================================================================

  // Legacy methods để backward compatibility
  async getCurrentLoansLegacy(memberId) {
    try {
      const response = await API.get(`/loans/current/${memberId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể lấy danh sách sách mượn."
      );
    }
  },

  async getLoanHistoryLegacy(memberId) {
    try {
      const response = await API.get(`/loans/history/${memberId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể lấy lịch sử mượn sách."
      );
    }
  },
};

export default loanService;
