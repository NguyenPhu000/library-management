import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { usePayment } from "../../contexts/PaymentContext";
import { useLoan } from "../../contexts/LoanContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faTimes } from "@fortawesome/free-solid-svg-icons";

const PaymentRequestModal = ({ isOpen, onRequestClose, loanId }) => {
  const { createPaymentRequest } = usePayment();
  const { getLoanDetail } = useLoan();
  const [loanDetail, setLoanDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchLoanDetail = async () => {
      if (loanId && isOpen) {
        setLoading(true);
        try {
          const data = await getLoanDetail(loanId);
          setLoanDetail(data);
        } catch (error) {
          console.error("Lỗi khi lấy thông tin khoản vay:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLoanDetail();
  }, [loanId, isOpen, getLoanDetail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loanDetail || !loanId) return;

    try {
      await createPaymentRequest({
        loan_id: loanId,
        payment_method: paymentMethod,
        amount: loanDetail.fine_amount,
      });
      onRequestClose();
    } catch (error) {
      console.error("Lỗi khi tạo yêu cầu thanh toán:", error);
      alert("Lỗi khi tạo yêu cầu thanh toán!");
    }
  };

  const isMobile = screenWidth < 768;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Thanh toán tiền phạt"
      className="bg-gray-900 p-4 rounded-lg w-full max-w-md mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center z-50"
      ariaHideApp={false}
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lightGreen text-lg font-bold">
          <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
          Thanh toán tiền phạt
        </h2>
        <button
          onClick={onRequestClose}
          className="text-gray-400 hover:text-white"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-lightGreen border-t-transparent rounded-full"></div>
          <p className="mt-2 text-white text-sm">Đang tải...</p>
        </div>
      ) : loanDetail ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="bg-gray-800 p-3 rounded-md space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Sách:</span>
              <span className="text-white font-medium">
                {loanDetail.Book?.title || "N/A"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Ngày mượn:</span>
              <span className="text-white">
                {new Date(loanDetail.loan_date).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Ngày trả:</span>
              <span className="text-white">
                {loanDetail.return_date
                  ? new Date(loanDetail.return_date).toLocaleDateString("vi-VN")
                  : "Chưa trả"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Số ngày trễ hạn:</span>
              <span className="text-white">
                {loanDetail.overdue_days || 0} ngày
              </span>
            </div>
            <div className="flex justify-between font-medium border-t border-gray-700 pt-2 mt-2">
              <span className="text-red-400">Tiền phạt:</span>
              <span className="text-red-400">
                {loanDetail.fine_amount?.toLocaleString("vi-VN") || 0} VND
              </span>
            </div>
          </div>

          <div>
            <label className="block text-white text-xs mb-1">
              Phương thức thanh toán:
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-lightGreen"
            >
              <option value="cash">Tiền mặt</option>
              <option value="bank_transfer">Chuyển khoản</option>
              <option value="momo">Ví Momo</option>
            </select>
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="bg-lightGreen text-gray-900 px-4 py-1.5 rounded-md font-medium text-sm hover:bg-opacity-90 transition duration-200"
            >
              Xác nhận thanh toán
            </button>
            <button
              type="button"
              onClick={onRequestClose}
              className="ml-2 bg-gray-700 text-white px-4 py-1.5 rounded-md font-medium text-sm hover:bg-gray-600 transition duration-200"
            >
              Hủy bỏ
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-4 text-red-500">
          Không thể tải thông tin khoản vay
        </div>
      )}
    </Modal>
  );
};

export default PaymentRequestModal;
