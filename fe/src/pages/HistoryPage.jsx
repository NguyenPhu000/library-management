import React, { useEffect, useState } from "react";
import { useLoan } from "../contexts/LoanContext";
import PaymentRequestModal from "../components/sections/PaymentRequestModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faBook,
  faCalendarAlt,
  faExclamationTriangle,
  faCheckCircle,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { usePayment } from "../contexts/PaymentContext";

const LoanHistory = () => {
  const { loanHistory, fetchLoanHistory, loading, error } = useLoan();
  const { isPaymentExists } = usePayment();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchLoanHistory();
  }, []);

  const openModal = (loanId) => {
    setSelectedLoanId(loanId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLoanId(null);
    fetchLoanHistory();
  };

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
            onClick={() => fetchLoanHistory()}
            className="bg-lightGreen hover:bg-lightGreen/80 text-black px-4 py-2 rounded-lg transition-colors font-medium"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const sortedLoanHistory = loanHistory.sort((a, b) => {
    return (b.fine_amount || 0) - (a.fine_amount || 0);
  });

  const filteredHistory = sortedLoanHistory.filter((loan) => {
    if (filter === "all") return true;
    if (filter === "fined") return loan.fine_amount > 0;
    if (filter === "paid")
      return loan.fine_amount > 0 && isPaymentExists(loan.loan_id);
    if (filter === "unpaid")
      return loan.fine_amount > 0 && !isPaymentExists(loan.loan_id);
    return true;
  });

  const getStatusInfo = (loan) => {
    if (loan.fine_amount > 0) {
      if (isPaymentExists(loan.loan_id)) {
        return {
          color: "text-lightGreen",
          bg: "bg-green-900/30",
          border: "border-lightGreen/50",
          text: "Đã đóng phạt",
        };
      } else {
        return {
          color: "text-red-400",
          bg: "bg-red-900/30",
          border: "border-red-500/50",
          text: "Chưa đóng phạt",
        };
      }
    }
    return {
      color: "text-blue-400",
      bg: "bg-blue-900/30",
      border: "border-blue-500/50",
      text: "Không có phạt",
    };
  };

  const finedCount = loanHistory.filter((loan) => loan.fine_amount > 0).length;
  const paidCount = loanHistory.filter(
    (loan) => loan.fine_amount > 0 && isPaymentExists(loan.loan_id)
  ).length;
  const unpaidCount = finedCount - paidCount;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-lightGreen mb-1">
            Lịch sử mượn sách
          </h1>
          <p className="text-gray-400 text-sm">
            Xem lại các lần mượn sách đã hoàn thành
          </p>
        </div>

        {/* Stats - Compact */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 text-center">
            <p className="text-xs text-gray-400">Tổng</p>
            <p className="text-lg font-semibold text-white">
              {loanHistory.length}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 text-center">
            <p className="text-xs text-gray-400">Có phạt</p>
            <p className="text-lg font-semibold text-red-400">{finedCount}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 text-center">
            <p className="text-xs text-gray-400">Đã đóng</p>
            <p className="text-lg font-semibold text-lightGreen">{paidCount}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 text-center">
            <p className="text-xs text-gray-400">Chưa đóng</p>
            <p className="text-lg font-semibold text-yellow-400">
              {unpaidCount}
            </p>
          </div>
        </div>

        {/* Filter - Compact */}
        <div className="flex space-x-1 mb-4 bg-gray-800 rounded-lg p-1 border border-gray-700">
          {[
            { key: "all", label: "Tất cả" },
            { key: "fined", label: "Có phạt" },
            { key: "paid", label: "Đã đóng" },
            { key: "unpaid", label: "Chưa đóng" },
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
        {unpaidCount > 0 && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-red-400 text-sm"
              />
              <p className="text-red-300 text-sm font-medium">
                Bạn có {unpaidCount} khoản phạt chưa đóng
              </p>
            </div>
          </div>
        )}

        {/* History List - Compact */}
        {filteredHistory.length > 0 ? (
          <div className="space-y-3">
            {filteredHistory.map((loan) => {
              const isExpanded = expandedCard === loan.loan_id;
              const statusInfo = getStatusInfo(loan);
              const hasFine = loan.fine_amount > 0;
              const isPaid = isPaymentExists(loan.loan_id);

              return (
                <div
                  key={loan.loan_id}
                  className={`bg-gray-800 rounded-lg border transition-all duration-200 ${
                    hasFine && !isPaid
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
                    <div className="grid grid-cols-4 gap-3 mb-3 text-xs">
                      <div>
                        <p className="text-gray-500">Ngày mượn</p>
                        <p className="text-gray-300 font-medium">
                          {new Date(loan.loan_date).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Ngày trả</p>
                        <p className="text-gray-300 font-medium">
                          {loan.return_date
                            ? new Date(loan.return_date).toLocaleDateString(
                                "vi-VN"
                              )
                            : "Chưa trả"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Gia hạn</p>
                        <p className="text-gray-300 font-medium">
                          {loan.renew_count || 0}/1
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tiền phạt</p>
                        <p
                          className={`font-medium ${
                            hasFine ? "text-red-400" : "text-gray-300"
                          }`}
                        >
                          {hasFine
                            ? `${Math.floor(loan.fine_amount).toLocaleString(
                                "vi-VN"
                              )}đ`
                            : "0đ"}
                        </p>
                      </div>
                    </div>

                    {/* Actions - Compact */}
                    <div className="flex gap-2">
                      {hasFine && !isPaid ? (
                        <button
                          onClick={() => openModal(loan.loan_id)}
                          className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                        >
                          <FontAwesomeIcon icon={faCreditCard} />
                          <span>Đóng phạt</span>
                        </button>
                      ) : (
                        <span className="text-gray-500 text-xs px-3 py-1.5">
                          {isPaid ? "Đã đóng phạt" : "Không có phạt"}
                        </span>
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
                              {loan.return_date && loan.loan_date
                                ? Math.ceil(
                                    (new Date(loan.return_date) -
                                      new Date(loan.loan_date)) /
                                      (1000 * 60 * 60 * 24)
                                  )
                                : 0}{" "}
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
                  ? "Chưa có lịch sử mượn sách"
                  : filter === "fined"
                  ? "Không có khoản phạt nào"
                  : filter === "paid"
                  ? "Không có khoản phạt đã đóng"
                  : "Không có khoản phạt chưa đóng"}
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                {filter === "all"
                  ? "Khi bạn trả sách, lịch sử sẽ xuất hiện ở đây!"
                  : "Thay đổi bộ lọc để xem các mục khác"}
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

      <PaymentRequestModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        loanId={selectedLoanId}
      />
    </div>
  );
};

export default LoanHistory;
