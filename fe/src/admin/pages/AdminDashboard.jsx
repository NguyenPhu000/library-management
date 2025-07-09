import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBook,
  FaUsers,
  FaExchangeAlt,
  FaMoneyBill,
  FaChartBar,
  FaArrowUp,
  FaArrowDown,
  FaUserTag,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaClock,
  FaCheckCircle,
  FaHourglassHalf,
  FaTicketAlt,
} from "react-icons/fa";
import adminBookService from "../services/adminBookService";
import adminUserService from "../services/adminUserService";
import adminLoanService from "../services/adminLoanService";
import adminPaymentService from "../services/adminPaymentService";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalMembers: 0,
    totalLoans: 0,
    totalPayments: 0,
    awaitingPickup: 0,
    pendingReturns: 0,
    recentLoans: [],
    recentReturns: [],
    topBooks: [],
    monthlyStats: {
      loans: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      returns: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    // Enhanced loan statistics
    activeLoans: 0,
    overdueLoans: 0,
    pendingRenewals: 0,
    totalFines: 0,
    librarySettings: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch all statistics in parallel with Enhanced APIs
        const [booksResponse, usersResponse, loanStatRes, paymentsResponse] =
          await Promise.all([
            adminBookService.getBookStats(),
            adminUserService.getUserStats(),
            adminLoanService.getLoanStatistics(), // NEW unified statistics
            adminPaymentService.getPaymentStats(),
          ]);

        const loansResponse = loanStatRes.success
          ? loanStatRes.statistics || {}
          : loanStatRes.stats || loanStatRes || {};

        // Gọi library settings nếu service có triển khai
        let settingsResponse = null;
        if (typeof adminLoanService.getLibrarySettings === "function") {
          try {
            settingsResponse = await adminLoanService.getLibrarySettings();
          } catch (err) {
            console.warn("Không lấy được library settings:", err);
          }
        }

        // Enhanced loan stats processing
        const enhancedStats = {
          totalBooks: booksResponse.data?.totalBooks || 0,
          totalUsers: usersResponse.data?.totalUsers || 0,
          totalMembers: usersResponse.data?.totalMembers || 0,

          // Enhanced loan statistics
          totalLoans:
            loansResponse.total ||
            loansResponse.totalLoans ||
            loansResponse.borrowedBooks ||
            0,
          activeLoans: loansResponse.active || loansResponse.borrowedBooks || 0,
          overdueLoans:
            loansResponse.overdue || loansResponse.overdueBooks || 0,
          awaitingPickup: loansResponse.awaitingPickup || 0,
          pendingRenewals:
            loansResponse.pendingRenewal || loansResponse.pendingRenewals || 0,
          returnsToday:
            loansResponse.returnsToday || loansResponse.returnedBooks || 0,

          totalPayments: paymentsResponse.data?.totalPayments || 0,
          totalFines: loansResponse.totalFines || 0,

          // Legacy compatibility
          pendingReturns:
            loansResponse.activeLoans ||
            loansResponse.data?.pendingReturns ||
            0,
          recentLoans: loansResponse.data?.recentLoans || [],
          recentReturns: loansResponse.data?.recentReturns || [],
          topBooks: booksResponse.data?.topBooks || [],

          monthlyStats: {
            loans: loansResponse.monthlyStats?.loans || Array(12).fill(0),
            returns: loansResponse.monthlyStats?.returns || Array(12).fill(0),
          },

          // Library settings
          librarySettings: settingsResponse?.data || null,
        };

        setStats(enhancedStats);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Calculate compliance rate
  const getComplianceRate = () => {
    if (stats.totalLoans === 0) return 100;
    const onTimeLoans = stats.totalLoans - stats.overdueLoans;
    return Math.round((onTimeLoans / stats.totalLoans) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-50 dark:bg-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Dashboard - Hệ thống Quản lý Thư viện
        </h1>
        {stats.librarySettings && (
          <div className="text-sm text-gray-600">
            <span>
              Quy tắc: {stats.librarySettings.maxBooksPerMember || 5} sách/thành
              viên,{" "}
            </span>
            <span>{stats.librarySettings.loanDurationDays || 10} ngày, </span>
            <span>
              phạt {(stats.librarySettings.finePerDay || 2000).toLocaleString()}{" "}
              VND/ngày
            </span>
          </div>
        )}
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Tổng số sách */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-blue-500 dark:border-blue-400">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Tổng số sách</p>
              <p className="text-2xl font-bold">{stats.totalBooks}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaBook className="text-blue-500 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/admin/books"
              className="text-blue-500 text-sm hover:underline"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>

        {/* Tổng số thành viên */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-green-500 dark:border-green-400">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Tổng số thành viên</p>
              <p className="text-2xl font-bold">{stats.totalMembers}</p>
              <p className="text-xs text-gray-400">
                Giới hạn: {stats.librarySettings?.maxBooksPerMember || 5}{" "}
                sách/thành viên
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaUserTag className="text-green-500 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/admin/members"
              className="text-green-500 text-sm hover:underline"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>

        {/* Sách đang được mượn (Active Loans) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-purple-500 dark:border-purple-400">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Đang được mượn</p>
              <p className="text-2xl font-bold">{stats.activeLoans}</p>
              <p className="text-xs text-gray-400">
                Tổng cộng: {stats.totalLoans} lượt mượn
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaExchangeAlt className="text-purple-500 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/admin/loans"
              className="text-purple-500 text-sm hover:underline"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>

        {/* Tổng phí phạt */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-orange-500 dark:border-orange-400">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Tổng phí phạt</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(stats.totalFines)}
              </p>
              <p className="text-xs text-gray-400">
                {(stats.librarySettings?.finePerDay || 2000).toLocaleString()}{" "}
                VND/ngày
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <FaMoneyBill className="text-orange-500 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/admin/payments"
              className="text-orange-500 text-sm hover:underline"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Chờ nhận sách */}
        <div
          className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 ${
            stats.awaitingPickup > 0 ? "border-purple-500" : "border-gray-300"
          } dark:border-purple-400`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-300">
                Chờ nhận sách
              </p>
              <p
                className={`text-2xl font-bold ${
                  stats.awaitingPickup > 0 ? "text-purple-600" : "text-gray-600"
                }`}
              >
                {stats.awaitingPickup}
              </p>
              <p className="text-xs text-gray-400">Thành viên chưa đến nhận</p>
            </div>
            <div
              className={`p-3 rounded-full ${
                stats.awaitingPickup > 0 ? "bg-purple-100" : "bg-gray-100"
              }`}
            >
              <FaTicketAlt
                className={`text-xl ${
                  stats.awaitingPickup > 0 ? "text-purple-500" : "text-gray-400"
                }`}
              />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/admin/loans?filter=pending_pickup"
              className={`text-sm hover:underline ${
                stats.awaitingPickup > 0 ? "text-purple-500" : "text-gray-400"
              }`}
            >
              Xem chi tiết
            </Link>
          </div>
        </div>

        {/* Sách quá hạn */}
        <div
          className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 ${
            stats.overdueLoans > 0 ? "border-red-500" : "border-gray-300"
          } dark:border-red-400`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-300">
                Sách quá hạn
              </p>
              <p
                className={`text-2xl font-bold ${
                  stats.overdueLoans > 0 ? "text-red-600" : "text-gray-600"
                }`}
              >
                {stats.overdueLoans}
              </p>
              <p className="text-xs text-gray-400">Cần xử lý ngay</p>
            </div>
            <div
              className={`p-3 rounded-full ${
                stats.overdueLoans > 0 ? "bg-red-100" : "bg-gray-100"
              }`}
            >
              <FaExclamationTriangle
                className={`text-xl ${
                  stats.overdueLoans > 0 ? "text-red-500" : "text-gray-400"
                }`}
              />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/admin/loans?filter=overdue"
              className={`text-sm hover:underline ${
                stats.overdueLoans > 0 ? "text-red-500" : "text-gray-400"
              }`}
            >
              Xem chi tiết
            </Link>
          </div>
        </div>

        {/* Chờ duyệt gia hạn */}
        <div
          className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 ${
            stats.pendingRenewals > 0 ? "border-yellow-500" : "border-gray-300"
          } dark:border-yellow-400`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-300">
                Chờ duyệt gia hạn
              </p>
              <p
                className={`text-2xl font-bold ${
                  stats.pendingRenewals > 0
                    ? "text-yellow-600"
                    : "text-gray-600"
                }`}
              >
                {stats.pendingRenewals}
              </p>
              <p className="text-xs text-gray-400">
                Tối đa {stats.librarySettings?.maxRenewals || 1} lần/sách
              </p>
            </div>
            <div
              className={`p-3 rounded-full ${
                stats.pendingRenewals > 0 ? "bg-yellow-100" : "bg-gray-100"
              }`}
            >
              <FaClock
                className={`text-xl ${
                  stats.pendingRenewals > 0
                    ? "text-yellow-500"
                    : "text-gray-400"
                }`}
              />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/admin/loans?filter=pending"
              className={`text-sm hover:underline ${
                stats.pendingRenewals > 0 ? "text-yellow-500" : "text-gray-400"
              }`}
            >
              Xem chi tiết
            </Link>
          </div>
        </div>

        {/* Trả sách hôm nay */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-green-500 dark:border-green-400">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Trả sách hôm nay</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.returnsToday}
              </p>
              <p className="text-xs text-gray-400">Đã xử lý</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaCheckCircle className="text-green-500 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/admin/loans?filter=returned_today"
              className="text-green-500 text-sm hover:underline"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>

        {/* Tỷ lệ tuân thủ */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-indigo-500 dark:border-indigo-400">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-300">
                Tỷ lệ tuân thủ
              </p>
              <p
                className={`text-2xl font-bold ${
                  getComplianceRate() >= 90
                    ? "text-green-600"
                    : getComplianceRate() >= 70
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {getComplianceRate()}%
              </p>
              <p className="text-xs text-gray-400">Trả đúng hạn</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <FaChartBar className="text-indigo-500 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <span
              className={`text-sm ${
                getComplianceRate() >= 90
                  ? "text-green-500"
                  : getComplianceRate() >= 70
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {getComplianceRate() >= 90
                ? "Xuất sắc"
                : getComplianceRate() >= 70
                ? "Tốt"
                : "Cần cải thiện"}
            </span>
          </div>
        </div>
      </div>

      {/* Business Rules Summary */}
      {stats.librarySettings && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
            <FaHourglassHalf className="mr-2" />
            Quy tắc Nghiệp vụ Thư viện
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-3 rounded border">
              <span className="font-medium text-blue-700">Giới hạn mượn:</span>
              <span className="ml-2">
                {stats.librarySettings.maxBooksPerMember || 5} sách/thành viên
              </span>
            </div>
            <div className="bg-white p-3 rounded border">
              <span className="font-medium text-blue-700">Thời hạn:</span>
              <span className="ml-2">
                {stats.librarySettings.loanDurationDays || 10} ngày
              </span>
            </div>
            <div className="bg-white p-3 rounded border">
              <span className="font-medium text-blue-700">Phí phạt:</span>
              <span className="ml-2">
                {(stats.librarySettings.finePerDay || 2000).toLocaleString()}{" "}
                VND/ngày
              </span>
            </div>
            <div className="bg-white p-3 rounded border">
              <span className="font-medium text-blue-700">Gia hạn tối đa:</span>
              <span className="ml-2">
                {stats.librarySettings.maxRenewals || 1} lần
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Các thống kê phụ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Thao tác nhanh</h3>
          <div className="space-y-3">
            <Link
              to="/admin/loans?filter=pending"
              className="flex items-center justify-between p-3 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/40 rounded-lg transition-colors"
            >
              <span className="flex items-center">
                <FaClock className="text-yellow-500 mr-2" />
                Duyệt gia hạn
              </span>
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                {stats.pendingRenewals}
              </span>
            </Link>

            <Link
              to="/admin/loans?filter=overdue"
              className="flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors"
            >
              <span className="flex items-center">
                <FaExclamationTriangle className="text-red-500 mr-2" />
                Xử lý quá hạn
              </span>
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                {stats.overdueLoans}
              </span>
            </Link>

            <Link
              to="/admin/loans"
              className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
            >
              <span className="flex items-center">
                <FaExchangeAlt className="text-blue-500 mr-2" />
                Quản lý mượn trả
              </span>
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                {stats.activeLoans}
              </span>
            </Link>

            {/* Chờ nhận sách */}
            <Link
              to="/admin/loans?filter=pending_pickup"
              className="flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 rounded-lg transition-colors"
            >
              <span className="flex items-center">
                <FaTicketAlt className="text-purple-500 mr-2" />
                Chờ nhận sách
              </span>
              <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs">
                {stats.awaitingPickup}
              </span>
            </Link>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 dark:text-gray-200 p-6 rounded-lg shadow-md flex-1">
          <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {stats.recentLoans.length > 0 ? (
              stats.recentLoans.slice(0, 5).map((loan, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border-l-4 border-blue-400 bg-blue-50"
                >
                  <div>
                    <p className="font-medium">{loan.Book?.title || "N/A"}</p>
                    <p className="text-sm text-gray-600">
                      {loan.Member?.full_name || "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {formatDate(loan.loan_date)}
                    </p>
                    <p className="text-xs text-blue-600">Mượn sách</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                Chưa có hoạt động gần đây
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
