import API from "./api"; // Thêm import API

// Lấy tất cả các khoản thanh toán theo member_id
const getPaymentsByMemberId = async (memberId) => {
  if (!memberId) {
    throw new Error("memberId không hợp lệ.");
  }

  try {
    const response = await API.get(`/payments/memberId/${memberId}`); // Gọi API để lấy danh sách thanh toán theo member_id
    return response.data; // Trả về dữ liệu từ phản hồi
  } catch (error) {
    throw new Error(
      `Lỗi lấy dữ liệu thanh toán theo member_id: ${error.message}`
    );
  }
};

// Tạo một khoản thanh toán mới
const createPayment = async (loanId, userId, memberId, paymentData) => {
  if (!loanId || !userId || !memberId || !paymentData) {
    throw new Error("Thiếu thông tin cần thiết.");
  }

  try {
    const response = await API.post(
      `/payments/create/${loanId}/${userId}/${memberId}`,
      paymentData
    ); // Gọi API để tạo thanh toán
    return response.data; // Trả về dữ liệu từ phản hồi
  } catch (error) {
    throw new Error(`Lỗi tạo thanh toán: ${error.message}`);
  }
};

export { getPaymentsByMemberId, createPayment };
