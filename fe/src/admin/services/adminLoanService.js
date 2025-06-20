import { AdminAPI } from "../../services/api";

const adminLoanService = {
  // Lấy danh sách tất cả lượt mượn sách với phân trang
  getAllLoans: async (page = 1, limit = 10, status = null) => {
    try {
      const params = { page, limit };
      if (status) params.status = status;

      const response = await AdminAPI.get("/loans", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching loans for admin:", error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết của một lượt mượn sách
  getLoanById: async (loanId) => {
    try {
      const response = await AdminAPI.get(`/loans/${loanId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching loan ${loanId} for admin:`, error);
      throw error;
    }
  },

  // Tạo yêu cầu mượn sách mới
  createLoan: async (loanData) => {
    try {
      const response = await AdminAPI.post("/loans", loanData);
      return response.data;
    } catch (error) {
      console.error("Error creating loan for admin:", error);
      throw error;
    }
  },

  // Cập nhật thông tin mượn sách
  updateLoan: async (loanId, loanData) => {
    try {
      const response = await AdminAPI.put(`/loans/${loanId}`, loanData);
      return response.data;
    } catch (error) {
      console.error(`Error updating loan ${loanId} for admin:`, error);
      throw error;
    }
  },

  // Phê duyệt yêu cầu mượn sách
  approveLoan: async (loanId) => {
    try {
      const response = await AdminAPI.patch(`/loans/${loanId}/approve`);
      return response.data;
    } catch (error) {
      console.error(`Error approving loan ${loanId} by admin:`, error);
      throw error;
    }
  },

  // Từ chối yêu cầu mượn sách
  rejectLoan: async (loanId, reason) => {
    try {
      const response = await AdminAPI.patch(`/loans/${loanId}/reject`, {
        reason,
      });
      return response.data;
    } catch (error) {
      console.error(`Error rejecting loan ${loanId} by admin:`, error);
      throw error;
    }
  },

  // Xác nhận trả sách
  confirmReturn: async (loanId, condition) => {
    try {
      const response = await AdminAPI.patch(`/loans/${loanId}/return`, {
        condition,
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error confirming return for loan ${loanId} by admin:`,
        error
      );
      throw error;
    }
  },

  // Gia hạn mượn sách
  extendLoan: async (loanId, dueDate) => {
    try {
      const response = await AdminAPI.patch(`/loans/${loanId}/extend`, {
        dueDate,
      });
      return response.data;
    } catch (error) {
      console.error(`Error extending loan ${loanId} by admin:`, error);
      throw error;
    }
  },

  // Lấy thống kê về mượn sách
  getLoanStats: async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await AdminAPI.get("/loans/stats", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching loan stats for admin:", error);
      throw error;
    }
  },

  // Lấy danh sách sách đang được mượn bởi một người dùng
  getLoansByUser: async (userId) => {
    try {
      const response = await AdminAPI.get(`/loans/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching loans for user ${userId} by admin:`, error);
      throw error;
    }
  },

  // Lấy lịch sử mượn của một cuốn sách
  getLoansByBook: async (bookId) => {
    try {
      const response = await AdminAPI.get(`/loans/book/${bookId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching loan history for book ${bookId} by admin:`,
        error
      );
      throw error;
    }
  },

  // Lấy danh sách sách quá hạn
  getOverdueLoans: async () => {
    try {
      const response = await AdminAPI.get("/loans/overdue");
      return response.data;
    } catch (error) {
      console.error("Error fetching overdue loans for admin:", error);
      throw error;
    }
  },
};

export default adminLoanService;
