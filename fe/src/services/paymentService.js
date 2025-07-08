import API from "./api";

// Hàm lấy tất cả các khoản thanh toán theo member_id
const getPaymentsByMemberId = async (memberId) => {
  if (!memberId) {
    throw new Error("memberId không hợp lệ.");
  }

  try {
    const response = await API.get(`/payments/memberId/${memberId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      `Lỗi lấy dữ liệu thanh toán theo member_id: ${error.message}`
    );
  }
};

// Hàm tạo một khoản thanh toán mới (hỗ trợ QR code)
const createPayment = async (paymentData) => {
  if (!paymentData) {
    throw new Error("Dữ liệu thanh toán không hợp lệ.");
  }

  try {
    // Backend sẽ tự lấy loan_id, member_id, user_id từ body
    const response = await API.post("/payments/create", paymentData);
    // Trả về object payment (response.data.payment)
    return response.data.payment;
  } catch (error) {
    throw new Error(`Lỗi tạo thanh toán: ${error.message}`);
  }
};

// Hàm lấy thông tin thanh toán theo ID
const getPaymentById = async (paymentId) => {
  if (!paymentId) {
    throw new Error("paymentId không hợp lệ.");
  }

  try {
    const response = await API.get(`/payments/${paymentId}`);
    return response.data.payment;
  } catch (error) {
    throw new Error(`Lỗi lấy dữ liệu thanh toán: ${error.message}`);
  }
};

export { getPaymentsByMemberId, createPayment, getPaymentById };
