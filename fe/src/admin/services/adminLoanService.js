import API from "../../services/api";

const adminLoanService = {
  // =============================================================================
  // PICKUP CODE SYSTEM - ADMIN APIs
  // =============================================================================

  // Lấy danh sách tất cả loans (với pagination)
  getAllLoans: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.overdue) params.append("overdue", "true");
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      const response = await API.get(`/loans/all?${params.toString()}`);
      return {
        loans: response.data.loans || response.data.data || response.data,
        pagination: response.data.pagination,
        success: response.data.success !== false,
      };
    } catch (error) {
      console.error("Error fetching loans for admin:", error);
      throw error;
    }
  },

  // === PICKUP CODE FUNCTIONS ===

  // Admin xác thực pickup code
  validatePickupCode: async (pickupCode) => {
    try {
      const response = await API.post("/loans/admin/validate-pickup-code", {
        pickup_code: pickupCode,
      });
      return response.data;
    } catch (error) {
      console.error("Error validating pickup code:", error);
      throw error;
    }
  },

  // Admin xác nhận đưa sách bằng pickup code
  confirmPickupWithCode: async (pickupCode, adminId) => {
    try {
      const response = await API.post("/loans/admin/confirm-pickup-with-code", {
        pickup_code: pickupCode,
        admin_id: adminId,
      });
      return response.data;
    } catch (error) {
      console.error("Error confirming pickup with code:", error);
      throw error;
    }
  },

  // === TRADITIONAL ADMIN WORKFLOWS ===

  // Lấy danh sách yêu cầu mượn chờ duyệt
  getPendingLoanRequests: async () => {
    try {
      const response = await API.get("/loans/admin/pending-requests");
      return response.data;
    } catch (error) {
      console.error("Error fetching pending loan requests:", error);
      throw error;
    }
  },

  // Admin duyệt yêu cầu mượn sách
  approveLoanRequest: async (loanId, adminId) => {
    try {
      const response = await API.post("/loans/admin/approve-request", {
        loan_id: loanId,
        admin_id: adminId,
        approval: true,
      });
      return response.data;
    } catch (error) {
      console.error(`Error approving loan request ${loanId}:`, error);
      throw error;
    }
  },

  // Admin từ chối yêu cầu mượn sách
  rejectLoanRequest: async (loanId, adminId, reason = "") => {
    try {
      const response = await API.post("/loans/admin/reject-request", {
        loan_id: loanId,
        admin_id: adminId,
        approval: false,
        reason: reason,
      });
      return response.data;
    } catch (error) {
      console.error(`Error rejecting loan request ${loanId}:`, error);
      throw error;
    }
  },

  // Lấy danh sách sách đã duyệt chờ nhận
  getApprovedLoans: async () => {
    try {
      const response = await API.get("/loans/admin/approved");
      return response.data;
    } catch (error) {
      console.error("Error fetching approved loans:", error);
      throw error;
    }
  },

  // Admin xác nhận member nhận sách
  confirmBookPickup: async (loanId, adminId) => {
    try {
      const response = await API.post("/loans/admin/confirm-pickup", {
        loan_id: loanId,
        admin_id: adminId,
      });
      return response.data;
    } catch (error) {
      console.error(`Error confirming pickup for loan ${loanId}:`, error);
      throw error;
    }
  },

  // Lấy danh sách sách đang mượn
  getCurrentLoansAdmin: async () => {
    try {
      const response = await API.get("/loans/admin/current");
      return response.data;
    } catch (error) {
      console.error("Error fetching current loans:", error);
      throw error;
    }
  },

  // Lấy danh sách sách quá hạn
  getOverdueLoans: async () => {
    try {
      const response = await API.get("/loans/admin/overdue");
      return response.data;
    } catch (error) {
      console.error("Error fetching overdue loans:", error);
      throw error;
    }
  },

  // Admin xác nhận trả sách
  confirmBookReturn: async (
    loanId,
    adminId,
    condition = "good",
    pickupCode = ""
  ) => {
    try {
      const response = await API.post("/loans/admin/confirm-return", {
        loan_id: loanId,
        admin_id: adminId,
        condition_notes: condition,
        pickup_code: pickupCode,
      });
      return response.data;
    } catch (error) {
      console.error(`Error confirming return for loan ${loanId}:`, error);
      throw error;
    }
  },

  // === RENEWAL WORKFLOWS ===

  // Lấy danh sách yêu cầu gia hạn chờ duyệt
  getPendingRenewalRequests: async () => {
    try {
      const response = await API.get("/loans/admin/pending-renewals");
      return response.data;
    } catch (error) {
      console.error("Error fetching pending renewal requests:", error);
      throw error;
    }
  },

  // Admin duyệt gia hạn
  approveRenewal: async (loanId, adminId) => {
    try {
      const response = await API.post("/loans/admin/approve-renewal", {
        loan_id: loanId,
        admin_id: adminId,
        approval: true,
      });
      return response.data;
    } catch (error) {
      console.error(`Error approving renewal for loan ${loanId}:`, error);
      throw error;
    }
  },

  // Admin từ chối gia hạn
  rejectRenewal: async (loanId, adminId, reason = "") => {
    try {
      const response = await API.post("/loans/admin/reject-renewal", {
        loan_id: loanId,
        admin_id: adminId,
        approval: false,
        reason: reason,
      });
      return response.data;
    } catch (error) {
      console.error(`Error rejecting renewal for loan ${loanId}:`, error);
      throw error;
    }
  },

  // === MEMBER QUERIES FOR ADMIN ===

  // Lấy danh sách sách đang được mượn bởi một thành viên
  getCurrentLoansByMember: async (memberId) => {
    try {
      const response = await API.get(`/loans/member/${memberId}/current`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching current loans for member ${memberId}:`,
        error
      );
      throw error;
    }
  },

  // Lấy lịch sử mượn của một thành viên
  getLoanHistoryByMember: async (memberId) => {
    try {
      const response = await API.get(`/loans/member/${memberId}/history`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching loan history for member ${memberId}:`,
        error
      );
      throw error;
    }
  },

  // === STATISTICS ===

  // Lấy thống kê loan
  getLoanStats: async () => {
    try {
      const response = await API.get("/loans/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching loan stats:", error);
      throw error;
    }
  },

  // Lấy thống kê tổng quan
  getLoanStatistics: async () => {
    try {
      const response = await API.get("/loans/admin/statistics");
      return response.data;
    } catch (error) {
      console.error("Error fetching loan statistics:", error);
      throw error;
    }
  },

  // =============================================================================
  // BACKWARD COMPATIBILITY - Legacy APIs (will be deprecated)
  // =============================================================================

  // Legacy methods để tương thích với code cũ
  getLegacyLoans: async () => {
    try {
      // Sử dụng API hiện có thay vì endpoint cũ
      const enhanced = await adminLoanService.getAllLoans();
      return enhanced.loans;
    } catch (error) {
      console.warn("Legacy loan API failed, using current API");
      throw error;
    }
  },

  // Legacy approval function
  approveLoan: async (loanId, adminId, approval = true, reason = "") => {
    if (approval) {
      return await adminLoanService.approveLoanRequest(loanId, adminId);
    } else {
      return await adminLoanService.rejectLoanRequest(loanId, adminId, reason);
    }
  },

  // Legacy return confirmation
  returnBook: async (loanId, adminId, condition = "good") => {
    return await adminLoanService.confirmBookReturn(loanId, adminId, condition);
  },
};

export default adminLoanService;
