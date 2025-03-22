import React, { useEffect } from "react";
import { useLoan } from "../contexts/LoanContext";

const LoanHistory = () => {
  const { loanHistory, fetchLoanHistory, loading, error } = useLoan();

  useEffect(() => {
    fetchLoanHistory(); // Gọi hàm để lấy lịch sử mượn khi component được mount
  }, [fetchLoanHistory]);

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
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {loanHistory.length > 0 ? (
              loanHistory.map((loan) => (
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center">
                  Không có lịch sử mượn nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoanHistory;
