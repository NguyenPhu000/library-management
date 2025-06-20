import React, { useContext, useEffect } from "react";
import { LoanContext } from "../contexts/LoanContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faRedo, faReply } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const LoanPage = () => {
  const { loans, loading, error, returnLoan, requestRenewLoan, fetchLoans } =
    useContext(LoanContext);

  // Fetch loans khi component được tải
  useEffect(() => {
    fetchLoans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Loại bỏ fetchLoans khỏi dependency array để tránh vòng lặp vô hạn

  const handleReturnBook = async (loanId, title) => {
    try {
      // Sử dụng SweetAlert2 để xác nhận
      const confirmResult = await Swal.fire({
        title: "Xác nhận trả sách",
        text: `Bạn có chắc chắn muốn trả sách "${title}" không?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Có, trả sách",
        cancelButtonText: "Không, hủy bỏ",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });

      if (!confirmResult.isConfirmed) return;

      await returnLoan(loanId);
      // Không cần hiển thị thông báo thành công vì returnLoan đã xử lý
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Lỗi khi trả sách: ${error.message}`,
      });
    }
  };

  const handleRenewBook = async (loanId, title) => {
    try {
      // Sử dụng SweetAlert2 để xác nhận
      const confirmResult = await Swal.fire({
        title: "Xác nhận gia hạn",
        text: `Bạn có muốn gia hạn sách "${title}" không?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Có, gia hạn",
        cancelButtonText: "Không, hủy bỏ",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });

      if (!confirmResult.isConfirmed) return;

      const result = await requestRenewLoan(loanId);
      if (!result.success) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: result.message || "Không thể gia hạn sách",
        });
      }
      // Không cần hiển thị thông báo thành công vì requestRenewLoan đã xử lý
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Không thể yêu cầu gia hạn: ${error.message}`,
      });
    }
  };

  if (loading)
    return (
      <div className="font-poppins p-4 bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-lightGreen border-t-transparent mb-2"></div>
          <span className="text-sm">Đang tải sách đang mượn...</span>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="font-poppins p-4 bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-red-500 bg-red-100 p-3 rounded-md">
          <p className="font-bold">Lỗi:</p>
          <p>{error}</p>
        </div>
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
    <div className="font-poppins p-3 md:p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-lightGreen mb-3 text-xl md:text-2xl font-bold">
        Sách Đang Mượn
      </h1>
      {sortedLoans.some((loan) => new Date(loan.due_date) < new Date()) && (
        <div className="bg-yellow-500 text-black p-1.5 rounded mb-3 text-center font-bold text-sm">
          Xin vui lòng trả sách đã hết hạn!
        </div>
      )}
      <div className="overflow-x-auto shadow-md rounded-md">
        <table className="min-w-full divide-y divide-gray-700 bg-gray-800 table-fixed">
          <thead className="bg-gray-700 sticky top-0 z-10">
            <tr>
              <th className="w-1/4 px-3 py-2 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                <FontAwesomeIcon icon={faBook} className="mr-1" /> Tiêu đề sách
              </th>
              <th className="w-1/6 px-3 py-2 text-left text-xs font-medium text-lightGreen uppercase tracking-wider hidden md:table-cell">
                Tác giả
              </th>
              <th className="w-1/6 px-3 py-2 text-left text-xs font-medium text-lightGreen uppercase tracking-wider hidden lg:table-cell">
                Ngày mượn
              </th>
              <th className="w-1/6 px-3 py-2 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Hạn trả
              </th>
              <th className="w-1/12 px-3 py-2 text-left text-xs font-medium text-lightGreen uppercase tracking-wider hidden sm:table-cell">
                Gia hạn
              </th>
              <th className="w-1/6 px-3 py-2 text-left text-xs font-medium text-lightGreen uppercase tracking-wider hidden md:table-cell">
                Trạng thái
              </th>
              <th className="w-1/5 px-3 py-2 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
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
                // Không lọc ra khoản vay đã gia hạn
                return (
                  <tr
                    key={loan.loan_id}
                    className={`hover:bg-gray-600 transition-colors duration-200 ${
                      isOverdue ? "bg-red-500" : ""
                    }`}
                  >
                    <td
                      className="px-3 py-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-0 text-sm"
                      title={loan.Book?.title}
                    >
                      {loan.Book?.title || "N/A"}
                    </td>
                    <td
                      className="px-3 py-2 overflow-hidden text-ellipsis whitespace-nowrap hidden md:table-cell max-w-0 text-sm"
                      title={loan.Book?.author}
                    >
                      {loan.Book?.author || "N/A"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap hidden lg:table-cell text-sm">
                      {new Date(loan.loan_date).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      {new Date(loan.due_date).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap hidden sm:table-cell text-center text-sm">
                      {loan.renew_count || 0}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap hidden md:table-cell text-sm">
                      {loan.renewal_status === "pending"
                        ? "Đang chờ duyệt"
                        : loan.renewal_status === "approved"
                        ? "Đã duyệt"
                        : loan.renewal_status === "rejected"
                        ? "Từ chối"
                        : "Chưa gia hạn"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-left">
                      <div className="flex flex-row space-x-1 items-center">
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded text-xs focus:outline-none flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                          type="button"
                          onClick={() =>
                            handleReturnBook(
                              loan.loan_id,
                              loan.Book?.title || "Sách không xác định"
                            )
                          }
                          title="Trả sách"
                        >
                          <FontAwesomeIcon icon={faReply} className="mr-1" />{" "}
                          Trả
                        </button>
                        {(isNearDue || isOverdue) && (
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white font-medium py-1 px-2 rounded text-xs focus:outline-none flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            type="button"
                            onClick={() =>
                              handleRenewBook(
                                loan.loan_id,
                                loan.Book?.title || "Sách không xác định"
                              )
                            }
                            disabled={
                              loan.renewal_status === "pending" ||
                              loan.renewal_status === "approved"
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
                  className="px-3 py-6 text-center text-gray-400 text-sm"
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
