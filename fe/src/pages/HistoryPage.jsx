import React, { useEffect, useState } from "react";
import { useLoan } from "../contexts/LoanContext";
import PaymentRequestModal from "../components/sections/PaymentRequestModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { usePayment } from "../contexts/PaymentContext";

const LoanHistory = () => {
  const { loanHistory, fetchLoanHistory, loading, error } = useLoan();
  const { isPaymentExists } = usePayment();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState(null);

  useEffect(() => {
    // Tải lại lịch sử mượn khi component được mount
    fetchLoanHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Loại bỏ fetchLoanHistory khỏi dependency array để tránh vòng lặp vô hạn

  const openModal = (loanId) => {
    setSelectedLoanId(loanId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLoanId(null);
    // Tải lại lịch sử mượn sau khi đóng modal (có thể đã thanh toán)
    fetchLoanHistory();
  };

  if (loading) {
    return (
      <div className="font-poppins p-4 bg-gray-900 text-white flex items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-lightGreen border-t-transparent mb-2"></div>
          <span className="text-sm">Đang tải lịch sử mượn...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-poppins p-4 bg-gray-900 text-white flex items-center justify-center min-h-[40vh]">
        <div className="text-red-500 bg-red-100 p-3 rounded-md">
          <p className="font-bold">Lỗi:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const sortedLoanHistory = loanHistory.sort((a, b) => {
    return (b.fine_amount || 0) - (a.fine_amount || 0);
  });

  return (
    <div className="font-poppins p-3 md:p-4 bg-gray-900 text-white">
      <h1 className="text-lightGreen mb-3 text-xl font-bold">
        Lịch Sử Mượn Sách
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700 rounded-md shadow-md bg-gray-800">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Tiêu đề sách
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-lightGreen uppercase tracking-wider hidden md:table-cell">
                Tác giả
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-lightGreen uppercase tracking-wider hidden sm:table-cell">
                Ngày mượn
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-lightGreen uppercase tracking-wider hidden sm:table-cell">
                Ngày trả
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-lightGreen uppercase tracking-wider hidden md:table-cell">
                Gia hạn
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-lightGreen uppercase tracking-wider hidden md:table-cell">
                Trạng thái
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Tiền phạt
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
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
                  <td className="px-3 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-0 text-sm">
                    {loan.Book?.title || "N/A"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-0 hidden md:table-cell text-sm">
                    {loan.Book?.author || "N/A"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap hidden sm:table-cell text-sm">
                    {new Date(loan.loan_date).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap hidden sm:table-cell text-sm">
                    {loan.return_date
                      ? new Date(loan.return_date).toLocaleDateString("vi-VN")
                      : "Chưa trả"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap hidden md:table-cell text-sm text-center">
                    {loan.renew_count || 0}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap hidden md:table-cell text-sm">
                    {loan.renewal_status === "pending"
                      ? "Đang chờ duyệt"
                      : loan.renewal_status === "approved"
                      ? "Đã duyệt"
                      : loan.renewal_status === "rejected"
                      ? "Đã từ chối"
                      : "Chưa gia hạn"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    {loan.fine_amount
                      ? `${Math.floor(loan.fine_amount).toLocaleString(
                          "vi-VN"
                        )} VND`
                      : "0 VND"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {loan.fine_amount > 0 && !isPaymentExists(loan.loan_id) ? (
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded-md text-xs focus:outline-none"
                        onClick={() => openModal(loan.loan_id)}
                      >
                        <FontAwesomeIcon icon={faCreditCard} className="mr-1" />{" "}
                        Đóng phạt
                      </button>
                    ) : (
                      <span className="text-gray-500 font-medium py-1 px-2 text-xs">
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
                <td
                  colSpan="8"
                  className="px-3 py-4 text-center text-sm text-gray-400"
                >
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
