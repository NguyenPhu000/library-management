import React, { useContext } from "react";
import { LoanContext } from "../contexts/LoanContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faRedo, faReply } from "@fortawesome/free-solid-svg-icons";

const LoanPage = () => {
  const { loans, loading, error, returnLoan, requestRenewLoan } =
    useContext(LoanContext);

  const handleReturnBook = async (loanId, title) => {
    // Xác nhận người dùng trước khi trả sách
    if (!window.confirm(`Bạn có chắc chắn muốn trả sách "${title}" không?`))
      return;

    try {
      await returnLoan(loanId);
      alert(`Đã trả sách: "${title}"`);
    } catch (error) {
      console.error("Lỗi khi trả sách:", error);
      alert(`Lỗi khi trả sách: ${error.message}`);
    }
  };

  const handleRenewBook = async (loanId, title) => {
    try {
      const result = await requestRenewLoan(loanId);
      // Kiểm tra kết quả yêu cầu gia hạn
      if (result.success) {
        alert(`Yêu cầu gia hạn sách "${title}" đã được gửi!`);
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (error) {
      console.error("Lỗi khi yêu cầu gia hạn:", error);
      alert(`Không thể yêu cầu gia hạn: ${error.message}`);
    }
  };

  if (loading)
    return (
      <div className="font-poppins p-4 bg-gray-900 text-white min-h-screen flex items-center justify-center">
        Đang tải...
      </div>
    );
  if (error)
    return (
      <div className="font-poppins p-4 bg-gray-900 text-white min-h-screen flex items-center justify-center">
        Lỗi: {error}
      </div>
    );

  // Sắp xếp các khoản vay, đưa các khoản vay quá hạn lên đầu
  const sortedLoans = loans.sort((a, b) => {
    const isAOverdue = new Date(a.due_date) < new Date();
    const isBOverdue = new Date(b.due_date) < new Date();
    // So sánh trạng thái quá hạn của hai khoản vay
    return isAOverdue === isBOverdue ? 0 : isAOverdue ? -1 : 1;
  });

  return (
    <div className="font-poppins p-4 md:p-6 lg:p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-lightGreen mb-4 md:mb-6 text-2xl md:text-3xl font-bold">
        Danh Sách Sách Đang Mượn
      </h1>
      {sortedLoans.some((loan) => new Date(loan.due_date) < new Date()) && (
        <div className="bg-yellow-500 text-black p-2 rounded mb-4 text-center font-bold">
          Xin vui lòng trả sách đã hết hạn!
        </div>
      )}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-700 bg-gray-800 table-fixed">
          <thead className="bg-gray-700 sticky top-0 z-10">
            <tr>
              <th className="w-1/4 px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                <FontAwesomeIcon icon={faBook} className="mr-1" /> Tiêu đề sách
              </th>
              <th className="w-1/6 px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-lightGreen uppercase tracking-wider hidden md:table-cell">
                Tác giả
              </th>
              <th className="w-1/6 px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-lightGreen uppercase tracking-wider hidden lg:table-cell">
                Ngày mượn
              </th>
              <th className="w-1/6 px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Hạn trả
              </th>
              <th className="w-1/12 px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-lightGreen uppercase tracking-wider hidden sm:table-cell">
                Gia hạn
              </th>
              <th className="w-1/6 px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-lightGreen uppercase tracking-wider hidden md:table-cell">
                Trạng thái
              </th>
              <th className="w-1/5 px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {sortedLoans.length > 0 ? (
              sortedLoans.map((loan) => {
                const isOverdue = new Date(loan.due_date) < new Date();
                const isNearDue =
                  new Date(loan.due_date) - new Date() <=
                  2 * 24 * 60 * 60 * 1000; // 1-2 ngày
                // Kiểm tra nếu đã gia hạn > 0 thì không hiển thị
                if (loan.renew_count > 0) return null;
                return (
                  <tr
                    key={loan.loan_id}
                    className={`hover:bg-gray-600 transition-colors duration-200 ${
                      isOverdue ? "bg-red-500" : ""
                    }`}
                  >
                    <td
                      className="px-4 py-4 md:px-6 md:py-4 overflow-hidden text-ellipsis whitespace-nowrap max-w-0"
                      title={loan.Book.title}
                    >
                      {loan.Book.title}
                    </td>
                    <td
                      className="px-4 py-4 md:px-6 md:py-4 overflow-hidden text-ellipsis whitespace-nowrap hidden md:table-cell max-w-0"
                      title={loan.Book.author}
                    >
                      {loan.Book.author}
                    </td>
                    <td className="px-4 py-4 md:px-6 md:py-4 whitespace-nowrap hidden lg:table-cell">
                      {new Date(loan.loan_date).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-4 md:px-6 md:py-4 whitespace-nowrap">
                      {new Date(loan.due_date).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-4 md:px-6 md:py-4 whitespace-nowrap hidden sm:table-cell text-center">
                      {loan.renew_count}
                    </td>
                    <td className="px-4 py-4 md:px-6 md:py-4 whitespace-nowrap hidden md:table-cell">
                      {loan.renewal_status === "pending"
                        ? "Đang chờ"
                        : loan.renewal_status === "approved"
                        ? "Đã chấp nhận"
                        : loan.renewal_status === "rejected"
                        ? "Từ chối"
                        : "N/A"}
                    </td>
                    <td className="px-4 py-4 md:px-6 md:py-4 whitespace-nowrap text-left">
                      <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-2 items-start sm:items-center">
                        <button
                          className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded focus:outline-none text-xs md:text-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                          type="button"
                          onClick={() =>
                            handleReturnBook(loan.loan_id, loan.Book.title)
                          }
                          disabled={loan.returned === 1}
                          title="Trả sách"
                        >
                          <FontAwesomeIcon icon={faReply} className="mr-1" />{" "}
                          Trả
                        </button>
                        {isNearDue && (
                          <button
                            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded focus:outline-none text-xs md:text-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            type="button"
                            onClick={() =>
                              handleRenewBook(loan.loan_id, loan.Book.title)
                            }
                            disabled={
                              loan.renewal_status === "pending" ||
                              loan.renewal_status === "approved" ||
                              loan.returned === 1
                            }
                            title="Gia hạn sách"
                          >
                            <FontAwesomeIcon icon={faRedo} className="mr-1" />{" "}
                            Gia hạn
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-10 text-center text-gray-400"
                >
                  Bạn chưa mượn cuốn sách nào. Hãy khám phá thư viện nhé!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoanPage;
