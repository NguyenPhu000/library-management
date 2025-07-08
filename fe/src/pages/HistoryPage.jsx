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
  faClock,
  faMoneyBill,
  faHistory,
  faFilter,
  faSearch,
  faInfoCircle,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { usePayment } from "../contexts/PaymentContext";
import Swal from "sweetalert2";

const LoanHistory = () => {
  const { loanHistory, fetchLoanHistory, loading, error } = useLoan();
  const { payments, isPaymentCompleted, isPaymentPending } = usePayment();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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
          <div className="w-16 h-16 border-4 border-gray-700 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 animate-pulse">Đang tải lịch sử...</p>
        </div>
      </div>
    );
  }

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
            onClick={() => fetchLoanHistory()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-emerald-500/25"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Lọc chỉ hiển thị các loan đã trả hoặc hoàn thành
  const sortedLoanHistory = [...loanHistory].sort((a, b) => {
    // Ưu tiên sắp xếp theo trạng thái thanh toán và số tiền phạt
    const aHasFine = a.fine_amount > 0;
    const bHasFine = b.fine_amount > 0;
    const aIsPaid = isPaymentCompleted(a.loan_id);
    const bIsPaid = isPaymentCompleted(b.loan_id);

    if (aHasFine && !aIsPaid && (!bHasFine || bIsPaid)) return -1;
    if (bHasFine && !bIsPaid && (!aHasFine || aIsPaid)) return 1;

    // Nếu cùng trạng thái, sắp xếp theo thời gian mượn gần đây nhất
    return new Date(b.loan_date) - new Date(a.loan_date);
  });

  // Lọc chỉ lấy các loan đã trả hoặc hoàn thành
  const historyOnly = sortedLoanHistory.filter((loan) =>
    ["returned", "completed"].includes(loan.status)
  );

  const filteredHistory = historyOnly.filter((loan) => {
    const matchesSearch =
      loan.Book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.Book?.isbn?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "all") return true;
    if (filter === "fined") return loan.fine_amount > 0;
    if (filter === "paid")
      return loan.fine_amount > 0 && isPaymentCompleted(loan.loan_id);
    if (filter === "unpaid")
      return loan.fine_amount > 0 && !isPaymentCompleted(loan.loan_id);
    return true;
  });

  const getStatusInfo = (loan) => {
    const hasFine = loan.fine_amount > 0;
    const loanPayments = payments
      .filter((p) => p.Loan.loan_id === loan.loan_id)
      .sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date));
    const latest = loanPayments[0];
    const statusLower = (latest?.status || "").toLowerCase();
    const isPaid = ["completed", "approved"].includes(statusLower);

    if (hasFine) {
      if (isPaid) {
        return {
          icon: faCheckCircle,
          color: "text-emerald-400",
          bg: "bg-emerald-500/20",
          border: "border-emerald-500/30",
          text: "Đã xác nhận",
          glow: "shadow-emerald-500/20",
        };
      } else if (statusLower === "processing") {
        return {
          icon: faClock,
          color: "text-amber-400",
          bg: "bg-amber-500/20",
          border: "border-amber-500/30",
          text: "Chờ xác nhận",
          glow: "shadow-amber-500/20",
        };
      } else if (statusLower === "pending") {
        return {
          icon: faMoneyBill,
          color: "text-orange-400",
          bg: "bg-orange-500/20",
          border: "border-orange-500/30",
          text: "Chưa chuyển khoản",
          glow: "shadow-orange-500/20",
        };
      } else {
        return {
          icon: faMoneyBill,
          color: "text-red-400",
          bg: "bg-red-500/20",
          border: "border-red-500/30",
          text: "Chưa đóng phạt",
          glow: "shadow-red-500/20",
        };
      }
    }
    return {
      icon: faHistory,
      color: "text-blue-400",
      bg: "bg-blue-500/20",
      border: "border-blue-500/30",
      text: "Hoàn thành",
      glow: "shadow-blue-500/20",
    };
  };

  // Map status sang tiếng Việt
  const getStatusText = (status) => {
    switch (status) {
      case "returned":
        return "Đã trả";
      case "completed":
        return "Hoàn thành";
      case "borrowed":
        return "Đang mượn";
      case "pending_pickup":
        return "Chờ nhận";
      case "requested":
        return "Chờ duyệt";
      case "approved":
        return "Đã duyệt";
      default:
        return status;
    }
  };

  // Tổng hợp thống kê phạt
  const finedCount = loanHistory.filter((loan) => loan.fine_amount > 0).length;

  // Hàm lấy trạng thái thanh toán mới nhất của khoản vay (nếu có)
  const getLatestPaymentStatus = (loanId) => {
    const loanPayments = payments
      .filter((p) => p.Loan.loan_id === loanId)
      .sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date));
    return (loanPayments[0]?.status || "").toLowerCase();
  };

  let unpaidCount = 0; // chưa có payment hoặc status pending
  let processingCount = 0; // đã chuyển khoản, chờ xác nhận

  loanHistory.forEach((loan) => {
    if (loan.fine_amount <= 0) return;
    const status = getLatestPaymentStatus(loan.loan_id);

    if (status === "processing") {
      processingCount += 1;
    } else if (status === "completed" || status === "approved") {
      // Đã thanh toán, bỏ qua
    } else {
      // Chưa có payment hoặc pending
      unpaidCount += 1;
    }
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon
                icon={faHistory}
                className="text-emerald-400 text-xl"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Lịch sử mượn sách
              </h1>
              <p className="text-gray-400 mt-1">
                Xem lại các lần mượn sách và tình trạng thanh toán
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Tổng số lần mượn</p>
                <p className="text-2xl font-bold text-white">
                  {loanHistory.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <FontAwesomeIcon
                  icon={faBook}
                  className="text-blue-400 text-xl"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Có phạt trễ</p>
                <p className="text-2xl font-bold text-orange-400">
                  {finedCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <FontAwesomeIcon
                  icon={faClock}
                  className="text-orange-400 text-xl"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Đã thanh toán</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {
                    loanHistory.filter(
                      (loan) =>
                        loan.fine_amount > 0 && isPaymentCompleted(loan.loan_id)
                    ).length
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-emerald-400 text-xl"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Chưa thanh toán</p>
                <p className="text-2xl font-bold text-red-400">{unpaidCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <FontAwesomeIcon
                  icon={faMoneyBill}
                  className="text-red-400 text-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên sách hoặc ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "all", label: "Tất cả", icon: faBook, color: "gray" },
                  {
                    key: "fined",
                    label: "Có phạt",
                    icon: faClock,
                    color: "orange",
                  },
                  {
                    key: "paid",
                    label: "Đã đóng",
                    icon: faCheckCircle,
                    color: "emerald",
                  },
                  {
                    key: "unpaid",
                    label: "Chưa đóng",
                    icon: faMoneyBill,
                    color: "red",
                  },
                ].map(({ key, label, icon, color }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filter === key
                        ? `bg-${color}-500 text-white shadow-lg shadow-${color}-500/25`
                        : "bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600"
                    }`}
                  >
                    <FontAwesomeIcon icon={icon} className="text-sm" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Warning Messages */}
        {unpaidCount > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6 backdrop-blur-sm">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="text-red-400 text-xl"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-red-300 font-semibold text-lg mb-1">
                  Bạn có {unpaidCount} khoản phạt chưa thanh toán
                </h3>
                <p className="text-red-300/80 text-sm">
                  Vui lòng thanh toán để tiếp tục sử dụng dịch vụ thư viện một
                  cách thuận tiện
                </p>
              </div>
            </div>
          </div>
        )}

        {processingCount > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-6 backdrop-blur-sm">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon
                  icon={faClock}
                  className="text-amber-400 text-xl"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-amber-300 font-semibold text-lg mb-1">
                  Bạn có {processingCount} khoản phạt đang chờ xác nhận
                </h3>
                <p className="text-amber-300/80 text-sm">
                  Bộ phận thư viện sẽ xác nhận trong vòng 24h, vui lòng kiểm tra
                  lại sau
                </p>
              </div>
            </div>
          </div>
        )}

        {/* History List */}
        {filteredHistory.length > 0 ? (
          <div className="space-y-4">
            {filteredHistory.map((loan) => {
              const isExpanded = expandedCard === loan.loan_id;
              const statusInfo = getStatusInfo(loan);
              const hasFine = loan.fine_amount > 0;
              const isPaid = isPaymentCompleted(loan.loan_id);
              const isPend = isPaymentPending(loan.loan_id);
              const loanDuration = loan.return_date
                ? Math.ceil(
                    (new Date(loan.return_date) - new Date(loan.loan_date)) /
                      (1000 * 60 * 60 * 24)
                  )
                : Math.ceil(
                    (new Date() - new Date(loan.loan_date)) /
                      (1000 * 60 * 60 * 24)
                  );

              return (
                <div
                  key={loan.loan_id}
                  className={`bg-gray-800 rounded-xl border ${statusInfo.border} overflow-hidden transition-all duration-300 hover:shadow-lg ${statusInfo.glow}`}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div
                            className={`w-10 h-10 ${statusInfo.bg} rounded-lg flex items-center justify-center`}
                          >
                            <FontAwesomeIcon
                              icon={statusInfo.icon}
                              className={`${statusInfo.color} text-lg`}
                            />
                          </div>
                          <h3 className="text-xl font-semibold text-white">
                            {loan.Book?.title || "Không có tiêu đề"}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>
                            ISBN: {loan.Book?.isbn || loan.isbn || "N/A"}
                          </span>
                          <span>•</span>
                          <span>Mã mượn: #{loan.loan_id}</span>
                        </div>
                      </div>
                      <div
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} border`}
                      >
                        {statusInfo.text}
                      </div>
                    </div>

                    {/* Main Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-gray-700/50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1 flex items-center">
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="mr-2 text-blue-400"
                          />
                          Ngày mượn
                        </p>
                        <p className="text-white font-medium">
                          {new Date(loan.loan_date).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1 flex items-center">
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="mr-2 text-amber-400"
                          />
                          Hạn trả
                        </p>
                        <p className="text-white font-medium">
                          {new Date(loan.due_date).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1 flex items-center">
                          <FontAwesomeIcon
                            icon={faClock}
                            className="mr-2 text-emerald-400"
                          />
                          Thời gian mượn
                        </p>
                        <p className="text-white font-medium">
                          {loanDuration} ngày
                        </p>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1 flex items-center">
                          <FontAwesomeIcon
                            icon={faHistory}
                            className="mr-2 text-purple-400"
                          />
                          Gia hạn
                        </p>
                        <p className="text-white font-medium">
                          {loan.renewal_count || 0} lần
                        </p>
                      </div>
                    </div>

                    {/* Fine Info */}
                    {hasFine &&
                      !isPaid &&
                      (() => {
                        // Xác định màu nền & viền theo trạng thái thanh toán
                        const loanPayments = payments
                          .filter((p) => p.Loan.loan_id === loan.loan_id)
                          .sort(
                            (a, b) =>
                              new Date(b.payment_date) -
                              new Date(a.payment_date)
                          );
                        const latestStatus = (
                          loanPayments[0]?.status || ""
                        ).toLowerCase();
                        const fineContainerClass =
                          !loanPayments[0] || latestStatus === "pending"
                            ? "bg-red-500/10 border border-red-500/30"
                            : latestStatus === "processing"
                            ? "bg-amber-500/10 border border-amber-500/30"
                            : "bg-emerald-500/10 border border-emerald-500/30"; // completed/approved

                        const fineTextColor =
                          !loanPayments[0] || latestStatus === "pending"
                            ? "text-red-400"
                            : latestStatus === "processing"
                            ? "text-amber-400"
                            : "text-emerald-400";

                        return (
                          <div
                            className={`mt-4 p-4 rounded-lg ${fineContainerClass} backdrop-blur-sm`}
                          >
                            <div className="flex justify-between items-center mb-3">
                              <span
                                className={`font-medium ${fineTextColor} flex items-center`}
                              >
                                <FontAwesomeIcon
                                  icon={faMoneyBill}
                                  className="mr-2"
                                />
                                Phí phạt trễ hạn:
                              </span>
                              <span
                                className={`font-bold text-lg ${fineTextColor}`}
                              >
                                {loan.fine_amount.toLocaleString()} VND
                              </span>
                            </div>
                            {loan.return_date && (
                              <p className="text-sm text-gray-400 mb-3">
                                <FontAwesomeIcon
                                  icon={faCalendarAlt}
                                  className="mr-2 text-gray-500"
                                />
                                Trả sách:{" "}
                                {new Date(loan.return_date).toLocaleDateString(
                                  "vi-VN"
                                )}{" "}
                                <span className="text-red-400">
                                  (
                                  {Math.ceil(
                                    (new Date(loan.return_date) -
                                      new Date(loan.due_date)) /
                                      (1000 * 60 * 60 * 24)
                                  )}{" "}
                                  ngày trễ hạn)
                                </span>
                              </p>
                            )}
                            <div className="mt-3 flex items-center gap-3">
                              {/* Lấy payment mới nhất của khoản vay */}
                              {(() => {
                                const loanPayments = payments
                                  .filter(
                                    (p) => p.Loan.loan_id === loan.loan_id
                                  )
                                  .sort(
                                    (a, b) =>
                                      new Date(b.payment_date) -
                                      new Date(a.payment_date)
                                  );
                                const latest = loanPayments[0];
                                const status = (
                                  latest?.status || ""
                                ).toLowerCase();

                                if (!latest) {
                                  // Chưa có payment nào => hiển thị thanh toán ngay
                                  return (
                                    <>
                                      <span className="text-red-400 font-semibold flex items-center">
                                        <FontAwesomeIcon
                                          icon={faExclamationTriangle}
                                          className="mr-2"
                                        />
                                        Chưa đóng phạt
                                      </span>
                                      <button
                                        onClick={() => openModal(loan.loan_id)}
                                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-red-500/25"
                                      >
                                        <FontAwesomeIcon icon={faCreditCard} />
                                        Thanh toán ngay
                                      </button>
                                    </>
                                  );
                                }

                                if (status === "pending") {
                                  return (
                                    <>
                                      <span className="text-amber-400 font-semibold flex items-center">
                                        <FontAwesomeIcon
                                          icon={faClock}
                                          className="mr-2"
                                        />
                                        Chưa chuyển khoản
                                      </span>
                                      <button
                                        onClick={() => openModal(loan.loan_id)}
                                        className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-amber-500/25"
                                      >
                                        <FontAwesomeIcon icon={faCreditCard} />
                                        Tạo lại thanh toán
                                      </button>
                                    </>
                                  );
                                }

                                if (status === "processing") {
                                  return (
                                    <span className="text-amber-400 font-semibold flex items-center">
                                      <FontAwesomeIcon
                                        icon={faClock}
                                        className="mr-2 animate-pulse"
                                      />
                                      Đã chuyển khoản - chờ xác nhận
                                    </span>
                                  );
                                }

                                // Các trạng thái khác (đã xác nhận)
                                return (
                                  <span className="text-emerald-400 font-semibold flex items-center">
                                    <FontAwesomeIcon
                                      icon={faCheckCircle}
                                      className="mr-2"
                                    />
                                    Đã xác nhận
                                  </span>
                                );
                              })()}
                            </div>
                          </div>
                        );
                      })()}
                    {hasFine && isPaid && (
                      <div className="mt-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-medium text-emerald-400 flex items-center">
                            <FontAwesomeIcon
                              icon={faMoneyBill}
                              className="mr-2"
                            />
                            Phí phạt trễ hạn:
                          </span>
                          <span className="font-bold text-lg text-emerald-400">
                            {loan.fine_amount.toLocaleString()} VND
                          </span>
                        </div>
                        {loan.return_date && (
                          <p className="text-sm text-gray-400 mb-3">
                            <FontAwesomeIcon
                              icon={faCalendarAlt}
                              className="mr-2 text-gray-500"
                            />
                            Trả sách:{" "}
                            {new Date(loan.return_date).toLocaleDateString(
                              "vi-VN"
                            )}{" "}
                            <span className="text-emerald-400">
                              (
                              {Math.ceil(
                                (new Date(loan.return_date) -
                                  new Date(loan.due_date)) /
                                  (1000 * 60 * 60 * 24)
                              )}{" "}
                              ngày trễ hạn)
                            </span>
                          </p>
                        )}
                        <span className="text-emerald-400 font-semibold flex items-center">
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="mr-2"
                          />
                          Đã đóng phạt
                        </span>
                      </div>
                    )}

                    {/* Expand/Collapse */}
                    <button
                      onClick={() =>
                        setExpandedCard(isExpanded ? null : loan.loan_id)
                      }
                      className="mt-4 text-gray-400 hover:text-emerald-400 text-sm flex items-center transition-all duration-200 group"
                    >
                      <span className="group-hover:mr-3 transition-all duration-200">
                        {isExpanded ? "Thu gọn" : "Xem thêm"}
                      </span>
                      <FontAwesomeIcon
                        icon={isExpanded ? faChevronUp : faChevronDown}
                        className="ml-2 group-hover:text-emerald-400 transition-all duration-200"
                      />
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-700 animate-fadeIn">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center">
                              <FontAwesomeIcon
                                icon={faInfoCircle}
                                className="mr-2"
                              />
                              Chi tiết thêm
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-gray-700/30 rounded-lg p-3">
                                <p className="text-xs text-gray-400 mb-1">
                                  Trạng thái mượn
                                </p>
                                <p className="text-white font-medium">
                                  {getStatusText(loan.status)}
                                </p>
                              </div>
                              <div className="bg-gray-700/30 rounded-lg p-3">
                                <p className="text-xs text-gray-400 mb-1">
                                  Trạng thái gia hạn
                                </p>
                                <p className="font-medium">
                                  <span
                                    className={
                                      loan.renewal_status === "approved"
                                        ? "text-emerald-400"
                                        : loan.renewal_status === "pending"
                                        ? "text-amber-400"
                                        : loan.renewal_status === "rejected"
                                        ? "text-red-400"
                                        : "text-gray-400"
                                    }
                                  >
                                    {loan.renewal_status === "approved"
                                      ? "Đã duyệt"
                                      : loan.renewal_status === "pending"
                                      ? "Đang chờ duyệt"
                                      : loan.renewal_status === "rejected"
                                      ? "Từ chối"
                                      : "Chưa gia hạn"}
                                  </span>
                                </p>
                              </div>
                              {loan.notes && (
                                <div className="bg-gray-700/30 rounded-lg p-3 md:col-span-2">
                                  <p className="text-xs text-gray-400 mb-1">
                                    Ghi chú
                                  </p>
                                  <p className="text-white">{loan.notes}</p>
                                </div>
                              )}
                            </div>
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
          <div className="text-center py-12">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon
                  icon={faBook}
                  className="text-3xl text-gray-500"
                />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {filter === "all"
                  ? "Chưa có lịch sử mượn sách"
                  : filter === "fined"
                  ? "Không có khoản phạt nào"
                  : filter === "paid"
                  ? "Không có khoản phạt đã đóng"
                  : "Không có khoản phạt chưa đóng"}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {filter === "all"
                  ? "Khi bạn trả sách, lịch sử sẽ xuất hiện ở đây!"
                  : "Thay đổi bộ lọc để xem các mục khác"}
              </p>
              {filter !== "all" && (
                <button
                  onClick={() => setFilter("all")}
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

      <PaymentRequestModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        loanId={selectedLoanId}
      />
    </div>
  );
};

export default LoanHistory;
