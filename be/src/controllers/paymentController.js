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

// Hàm này tạo một thanh toán mới
const createPayment = async (req, res) => {
  const { loanId, userId, memberId } = req.params;
  const { payment_date, payment_method } = req.body;

  if (!loanId || !userId || !memberId || !payment_date || !payment_method) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu thông tin cần thiết" });
  }

  try {
    const result = await paymentService.createPayment({
      loan_id: loanId,
      user_id: userId,
      member_id: memberId,
      payment_date,
      payment_method,
    });

    if (result.success) {
      return res.json({
        success: true,
        message: "Tạo thanh toán thành công!",
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
  const { paymentId, amount } = req.body;

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

export default {
  getAllPayments,
  getPaymentsByMemberId,
  createPayment,
  confirmPayment,
};
