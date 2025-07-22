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
  faFilter,
  faSearch,
  faInfoCircle,
  faArrowRight,
  faBookOpen,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const LoanPage = () => {
  const {
    loans,
    loading,
    error,
    requestRenewLoan,
    fetchLoans,
    cancelLoanRequest,
  } = useContext(LoanContext);
  const [expandedCard, setExpandedCard] = useState(null);
  const [filter, setFilter] = useState("all"); // all, overdue, normal, pending, pickup
  const [searchTerm, setSearchTerm] = useState("");

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
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#6b7280",
        background: "#1f2937",
        color: "#ffffff",
        customClass: {
          popup: "rounded-xl border border-gray-700",
          confirmButton: "rounded-lg",
          cancelButton: "rounded-lg",
        },
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
          customClass: {
            popup: "rounded-xl border border-gray-700",
          },
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Không thể yêu cầu gia hạn: ${error.message}`,
        background: "#1f2937",
        color: "#ffffff",
        customClass: {
          popup: "rounded-xl border border-gray-700",
        },
      });
    }
  };

  // Loading state với modern spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 animate-pulse">
            Đang tải danh sách mượn...
          </p>
        </div>
      </div>
    );
  }

  // Error state với modern design
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-2xl text-red-400"
            />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Có lỗi xảy ra
          </h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => fetchLoans()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-emerald-500/25"
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
    const matchesSearch =
      loan.Book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.Book?.isbn?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

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
        color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        icon: faClock,
        iconColor: "text-blue-400",
        priority: 3,
        glow: "shadow-blue-500/20",
      };
    }

    if (loan.status === "approved") {
      const daysLeft = holdUntil
        ? Math.ceil((holdUntil - now) / (1000 * 60 * 60 * 24))
        : 0;
      return {
        status: "Đã duyệt",
        detail: `Còn ${daysLeft} ngày để nhận sách`,
        color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        icon: faCheckCircle,
        iconColor: "text-emerald-400",
        priority: 2,
        glow: "shadow-emerald-500/20",
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
        color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        icon: faTicket,
        iconColor: "text-purple-400",
        priority: 1,
        showPickupCode: true,
        glow: "shadow-purple-500/20",
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
          color: "bg-red-500/20 text-red-400 border-red-500/30",
          icon: faExclamationTriangle,
          iconColor: "text-red-400",
          priority: 0,
          glow: "shadow-red-500/20",
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
          color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
          icon: faBook,
          iconColor: "text-amber-400",
          priority: 4,
          glow: "shadow-amber-500/20",
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
        color: "bg-gray-600/20 text-gray-400 border-gray-600/30",
        icon: faCheckCircle,
        iconColor: "text-gray-400",
        priority: 6,
        glow: "shadow-gray-600/20",
      };
    }

    if (loan.status === "rejected") {
      return {
        status: "Bị từ chối",
        detail: loan.rejection_reason || "Không có lý do cụ thể",
        color: "bg-red-500/20 text-red-400 border-red-500/30",
        icon: faExclamationTriangle,
        iconColor: "text-red-400",
        priority: 5,
        glow: "shadow-red-500/20",
      };
    }

    // Default fallback
    return {
      status: loan.status || "Không xác định",
      detail: "Trạng thái không rõ",
      color: "bg-gray-600/20 text-gray-400 border-gray-600/30",
      icon: faClock,
      iconColor: "text-gray-400",
      priority: 7,
      glow: "shadow-gray-600/20",
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
        customClass: {
          popup: "rounded-lg border border-gray-700 shadow-lg",
        },
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể sao chép mã. Vui lòng sao chép thủ công.",
        background: "#1f2937",
        color: "#ffffff",
        customClass: {
          popup: "rounded-xl border border-gray-700",
        },
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                  <FontAwesomeIcon
                    icon={faBookOpen}
                    className="mr-3 text-emerald-400"
                  />
                  Sách đang mượn
                </h1>
                <p className="text-gray-400">
                  Quản lý và theo dõi các cuốn sách bạn đang mượn từ thư viện
                </p>
              </div>
              <button
                onClick={() => fetchLoans()}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-gray-600/25"
              >
                <FontAwesomeIcon icon={faRedo} className="text-sm" />
                Làm mới
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all duration-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Tổng số</p>
                <p className="text-2xl font-bold text-white">{loans.length}</p>
              </div>
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faBook} className="text-gray-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-red-600 transition-all duration-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Quá hạn</p>
                <p className="text-2xl font-bold text-red-400">
                  {overdueCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="text-red-400"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-amber-600 transition-all duration-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Chờ duyệt</p>
                <p className="text-2xl font-bold text-amber-400">
                  {pendingCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faClock} className="text-amber-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-purple-600 transition-all duration-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Chờ nhận</p>
                <p className="text-2xl font-bold text-purple-400">
                  {pickupCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faTicket} className="text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sách hoặc ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-gray-800 rounded-xl border border-gray-700">
            {[
              { key: "all", label: "Tất cả", icon: faBook },
              { key: "pickup", label: "Chờ nhận", icon: faTicket },
              { key: "overdue", label: "Quá hạn", icon: faExclamationTriangle },
              { key: "pending", label: "Chờ duyệt", icon: faClock },
              { key: "normal", label: "Bình thường", icon: faCheckCircle },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex-1 min-w-[100px] px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  filter === key
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                <FontAwesomeIcon icon={icon} className="text-xs" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Warnings */}
        {overdueCount > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="text-red-400"
                />
              </div>
              <div>
                <p className="text-red-400 font-semibold">
                  Có {overdueCount} sách quá hạn
                </p>
                <p className="text-red-300 text-sm">
                  Vui lòng trả sách để tránh phạt thêm
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pickup Code Notification */}
        {pickupCount > 0 && filter === "all" && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faTicket} className="text-purple-400" />
              </div>
              <div>
                <p className="text-purple-400 font-semibold">
                  Có {pickupCount} sách chờ nhận
                </p>
                <p className="text-purple-300 text-sm">
                  Đến thư viện với mã nhận sách để lấy sách
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Books List */}
        {filteredLoans.length > 0 ? (
          <div className="space-y-4">
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
                  className={`bg-gray-800 rounded-xl border transition-all duration-200 shadow-lg hover:shadow-xl ${
                    isOverdue
                      ? "border-red-500/50 shadow-red-500/10"
                      : isNearDue
                      ? "border-amber-500/50 shadow-amber-500/10"
                      : "border-gray-700 hover:border-gray-600"
                  } ${statusInfo.glow ? `hover:${statusInfo.glow}` : ""}`}
                >
                  {/* Card Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-lg font-semibold text-white mb-2 line-clamp-2"
                          title={loan.Book?.title}
                        >
                          {loan.Book?.title || "Chưa có tiêu đề"}
                        </h3>
                        <p className="text-sm text-gray-400 mb-3 flex items-center">
                          <FontAwesomeIcon
                            icon={faBook}
                            className="mr-2 text-gray-500"
                          />
                          {loan.Book?.author || "Chưa có tác giả"}
                        </p>

                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${statusInfo.color} backdrop-blur-sm`}
                        >
                          <FontAwesomeIcon
                            icon={statusInfo.icon}
                            className={`${statusInfo.iconColor} ${
                              statusInfo.icon === faClock ? "animate-pulse" : ""
                            }`}
                          />
                          {statusInfo.status}
                        </span>

                        {/* Pickup Code Display */}
                        {loan.pickup_code &&
                          (loan.status === "pending_pickup" ||
                            loan.status === "borrowed") && (
                            <div className="mt-4 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold text-purple-400 flex items-center">
                                  <FontAwesomeIcon
                                    icon={faTicket}
                                    className="mr-2"
                                  />
                                  Mã Nhận Sách
                                </h4>
                                <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                                  Đang hoạt động
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <code className="bg-gray-900 px-4 py-2 rounded-lg text-xl font-mono font-bold text-purple-300 border border-purple-500/30">
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
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
                                >
                                  📋 Sao chép
                                </button>
                              </div>
                              <p className="text-xs text-gray-400 mt-3 flex items-center">
                                <FontAwesomeIcon
                                  icon={faInfoCircle}
                                  className="mr-2 text-gray-500"
                                />
                                Đến thư viện với mã này để nhận sách
                              </p>
                            </div>
                          )}
                      </div>

                      <button
                        onClick={() =>
                          setExpandedCard(isExpanded ? null : loan.loan_id)
                        }
                        className="text-gray-400 hover:text-emerald-400 transition-all duration-200 ml-4 group"
                      >
                        <FontAwesomeIcon
                          icon={isExpanded ? faChevronUp : faChevronDown}
                          className="group-hover:scale-110 transition-transform duration-200"
                        />
                      </button>
                    </div>

                    {/* Quick Info */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-700/30 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1 flex items-center">
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="mr-2 text-gray-500"
                          />
                          {loan.status === "pending_pickup"
                            ? "Ngày yêu cầu"
                            : "Ngày mượn"}
                        </p>
                        <p className="text-white font-medium">
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
                      <div className="bg-gray-700/30 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1 flex items-center">
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="mr-2 text-gray-500"
                          />
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
                              ? "text-amber-400"
                              : "text-white"
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
                      <div className="bg-gray-700/30 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1 flex items-center">
                          <FontAwesomeIcon
                            icon={faHistory}
                            className="mr-2 text-gray-500"
                          />
                          Gia hạn
                        </p>
                        <p className="text-white font-medium">
                          {loan.renew_count || 0}/1
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      {/* Nút hủy yêu cầu cho trạng thái pending_pickup */}
                      {loan.status === "pending_pickup" && (
                        <button
                          onClick={() => cancelLoanRequest(loan.loan_id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/25"
                        >
                          <FontAwesomeIcon icon={faExclamationTriangle} />
                          <span>Hủy yêu cầu</span>
                        </button>
                      )}

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
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  loan.renewal_status === "pending" ||
                                  loan.renewal_status === "approved"
                                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-500/25"
                                }`}
                              >
                                <FontAwesomeIcon icon={faRedo} />
                                <span>
                                  {loan.renewal_status === "pending"
                                    ? "Đang chờ duyệt"
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
                        <div className="text-sm text-purple-300 flex items-center">
                          <FontAwesomeIcon
                            icon={faInfoCircle}
                            className="mr-2"
                          />
                          Đến thư viện với mã nhận sách để lấy sách
                        </div>
                      )}
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-700 animate-fadeIn">
                        <div className="space-y-3">
                          {/* Book Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-gray-700/30 rounded-lg p-3">
                              <p className="text-xs text-gray-400 mb-1">ISBN</p>
                              <p className="text-white font-medium">
                                {loan.Book?.isbn || "Không có"}
                              </p>
                            </div>
                            <div className="bg-gray-700/30 rounded-lg p-3">
                              <p className="text-xs text-gray-400 mb-1">
                                Thể loại
                              </p>
                              <p className="text-white font-medium">
                                {loan.Book?.genre || "Không xác định"}
                              </p>
                            </div>
                          </div>

                          {/* Status Details */}
                          <div className="bg-gray-700/30 rounded-lg p-3">
                            <p className="text-xs text-gray-400 mb-2">
                              Chi tiết trạng thái
                            </p>
                            <p className="text-sm text-gray-300">
                              {statusInfo.detail}
                            </p>
                          </div>

                          {/* Renewal History */}
                          {loan.renewal_history &&
                            loan.renewal_history.length > 0 && (
                              <div className="bg-gray-700/30 rounded-lg p-3">
                                <p className="text-xs text-gray-400 mb-2">
                                  Lịch sử gia hạn
                                </p>
                                <div className="space-y-1">
                                  {loan.renewal_history.map((renewal, idx) => (
                                    <p
                                      key={idx}
                                      className="text-sm text-gray-300"
                                    >
                                      {new Date(
                                        renewal.date
                                      ).toLocaleDateString("vi-VN")}{" "}
                                      - {renewal.status}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 max-w-md mx-auto shadow-xl">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon
                  icon={faBook}
                  className="text-3xl text-gray-500"
                />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {searchTerm
                  ? "Không tìm thấy kết quả"
                  : filter === "all"
                  ? "Chưa có sách nào đang mượn"
                  : filter === "overdue"
                  ? "Không có sách quá hạn"
                  : filter === "pickup"
                  ? "Không có sách chờ nhận"
                  : filter === "pending"
                  ? "Không có yêu cầu gia hạn"
                  : "Không có sách bình thường"}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {searchTerm
                  ? "Thử tìm kiếm với từ khóa khác"
                  : filter === "all"
                  ? "Hãy mượn sách từ thư viện để bắt đầu!"
                  : "Thay đổi bộ lọc để xem các mục khác"}
              </p>
              {(filter !== "all" || searchTerm) && (
                <button
                  onClick={() => {
                    setFilter("all");
                    setSearchTerm("");
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 flex items-center gap-2 mx-auto"
                >
                  <FontAwesomeIcon icon={faArrowRight} />
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
