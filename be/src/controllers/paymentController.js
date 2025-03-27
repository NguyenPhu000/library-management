import paymentService from "../services/paymentService";

// Lấy danh sách tất cả các payment
const getAllPayments = async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();

    if (req.headers.accept?.includes("application/json")) {
      return res.json({ success: true, data: payments }); // Xuất ra json
    }
    res.render("paymentPage", { dataTable: payments }); // Xuất ra file ejs
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách thanh toán",
      error: error.message,
    });
  }
};

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

const createPayment = async (req, res) => {
  const { loanId, userId, memberId } = req.params;
  const { payment_date, payment_method } = req.body;

  if (!loanId || !userId || !memberId || !payment_date || !payment_method) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu thông tin cần thiết." });
  }

  try {
    const result = await paymentService.createPayment({
      loan_id: loanId,
      user_id: userId,
      member_id: memberId,
      payment_date,
      payment_method,
    });
    return res.status(result.success ? 201 : 500).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Không thể tạo thanh toán",
      error: error.message,
    });
  }
};

const confirmPayment = async (req, res) => {
  const { paymentId, amount } = req.body;
  console.log(paymentId, amount);
  try {
    const result = await paymentService.confirmPayment(paymentId, amount);
    console.log(result);
    return res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Không thể xác nhận thanh toán",
      error: error.message,
    });
  }
};

export default {
  getAllPayments,
  getPaymentsByMemberId,
  createPayment,
  confirmPayment,
};
