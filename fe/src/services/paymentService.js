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

// Hàm tạo một khoản thanh toán mới
const createPayment = async (loanId, userId, memberId, paymentData) => {
  if (!loanId || !userId || !memberId || !paymentData) {
    throw new Error("Thiếu thông tin cần thiết.");
  }

  try {
    const response = await API.post(
      `/payments/create/${loanId}/${userId}/${memberId}`,
      paymentData
    );
    return response.data;
  } catch (error) {
    throw new Error(`Lỗi tạo thanh toán: ${error.message}`);
  }
};

export { getPaymentsByMemberId, createPayment };
