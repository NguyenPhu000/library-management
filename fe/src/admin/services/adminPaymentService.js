import { AdminAPI } from "../../services/api";

const adminPaymentService = {
  // Lấy danh sách tất cả thanh toán với phân trang
  getAllPayments: async (page = 1, limit = 10, status = null) => {
    try {
      const params = { page, limit };
      if (status) params.status = status;

      const response = await AdminAPI.get("/payments", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching payments for admin:", error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết của một thanh toán
  getPaymentById: async (paymentId) => {
    try {
      const response = await AdminAPI.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payment ${paymentId} for admin:`, error);
      throw error;
    }
  },

  // Tạo thanh toán mới
  createPayment: async (paymentData) => {
    try {
      const response = await AdminAPI.post("/payments", paymentData);
      return response.data;
    } catch (error) {
      console.error("Error creating payment for admin:", error);
      throw error;
    }
  },

  // Cập nhật thông tin thanh toán
  updatePayment: async (paymentId, paymentData) => {
    try {
      const response = await AdminAPI.put(
        `/payments/${paymentId}`,
        paymentData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating payment ${paymentId} for admin:`, error);
      throw error;
    }
  },

  // Xóa thanh toán
  deletePayment: async (paymentId) => {
    try {
      const response = await AdminAPI.delete(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting payment ${paymentId} for admin:`, error);
      throw error;
    }
  },

  // Xác nhận thanh toán
  confirmPayment: async (paymentId) => {
    try {
      const response = await AdminAPI.patch(`/payments/${paymentId}/confirm`);
      return response.data;
    } catch (error) {
      console.error(`Error confirming payment ${paymentId} by admin:`, error);
      throw error;
    }
  },

  // Hủy thanh toán
  cancelPayment: async (paymentId, reason) => {
    try {
      const response = await AdminAPI.patch(`/payments/${paymentId}/cancel`, {
        reason,
      });
      return response.data;
    } catch (error) {
      console.error(`Error canceling payment ${paymentId} by admin:`, error);
      throw error;
    }
  },

  // Lấy danh sách thanh toán của một người dùng
  getPaymentsByUser: async (userId) => {
    try {
      const response = await AdminAPI.get(`/payments/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching payments for user ${userId} by admin:`,
        error
      );
      throw error;
    }
  },

  // Lấy thống kê về thanh toán
  getPaymentStats: async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await AdminAPI.get("/payments/stats", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching payment stats for admin:", error);
      throw error;
    }
  },

  // Tạo báo cáo thu nhập
  generateIncomeReport: async (year, month) => {
    try {
      const response = await AdminAPI.get("/payments/income-report", {
        params: { year, month },
      });
      return response.data;
    } catch (error) {
      console.error("Error generating income report for admin:", error);
      throw error;
    }
  },
};

export default adminPaymentService;
