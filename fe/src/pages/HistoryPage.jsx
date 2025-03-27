import React, { useEffect, useState } from "react";
import { useLoan } from "../contexts/LoanContext";
import PaymentRequestModal from "../components/sections/PaymentRequestModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { usePayment } from "../contexts/PaymentContext"; // Import usePayment để sử dụng logic kiểm tra

const LoanHistory = () => {
  const { loanHistory, fetchLoanHistory, loading, error } = useLoan();
  const { isPaymentExists } = usePayment(); // Lấy hàm kiểm tra thanh toán từ context
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState(null);

  useEffect(() => {
    fetchLoanHistory();
  }, [fetchLoanHistory]);

  const openModal = (loanId) => {
    setSelectedLoanId(loanId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLoanId(null);
  };

  if (loading) {
    return (
      <div className="font-poppins p-4 bg-gray-900 text-white">
        Đang tải lịch sử mượn...
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-poppins p-4 bg-gray-900 text-white">
        Lỗi: {error}
      </div>
    );
  }

  // Sắp xếp lịch sử mượn theo fine_amount
  const sortedLoanHistory = loanHistory.sort((a, b) => {
    return (b.fine_amount || 0) - (a.fine_amount || 0);
  });

  return (
    <div className="font-poppins p-4 bg-gray-900 text-white">
      <h1 className="text-lightGreen mb-4 text-2xl font-bold">
        Lịch Sử Mượn Sách
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700 rounded-md shadow-md bg-gray-800">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Tiêu đề sách
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Tác giả
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Ngày mượn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Ngày trả
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Số lần gia hạn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Trạng thái gia hạn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Số tiền phạt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {sortedLoanHistory.length > 0 ? (
              sortedLoanHistory.map((loan) => (
                <tr
                  key={loan.loan_id}
                  className="hover:bg-gray-600 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {loan.Book.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {loan.Book.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(loan.loan_date)
                      .toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                      .replace(/(^|\s)(\d)(?=\s|$)/g, "$10$2")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(loan.return_date)
                      .toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                      .replace(/(^|\s)(\d)(?=\s|$)/g, "$10$2")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {loan.renew_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {loan.renewal_status === "pending"
                      ? "Đang chờ xác nhận"
                      : loan.renewal_status === "approved"
                      ? "Đã chấp nhận"
                      : loan.renewal_status === "rejected"
                      ? "Đã từ chối"
                      : loan.renewal_status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {loan.fine_amount
                      ? `${Math.floor(loan.fine_amount)} VND`
                      : "0 VND"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {loan.fine_amount > 0 && !isPaymentExists(loan.loan_id) ? (
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-md text-sm focus:outline-none"
                        onClick={() => openModal(loan.loan_id)}
                      >
                        <FontAwesomeIcon icon={faCreditCard} /> Đóng phạt
                      </button>
                    ) : (
                      <span className="text-gray-500 font-bold py-1 px-2 rounded-md text-sm">
                        {isPaymentExists(loan.loan_id)
                          ? "Đã đóng phạt"
                          : "Không có phạt"}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center">
                  Không có lịch sử mượn nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <PaymentRequestModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        loanId={selectedLoanId}
      />
    </div>
  );
};

export default LoanHistory;
