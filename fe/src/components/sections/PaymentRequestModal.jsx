import React, { useState } from "react";
import Modal from "react-modal";
import { usePayment } from "../../contexts/PaymentContext"; // Import usePayment để sử dụng context

const PaymentRequestModal = ({ isOpen, onRequestClose, loanId }) => {
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [paymentMethod, setPaymentMethod] = useState("OFFLINE");

  const { handleCreatePayment, isPaymentExists } = usePayment(); // Lấy hàm tạo thanh toán và kiểm tra từ context

  // Kiểm tra nếu thanh toán đã tồn tại
  if (isPaymentExists(loanId)) {
    console.log(
      "Thanh toán đã tồn tại cho khoản vay này. Không hiển thị modal."
    );
    return null; // Không hiển thị modal nếu thanh toán đã tồn tại
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const paymentData = {
      payment_date: paymentDate,
      payment_method: paymentMethod,
    };

    // Kiểm tra dữ liệu thanh toán trước khi gọi hàm tạo thanh toán
    if (!paymentData.payment_date || !paymentData.payment_method) {
      console.error("Dữ liệu thanh toán không hợp lệ:", paymentData);
      return; // Ngừng thực hiện nếu dữ liệu không hợp lệ
    }

    try {
      const newPayment = await handleCreatePayment(loanId, paymentData);

      window.location.reload(); // Reload lại trang sau khi gửi
    } catch (error) {
      console.error("Lỗi khi tạo thanh toán:", error);
      // Có thể thêm thông báo lỗi cho người dùng ở đây
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      className="Modal bg-gray-900 rounded-md p-6 max-w-lg w-full mx-auto outline-none"
      overlayClassName="Overlay fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
    >
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lightGreen text-xl font-bold mb-4">
          Yêu cầu Thanh toán
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="paymentDate"
              className="block text-lightGreen text-sm font-bold mb-2"
            >
              Ngày trả:
            </label>
            <input
              type="date"
              id="paymentDate"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white border-gray-600"
            />
          </div>
          <div>
            <label
              htmlFor="paymentMethod"
              className="block text-lightGreen text-sm font-bold mb-2"
            >
              Phương thức thanh toán:
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white border-gray-600"
            >
              <option value="offline">Trả offline</option>
              <option value="online">Trả online</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="bg-lightGreen hover:bg-green-500 text-gray-900 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Gửi yêu cầu
            </button>
            <button
              type="button"
              onClick={onRequestClose}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Đóng
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default PaymentRequestModal;
