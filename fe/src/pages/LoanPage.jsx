import React, { useContext, useEffect, useState } from "react";
import { LoanContext } from "../contexts/LoanContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faRedo,
  faReply,
  faCalendarAlt,
  faExclamationTriangle,
  faCheckCircle,
  faClock,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const LoanPage = () => {
  const { loans, loading, error, returnLoan, requestRenewLoan, fetchLoans } =
    useContext(LoanContext);
  const [expandedCard, setExpandedCard] = useState(null);
  const [filter, setFilter] = useState("all"); // all, overdue, normal, pending

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleReturnBook = async (loanId, title) => {
    try {
      const confirmResult = await Swal.fire({
        title: "Xác nhận trả sách",
        html: `Bạn có chắc chắn muốn trả sách <br/><strong>"${title}"</strong>?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Trả sách",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        background: "#1f2937",
        color: "#ffffff",
      });

      if (!confirmResult.isConfirmed) return;
      await returnLoan(loanId);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Lỗi khi trả sách: ${error.message}`,
        background: "#1f2937",
        color: "#ffffff",
      });
    }
  };

  const handleRenewBook = async (loanId, title) => {
    try {
      const confirmResult = await Swal.fire({
        title: "Xác nhận gia hạn",
        html: `Bạn có muốn gia hạn sách <br/><strong>"${title}"</strong>?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Gia hạn",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#97bc62",
        cancelButtonColor: "#6b7280",
        background: "#1f2937",
        color: "#ffffff",
      });

      if (!confirmResult.isConfirmed) return;

      const result = await requestRenewLoan(loanId);
      if (!result.success) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: result.message || "Không thể gia hạn sách",
          background: "#1f2937",
          color: "#ffffff",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Không thể yêu cầu gia hạn: ${error.message}`,
        background: "#1f2937",
        color: "#ffffff",
      });
    }
  };

  // Loading state với modern spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-600 border-t-lightGreen rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Error state với modern design
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 max-w-md w-full text-center">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-3xl text-red-400 mb-4"
          />
          <h2 className="text-xl font-semibold text-white mb-2">
            Có lỗi xảy ra
          </h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => fetchLoans()}
            className="bg-lightGreen hover:bg-lightGreen/80 text-black px-4 py-2 rounded-lg transition-colors font-medium"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Sắp xếp và lọc loans
  const sortedLoans = loans.sort((a, b) => {
    const isAOverdue = new Date(a.due_date) < new Date();
    const isBOverdue = new Date(b.due_date) < new Date();
    return isAOverdue === isBOverdue ? 0 : isAOverdue ? -1 : 1;
  });

  const filteredLoans = sortedLoans.filter((loan) => {
    if (filter === "all") return true;
    if (filter === "overdue") return new Date(loan.due_date) < new Date();
    if (filter === "pending") return loan.renewal_status === "pending";
    if (filter === "normal")
      return (
        new Date(loan.due_date) >= new Date() &&
        loan.renewal_status !== "pending"
      );
    return true;
  });

  const getStatusInfo = (loan) => {
    const isOverdue = new Date(loan.due_date) < new Date();
    const isNearDue =
      new Date(loan.due_date) - new Date() <= 2 * 24 * 60 * 60 * 1000;

    if (isOverdue)
      return {
        color: "text-red-400",
        bg: "bg-red-900/30",
        border: "border-red-500/50",
        text: "Quá hạn",
      };
    if (loan.renewal_status === "pending")
      return {
        color: "text-yellow-400",
        bg: "bg-yellow-900/30",
        border: "border-yellow-500/50",
        text: "Chờ duyệt",
      };
    if (loan.renewal_status === "approved")
      return {
        color: "text-lightGreen",
        bg: "bg-green-900/30",
        border: "border-lightGreen/50",
        text: "Đã gia hạn",
      };
    if (loan.renewal_status === "rejected")
      return {
        color: "text-red-400",
        bg: "bg-red-900/30",
        border: "border-red-500/50",
        text: "Từ chối gia hạn",
      };
    if (isNearDue)
      return {
        color: "text-yellow-400",
        bg: "bg-yellow-900/30",
        border: "border-yellow-500/50",
        text: "Sắp hết hạn",
      };
    return {
      color: "text-blue-400",
      bg: "bg-blue-900/30",
      border: "border-blue-500/50",
      text: "Bình thường",
    };
  };

  const overdueCount = loans.filter(
    (loan) => new Date(loan.due_date) < new Date()
  ).length;
  const pendingCount = loans.filter(
    (loan) => loan.renewal_status === "pending"
  ).length;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-lightGreen mb-1">
            Sách đang mượn
          </h1>
          <p className="text-gray-400 text-sm">
            Quản lý các cuốn sách bạn đang mượn từ thư viện
          </p>
        </div>

        {/* Stats - Compact */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 text-center">
            <p className="text-xs text-gray-400">Tổng</p>
            <p className="text-lg font-semibold text-white">{loans.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 text-center">
            <p className="text-xs text-gray-400">Quá hạn</p>
            <p className="text-lg font-semibold text-red-400">{overdueCount}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 text-center">
            <p className="text-xs text-gray-400">Chờ duyệt</p>
            <p className="text-lg font-semibold text-yellow-400">
              {pendingCount}
            </p>
          </div>
        </div>

        {/* Filter - Compact */}
        <div className="flex space-x-1 mb-4 bg-gray-800 rounded-lg p-1 border border-gray-700">
          {[
            { key: "all", label: "Tất cả" },
            { key: "overdue", label: "Quá hạn" },
            { key: "pending", label: "Chờ duyệt" },
            { key: "normal", label: "Bình thường" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filter === key
                  ? "bg-lightGreen text-black"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Warning - Compact */}
        {overdueCount > 0 && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-red-400 text-sm"
              />
              <p className="text-red-300 text-sm font-medium">
                Có {overdueCount} sách quá hạn - Vui lòng trả để tránh phạt
              </p>
            </div>
          </div>
        )}

        {/* Books List - Compact */}
        {filteredLoans.length > 0 ? (
          <div className="space-y-3">
            {filteredLoans.map((loan) => {
              const isOverdue = new Date(loan.due_date) < new Date();
              const isNearDue =
                new Date(loan.due_date) - new Date() <= 2 * 24 * 60 * 60 * 1000;
              const isExpanded = expandedCard === loan.loan_id;
              const statusInfo = getStatusInfo(loan);

              return (
                <div
                  key={loan.loan_id}
                  className={`bg-gray-800 rounded-lg border transition-all duration-200 ${
                    isOverdue
                      ? "border-red-500/50"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                >
                  {/* Card Content - Compact */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-base font-semibold text-white mb-1 truncate"
                          title={loan.Book?.title}
                        >
                          {loan.Book?.title || "Chưa có tiêu đề"}
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">
                          {loan.Book?.author || "Chưa có tác giả"}
                        </p>

                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} border`}
                        >
                          {statusInfo.text}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          setExpandedCard(isExpanded ? null : loan.loan_id)
                        }
                        className="text-gray-500 hover:text-lightGreen transition-colors ml-4"
                      >
                        <FontAwesomeIcon
                          icon={isExpanded ? faChevronUp : faChevronDown}
                        />
                      </button>
                    </div>

                    {/* Quick Info - Compact */}
                    <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
                      <div>
                        <p className="text-gray-500">Ngày mượn</p>
                        <p className="text-gray-300 font-medium">
                          {new Date(loan.loan_date).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Hạn trả</p>
                        <p
                          className={`font-medium ${
                            isOverdue
                              ? "text-red-400"
                              : isNearDue
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          {new Date(loan.due_date).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Gia hạn</p>
                        <p className="text-gray-300 font-medium">
                          {loan.renew_count || 0}/1
                        </p>
                      </div>
                    </div>

                    {/* Actions - Compact */}
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleReturnBook(
                            loan.loan_id,
                            loan.Book?.title || "Sách không xác định"
                          )
                        }
                        className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                      >
                        <FontAwesomeIcon icon={faReply} />
                        <span>Trả sách</span>
                      </button>

                      {(isNearDue || isOverdue) &&
                        (loan.renew_count || 0) < 1 && (
                          <button
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
                            className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                              loan.renewal_status === "pending" ||
                              loan.renewal_status === "approved"
                                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "bg-lightGreen hover:bg-lightGreen/80 text-black"
                            }`}
                          >
                            <FontAwesomeIcon icon={faRedo} />
                            <span>
                              {loan.renewal_status === "pending"
                                ? "Đang chờ"
                                : loan.renewal_status === "approved"
                                ? "Đã gia hạn"
                                : "Gia hạn"}
                            </span>
                          </button>
                        )}
                    </div>

                    {/* Expanded Content - Minimal */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-500">
                              Thời gian mượn:
                            </span>
                            <span className="text-gray-300">
                              {Math.ceil(
                                (new Date(loan.due_date) -
                                  new Date(loan.loan_date)) /
                                  (1000 * 60 * 60 * 24)
                              )}{" "}
                              ngày
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">
                              Trạng thái gia hạn:
                            </span>
                            <span
                              className={`${
                                loan.renewal_status === "approved"
                                  ? "text-lightGreen"
                                  : loan.renewal_status === "pending"
                                  ? "text-yellow-400"
                                  : loan.renewal_status === "rejected"
                                  ? "text-red-400"
                                  : "text-gray-400"
                              }`}
                            >
                              {loan.renewal_status === "approved"
                                ? "Đã duyệt"
                                : loan.renewal_status === "pending"
                                ? "Đang chờ duyệt"
                                : loan.renewal_status === "rejected"
                                ? "Từ chối"
                                : "Chưa gia hạn"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <FontAwesomeIcon
                icon={faBook}
                className="text-3xl text-gray-500 mb-3"
              />
              <h3 className="text-base font-medium text-white mb-2">
                {filter === "all"
                  ? "Chưa có sách nào được mượn"
                  : filter === "overdue"
                  ? "Không có sách quá hạn"
                  : filter === "pending"
                  ? "Không có sách chờ duyệt"
                  : "Không có sách bình thường"}
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                {filter === "all"
                  ? "Hãy khám phá thư viện và mượn những cuốn sách yêu thích!"
                  : "Thay đổi bộ lọc để xem các sách khác"}
              </p>
              {filter !== "all" && (
                <button
                  onClick={() => setFilter("all")}
                  className="bg-lightGreen hover:bg-lightGreen/80 text-black px-3 py-1.5 rounded text-sm font-medium transition-colors"
                >
                  Xem tất cả
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanPage;
