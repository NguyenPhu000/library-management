import React, { useContext, useEffect, useState } from "react";
import { LoanContext } from "../contexts/LoanContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faRedo,
  faCalendarAlt,
  faExclamationTriangle,
  faCheckCircle,
  faClock,
  faChevronDown,
  faChevronUp,
  faTicket,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const LoanPage = () => {
  const { loans, loading, error, requestRenewLoan, fetchLoans } =
    useContext(LoanContext);
  const [expandedCard, setExpandedCard] = useState(null);
  const [filter, setFilter] = useState("all"); // all, overdue, normal, pending, pickup

  useEffect(() => {
    fetchLoans();
  }, []);

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

  // Sắp xếp theo priority: quá hạn > chờ nhận > đang mượn > đã trả
  const sortedLoans = loans.sort((a, b) => {
    // Priority order: 1=overdue, 2=pending_pickup, 3=borrowed, 4=returned, 5=other
    const getPriority = (loan) => {
      if (
        loan.status === "borrowed" &&
        loan.due_date &&
        new Date(loan.due_date) < new Date()
      )
        return 1; // Quá hạn
      if (loan.status === "pending_pickup") return 2; // Chờ nhận
      if (loan.status === "borrowed") return 3; // Đang mượn
      if (loan.status === "returned") return 5; // Đã trả
      return 4; // Khác
    };

    const priorityA = getPriority(a);
    const priorityB = getPriority(b);

    if (priorityA !== priorityB) return priorityA - priorityB;

    // Cùng priority thì sort theo date mới nhất
    const dateA = new Date(a.request_date || a.loan_date || 0);
    const dateB = new Date(b.request_date || b.loan_date || 0);
    return dateB - dateA;
  });

  const filteredLoans = sortedLoans.filter((loan) => {
    if (filter === "all") return true;

    if (filter === "overdue") {
      // Quá hạn: chỉ status="borrowed" và past due date
      return (
        loan.status === "borrowed" &&
        loan.due_date &&
        new Date(loan.due_date) < new Date()
      );
    }

    if (filter === "pickup") {
      // Chờ nhận sách: status="pending_pickup" (có pickup_code)
      return loan.status === "pending_pickup";
    }

    if (filter === "pending") {
      // Chờ duyệt: yêu cầu gia hạn (không có "requested" trong new workflow)
      return (
        loan.renewal_status === "pending" || loan.renewal_status === "requested"
      );
    }

    if (filter === "normal") {
      // Bình thường: đang mượn không quá hạn, không chờ duyệt gia hạn
      return (
        loan.status === "borrowed" &&
        loan.due_date &&
        new Date(loan.due_date) >= new Date() &&
        loan.renewal_status !== "pending" &&
        loan.renewal_status !== "requested"
      );
    }

    return true;
  });

  // Hàm lấy thông tin trạng thái với colors và icons
  const getStatusInfo = (loan) => {
    const now = new Date();
    const dueDate = loan.due_date ? new Date(loan.due_date) : null;
    const holdUntil = loan.hold_until ? new Date(loan.hold_until) : null;
    const isOverdue = dueDate && now > dueDate && loan.status === "borrowed";

    // Enhanced status logic với thêm thông tin chi tiết
    if (loan.status === "requested") {
      return {
        status: "Chờ duyệt",
        detail: `Yêu cầu ngày ${new Date(loan.request_date).toLocaleDateString(
          "vi-VN"
        )}`,
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: faClock,
        iconColor: "text-blue-600",
        priority: 3,
      };
    }

    if (loan.status === "approved") {
      const daysLeft = holdUntil
        ? Math.ceil((holdUntil - now) / (1000 * 60 * 60 * 24))
        : 0;
      return {
        status: "Đã duyệt",
        detail: `Còn ${daysLeft} ngày để nhận sách`,
        color: "bg-green-100 text-green-800 border-green-200",
        icon: faCheckCircle,
        iconColor: "text-green-600",
        priority: 2,
      };
    }

    if (loan.status === "pending_pickup") {
      const daysLeft = holdUntil
        ? Math.ceil((holdUntil - now) / (1000 * 60 * 60 * 24))
        : 0;
      return {
        status: "Chờ nhận sách",
        detail: loan.pickup_code
          ? `Mã nhận: ${loan.pickup_code} (còn ${daysLeft} ngày)`
          : `Còn ${daysLeft} ngày để nhận`,
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: faTicket,
        iconColor: "text-purple-600",
        priority: 1,
        showPickupCode: true,
      };
    }

    if (loan.status === "borrowed") {
      if (isOverdue) {
        const overdueDays = Math.ceil((now - dueDate) / (1000 * 60 * 60 * 24));
        const fineAmount = parseFloat(loan.fine_amount || 0);
        return {
          status: "Quá hạn",
          detail: `Trễ ${overdueDays} ngày${
            fineAmount > 0
              ? ` - Phạt: ${fineAmount.toLocaleString("vi-VN")}đ`
              : ""
          }`,
          color: "bg-red-100 text-red-800 border-red-200",
          icon: faExclamationTriangle,
          iconColor: "text-red-600",
          priority: 0,
        };
      } else {
        const daysLeft = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
        const renewalInfo =
          loan.renewal_status === "requested"
            ? " (Chờ gia hạn)"
            : loan.renew_count > 0
            ? ` (Đã gia hạn ${loan.renew_count} lần)`
            : "";
        return {
          status: "Đang mượn",
          detail: `Còn ${daysLeft} ngày${renewalInfo}`,
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: faBook,
          iconColor: "text-yellow-600",
          priority: 4,
        };
      }
    }

    if (loan.status === "returned") {
      const returnDate = loan.return_date
        ? new Date(loan.return_date).toLocaleDateString("vi-VN")
        : "N/A";
      const fineAmount = parseFloat(loan.fine_amount || 0);
      return {
        status: "Đã trả",
        detail: `Trả ngày ${returnDate}${
          fineAmount > 0
            ? ` - Phạt: ${fineAmount.toLocaleString("vi-VN")}đ`
            : ""
        }`,
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: faCheckCircle,
        iconColor: "text-gray-600",
        priority: 6,
      };
    }

    if (loan.status === "rejected") {
      return {
        status: "Bị từ chối",
        detail: loan.rejection_reason || "Không có lý do cụ thể",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: faExclamationTriangle,
        iconColor: "text-red-600",
        priority: 5,
      };
    }

    // Default fallback
    return {
      status: loan.status || "Không xác định",
      detail: "Trạng thái không rõ",
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: faClock,
      iconColor: "text-gray-600",
      priority: 7,
    };
  };

  // Enhanced pickup code copy function
  const copyPickupCode = async (pickupCode) => {
    try {
      await navigator.clipboard.writeText(pickupCode);
      Swal.fire({
        icon: "success",
        title: "Đã sao chép!",
        text: `Mã nhận sách "${pickupCode}" đã được sao chép`,
        timer: 2000,
        showConfirmButton: false,
        background: "#1f2937",
        color: "#ffffff",
        toast: true,
        position: "top-end",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể sao chép mã. Vui lòng sao chép thủ công.",
        background: "#1f2937",
        color: "#ffffff",
      });
    }
  };

  const overdueCount = loans.filter(
    (loan) =>
      loan.status === "borrowed" &&
      loan.due_date &&
      new Date(loan.due_date) < new Date()
  ).length;

  const pendingCount = loans.filter(
    (loan) =>
      loan.renewal_status === "pending" || // Chỉ yêu cầu gia hạn
      loan.renewal_status === "requested"
  ).length;

  const pickupCount = loans.filter(
    (loan) => loan.status === "pending_pickup" // Chỉ status này
  ).length;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-lightGreen mb-1">
                Sách đang mượn
              </h1>
              <p className="text-gray-400 text-sm">
                Quản lý các cuốn sách bạn đang mượn từ thư viện
              </p>
            </div>

            {/* Nút Test Mượn Sách đã được xoá */}
          </div>
        </div>

        {/* Stats - Compact */}
        <div className="grid grid-cols-4 gap-3 mb-6">
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
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 text-center">
            <p className="text-xs text-gray-400">Chờ nhận</p>
            <p className="text-lg font-semibold text-purple-400">
              {pickupCount}
            </p>
          </div>
        </div>

        {/* Filter - Compact */}
        <div className="flex space-x-1 mb-4 bg-gray-800 rounded-lg p-1 border border-gray-700">
          {[
            { key: "all", label: "Tất cả" },
            { key: "pickup", label: "🎫 Chờ nhận" },
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

        {/* Pickup Code Notification */}
        {pickupCount > 0 && filter === "all" && (
          <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon
                icon={faTicket}
                className="text-purple-400 text-sm"
              />
              <p className="text-purple-300 text-sm font-medium">
                Có {pickupCount} sách chờ nhận - Đến thư viện với mã nhận sách
              </p>
            </div>
          </div>
        )}

        {/* Books List - Compact */}
        {filteredLoans.length > 0 ? (
          <div className="space-y-3">
            {filteredLoans.map((loan) => {
              const isOverdue =
                loan.status === "borrowed" &&
                loan.due_date &&
                new Date(loan.due_date) < new Date();
              const isNearDue =
                loan.status === "borrowed" &&
                loan.due_date &&
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
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusInfo.color} ${statusInfo.border}`}
                        >
                          <FontAwesomeIcon
                            icon={statusInfo.icon}
                            className={statusInfo.iconColor}
                          />
                          {statusInfo.status}
                        </span>

                        {/* Pickup Code Display - Tích hợp */}
                        {loan.pickup_code &&
                          (loan.status === "pending_pickup" ||
                            loan.status === "borrowed") && (
                            <div className="mt-3 bg-gray-700/50 border border-gray-600 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium text-purple-300">
                                  🎫 Mã Nhận Sách
                                </h4>
                                <span className="text-xs px-2 py-1 bg-green-600/20 text-green-300 rounded-full border border-green-500/30">
                                  Đang hoạt động
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <code className="bg-gray-800 px-3 py-2 rounded text-lg font-mono font-bold text-purple-200 border border-gray-600">
                                  {loan.pickup_code}
                                </code>
                                <button
                                  onClick={async () => {
                                    try {
                                      await navigator.clipboard.writeText(
                                        loan.pickup_code
                                      );
                                      // Mini feedback toast
                                      const btn =
                                        event.target.closest("button");
                                      const originalText = btn.textContent;
                                      btn.textContent = "✅ Đã sao chép";
                                      setTimeout(() => {
                                        btn.textContent = originalText;
                                      }, 1500);
                                    } catch (err) {
                                      console.error("Copy failed:", err);
                                    }
                                  }}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
                                >
                                  📋 Sao chép
                                </button>
                              </div>
                              <p className="text-xs text-gray-400 mt-2">
                                💡 Đến thư viện với mã này để nhận sách
                              </p>
                            </div>
                          )}
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
                        <p className="text-gray-500">
                          {loan.status === "pending_pickup"
                            ? "Ngày yêu cầu"
                            : "Ngày mượn"}
                        </p>
                        <p className="text-gray-300 font-medium">
                          {loan.status === "pending_pickup"
                            ? loan.request_date
                              ? new Date(loan.request_date).toLocaleDateString(
                                  "vi-VN"
                                )
                              : "Chưa xác định"
                            : loan.loan_date
                            ? new Date(loan.loan_date).toLocaleDateString(
                                "vi-VN"
                              )
                            : "Chưa nhận"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">
                          {loan.status === "pending_pickup"
                            ? "Hạn nhận"
                            : "Hạn trả"}
                        </p>
                        <p
                          className={`font-medium ${
                            loan.status === "pending_pickup"
                              ? loan.hold_until &&
                                new Date(loan.hold_until) < new Date()
                                ? "text-red-400"
                                : "text-purple-400"
                              : isOverdue
                              ? "text-red-400"
                              : isNearDue
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          {loan.status === "pending_pickup"
                            ? loan.hold_until
                              ? new Date(loan.hold_until).toLocaleDateString(
                                  "vi-VN"
                                )
                              : "3 ngày"
                            : loan.due_date &&
                              new Date(loan.due_date).getFullYear() > 1970
                            ? new Date(loan.due_date).toLocaleDateString(
                                "vi-VN"
                              )
                            : "Chưa xác định"}
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
                      {/* Chỉ hiển thị nút Gia hạn khi status = "borrowed" */}
                      {loan.status === "borrowed" && (
                        <>
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
                        </>
                      )}

                      {/* Hiển thị thông tin khác cho status khác */}
                      {loan.status === "pending_pickup" && (
                        <div className="text-xs text-purple-300">
                          💡 Đến thư viện với mã nhận sách để nhận sách
                        </div>
                      )}
                    </div>

                    {/* Expanded Content - Minimal */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <div className="text-xs space-y-2">
                          {/* Pickup code info (condensed) */}
                          {loan.status === "pending_pickup" &&
                            loan.pickup_code && (
                              <div className="bg-purple-900/20 border border-purple-500/30 rounded-md p-2 mb-2">
                                <p className="text-purple-300 text-xs">
                                  🎫 Mã nhận sách:{" "}
                                  <span className="font-mono bg-purple-800/50 px-1 rounded">
                                    {loan.pickup_code}
                                  </span>
                                </p>
                                {loan.hold_until && (
                                  <p className="text-purple-200 text-xs mt-1">
                                    Hạn nhận:{" "}
                                    {new Date(
                                      loan.hold_until
                                    ).toLocaleDateString("vi-VN")}
                                  </p>
                                )}
                              </div>
                            )}

                          <div className="flex justify-between">
                            <span className="text-gray-500">
                              {loan.status === "pending_pickup"
                                ? "Thời hạn nhận:"
                                : "Thời gian mượn:"}
                            </span>
                            <span className="text-gray-300">
                              {loan.status === "pending_pickup"
                                ? "3 ngày từ khi yêu cầu"
                                : loan.loan_date
                                ? Math.ceil(
                                    (new Date(loan.due_date) -
                                      new Date(loan.loan_date)) /
                                      (1000 * 60 * 60 * 24)
                                  ) + " ngày"
                                : "Chưa nhận sách"}
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

                          {/* 🆕 Hiển thị thông tin trạng thái chi tiết */}
                          <div className="flex justify-between">
                            <span className="text-gray-500">Ghi chú:</span>
                            <span className="text-gray-300 text-right">
                              {statusInfo.detail}
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
