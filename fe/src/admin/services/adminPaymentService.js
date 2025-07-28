import { AdminAPI } from "../../services/api";

const adminPaymentService = {
  // Lấy danh sách tất cả thanh toán với phân trang
  getAllPayments: async (page = 1, limit = 10, allParams = {}) => {
    try {
      const { sort, order, ...filters } = allParams; // Destructure sort and order from allParams
      const params = {
        page,
        limit,
        sort, // Pass sort explicitly
        order, // Pass order explicitly
        ...filters, // Pass remaining filters
      };

      const response = await AdminAPI.get("/payments", { params });
      return {
        success: true,
        payments: response.data.payments || response.data,
        currentPage: response.data.currentPage || page,
        totalPages:
          response.data.totalPages ||
          Math.ceil((response.data.totalCount || 0) / limit),
        totalCount: response.data.totalCount || 0,
        limit: response.data.limit || limit,
        offset: response.data.offset || (page - 1) * limit,
      };
    } catch (error) {
      console.error("Error fetching payments for admin:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Lỗi khi tải danh sách thanh toán",
        payments: [],
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: limit,
        offset: 0,
      };
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
  confirmPayment: async (paymentId, data = {}) => {
    try {
      const response = await AdminAPI.patch(
        `/payments/${paymentId}/confirm`,
        data
      );
      return {
        success: true,
        message: response.data.message || "Xác nhận thanh toán thành công",
        payment: response.data.payment,
      };
    } catch (error) {
      console.error(`Error confirming payment ${paymentId} by admin:`, error);
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi khi xác nhận thanh toán",
      };
    }
  },

  // Hủy thanh toán
  cancelPayment: async (paymentId, reason) => {
    try {
      const response = await AdminAPI.patch(`/payments/${paymentId}/cancel`, {
        reason,
      });
      return {
        success: true,
        message: response.data.message || "Hủy thanh toán thành công",
        payment: response.data.payment,
      };
    } catch (error) {
      console.error(`Error canceling payment ${paymentId} by admin:`, error);
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi khi hủy thanh toán",
      };
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
      return {
        success: true,
        stats: response.data.stats || {
          totalRevenue: 0,
          totalPayments: 0,
          pendingPayments: 0,
          completedPayments: 0,
          cashPayments: 0,
          qrPayments: 0,
          monthlyRevenue: 0,
          dailyRevenue: 0,
          averagePayment: 0,
          revenueGrowth: 0,
          monthlyRevenueData: Array(12).fill(0), // Thêm mặc định
          monthlyRevenueLabels: Array(12).fill("T X"), // Thêm mặc định
        },
      };
    } catch (error) {
      console.error("Error fetching payment stats for admin:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Lỗi khi tải thống kê thanh toán",
        stats: {
          totalRevenue: 0,
          totalPayments: 0,
          pendingPayments: 0,
          completedPayments: 0,
          cashPayments: 0,
          qrPayments: 0,
          monthlyRevenue: 0,
          dailyRevenue: 0,
          averagePayment: 0,
          revenueGrowth: 0,
          monthlyRevenueData: Array(12).fill(0), // Thêm mặc định
          monthlyRevenueLabels: Array(12).fill("T X"), // Thêm mặc định
        },
      };
    }
  },

  // Tạo báo cáo thu nhập
  generateIncomeReport: async (year, month) => {
    try {
      const response = await AdminAPI.get("/payments/income-report", {
        params: { year, month },
      });
      return {
        success: true,
        message: "Tạo báo cáo thành công",
        data: response.data,
      };
    } catch (error) {
      console.error("Error generating income report for admin:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Lỗi khi tạo báo cáo thu nhập",
      };
    }
  },
};

export default adminPaymentService;
