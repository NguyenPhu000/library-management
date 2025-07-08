import paymentService from "../services/paymentService.js";

// Lấy danh sách tất cả các payment
// Hàm này lấy tất cả các thanh toán từ dịch vụ paymentService
const getAllPayments = async (_req, res) => {
  try {
    const payments = await paymentService.getAllPayments();
    return res.json({ success: true, payments });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách payments:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Hàm này lấy danh sách thanh toán theo memberId
const getPaymentsByMemberId = async (req, res) => {
  const memberId = req.params.memberId;
  try {
    const payments = await paymentService.getPaymentsByMemberId(memberId);
    res.json(payments);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách thanh toán",
      error: error.message,
    });
  }
};

// Hàm này tạo một thanh toán mới với hỗ trợ QR code
const createPayment = async (req, res) => {
  try {
    const { loan_id, member_id, user_id, amount, payment_method, description } =
      req.body;

    // Validation
    if (!loan_id || !member_id || !amount || !payment_method) {
      return res.status(400).json({
        success: false,
        message:
          "Thiếu thông tin cần thiết: loan_id, member_id, amount, payment_method",
      });
    }

    const result = await paymentService.createPayment({
      loan_id,
      member_id,
      user_id,
      amount,
      payment_method,
      description,
    });

    if (result.success) {
      return res.json({
        success: true,
        message: result.message,
        payment: result.payment,
      });
    }
    return res.status(400).json({ success: false, message: result.message });
  } catch (error) {
    console.error("Lỗi khi tạo payment:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Hàm này xác nhận một thanh toán
const confirmPayment = async (req, res) => {
  let { paymentId, amount } = req.body;
  if (!paymentId && req.params.paymentId) {
    paymentId = req.params.paymentId;
  }

  try {
    const result = await paymentService.confirmPayment(paymentId, amount);

    if (result.success) {
      return res.json({
        success: true,
        message: "Xác nhận thanh toán thành công!",
        payment: result.payment,
      });
    }
    return res.status(400).json({ success: false, message: result.message });
  } catch (error) {
    console.error("Lỗi khi xác nhận payment:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy payment theo ID
const getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu payment ID",
      });
    }

    const result = await paymentService.getPaymentById(paymentId);

    if (result.success) {
      return res.json({
        success: true,
        payment: result.payment,
      });
    }
    return res.status(404).json({ success: false, message: result.message });
  } catch (error) {
    console.error("Lỗi khi lấy payment:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Hủy thanh toán
const cancelPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { reason } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu payment ID",
      });
    }

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Thiếu lý do hủy thanh toán",
      });
    }

    const result = await paymentService.cancelPayment(paymentId, reason);

    if (result.success) {
      return res.json({
        success: true,
        message: "Hủy thanh toán thành công!",
        payment: result.payment,
      });
    }
    return res.status(400).json({ success: false, message: result.message });
  } catch (error) {
    console.error("Lỗi khi hủy payment:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy thống kê thanh toán
const getPaymentStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const result = await paymentService.getPaymentStats(startDate, endDate);

    if (result.success) {
      return res.json({
        success: true,
        stats: result.stats,
      });
    }
    return res.status(400).json({ success: false, message: result.message });
  } catch (error) {
    console.error("Lỗi khi lấy thống kê payment:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo báo cáo thu nhập
const generateIncomeReport = async (req, res) => {
  try {
    const { year, month } = req.query;

    const result = await paymentService.generateIncomeReport(year, month);

    if (result.success) {
      return res.json({
        success: true,
        data: result.data,
      });
    }
    return res.status(400).json({ success: false, message: result.message });
  } catch (error) {
    console.error("Lỗi khi tạo báo cáo thu nhập:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Webhook test endpoint cho test mode
const handleTestWebhook = async (req, res) => {
  try {
    const {
      payment_id,
      status,
      amount,
      transaction_id,
      payment_content,
      bank_account,
      error,
      test_mode,
    } = req.body;

    if (!test_mode) {
      return res.status(400).json({
        success: false,
        message: "This endpoint is only for test mode",
      });
    }

    console.log(`📡 Test webhook received for payment ${payment_id}:`, {
      status,
      amount,
      transaction_id,
      payment_content,
    });

    if (status === "SUCCESS") {
      // Xác nhận thanh toán tự động
      const result = await paymentService.autoConfirmPayment(payment_id, {
        amount,
        transaction_id,
        payment_content,
        bank_account,
        test_mode: true,
      });

      if (result.success) {
        return res.json({
          success: true,
          message: "Test webhook processed successfully",
          payment: result.payment,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }
    } else {
      // Xử lý thanh toán thất bại
      const result = await paymentService.cancelPayment(
        payment_id,
        error || "Payment failed in test"
      );

      return res.json({
        success: true,
        message: "Test webhook processed (payment failed)",
        payment: result.payment,
      });
    }
  } catch (error) {
    console.error("❌ Test webhook error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Webhook thực tế (production)
const handleWebhook = async (req, res) => {
  try {
    // Xác thực secret (nếu cấu hình)
    const configuredSecret = process.env.WEBHOOK_SECRET || "";
    if (configuredSecret) {
      const receivedSecret =
        req.headers["x-webhook-secret"] || req.query.secret;
      if (!receivedSecret || receivedSecret !== configuredSecret) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid webhook secret" });
      }
    }

    const {
      payment_id,
      status,
      amount,
      transaction_id,
      payment_content,
      bank_account,
      error,
    } = req.body;

    // Log webhook
    console.log(`📡 Production webhook received for payment ${payment_id}:`, {
      status,
      amount,
      transaction_id,
      payment_content,
      bank_account,
      error,
    });

    // Chỉ xử lý khi thành công
    if (status === "SUCCESS") {
      const result = await paymentService.autoConfirmPayment(payment_id, {
        amount,
        transaction_id,
        payment_content,
        bank_account,
      });

      if (result.success) {
        return res.json({ success: true, message: result.message });
      }
      return res.status(400).json({ success: false, message: result.message });
    }

    // Nếu thất bại thì log và trả về 200 để tránh retry storm
    console.warn(
      `⚠️ Webhook báo thất bại cho payment ${payment_id}`,
      error || status
    );
    return res.json({ success: true, message: "Webhook received (no action)" });
  } catch (err) {
    console.error("Lỗi xử lý webhook:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Xóa thanh toán
const deletePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu payment ID",
      });
    }

    const result = await paymentService.deletePayment(paymentId);

    if (result.success) {
      return res.json({
        success: true,
        message: result.message,
      });
    }

    return res.status(404).json({ success: false, message: result.message });
  } catch (error) {
    console.error("Lỗi khi xóa payment:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getAllPayments,
  getPaymentsByMemberId,
  createPayment,
  confirmPayment,
  getPaymentById,
  handleTestWebhook,
  handleWebhook,
  cancelPayment,
  getPaymentStats,
  generateIncomeReport,
  deletePayment,
};
