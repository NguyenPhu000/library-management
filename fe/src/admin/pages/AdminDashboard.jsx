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
  FaTachometerAlt,
  FaChartLine,
  FaChartPie,
  FaBookReader,
  FaHandHoldingUsd,
  FaUserClock,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";
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
      labels: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ],
    },
    monthlyRevenueData: Array(12).fill(0), // Khởi tạo mặc định
    monthlyRevenueLabels: Array(12).fill("T X"), // Khởi tạo mặc định
    activeLoans: 0,
    overdueLoans: 0,
    pendingRenewals: 0,
    totalFines: 0,
    onlineUsers: 0,
    librarySettings: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const [booksResponse, usersResponse, loanStatRes, paymentsResponse] =
          await Promise.all([
            adminBookService.getBookStats(),
            adminUserService.getUserStats(),
            adminLoanService.getLoanStatistics(),
            adminPaymentService.getPaymentStats(), // Lấy thống kê thanh toán
          ]);

        const loansResponse = loanStatRes.success
          ? loanStatRes.statistics || {}
          : loanStatRes.stats || loanStatRes || {};

        let settingsResponse = null;
        if (typeof adminLoanService.getLibrarySettings === "function") {
          try {
            settingsResponse = await adminLoanService.getLibrarySettings();
          } catch (err) {
            console.warn("Không lấy được library settings:", err);
          }
        }

        const enhancedStats = {
          totalBooks: booksResponse.data?.totalBooks || 0,
          totalUsers: usersResponse.data?.totalUsers || 0,
          totalMembers: usersResponse.data?.totalMembers || 0,
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
          totalFines: loansResponse.totalFines || 0, // Đảm bảo lấy totalFines từ loansResponse
          onlineUsers: usersResponse.data?.onlineUsers || 0,
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
            labels:
              loansResponse.monthlyStats?.labels || Array(12).fill("Tháng X"),
          },
          // Thêm thống kê doanh thu hàng tháng từ paymentsResponse
          monthlyRevenueData:
            paymentsResponse.stats?.monthlyRevenueData || Array(12).fill(0),
          monthlyRevenueLabels:
            paymentsResponse.stats?.monthlyRevenueLabels ||
            Array(12).fill("T X"),
          librarySettings: settingsResponse?.data || null,
          totalFinesCollected: paymentsResponse.stats?.totalFinesCollected || 0, // Thêm totalFinesCollected
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

  // Helper functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getComplianceRate = () => {
    if (stats.totalLoans === 0) return 100;
    const onTimeLoans = stats.totalLoans - stats.overdueLoans;
    return Math.round((onTimeLoans / stats.totalLoans) * 100);
  };

  // Data for charts
  const monthNamesFromBackend = stats.monthlyStats.labels || [];

  const monthlyData = monthNamesFromBackend.map((monthLabel, index) => ({
    month: monthLabel,
    loans: stats.monthlyStats.loans[index] || 0,
    returns: stats.monthlyStats.returns[index] || 0,
  }));

  const loanStatusData = [
    { name: "Đang mượn", value: stats.activeLoans, color: "#3B82F6" },
    { name: "Quá hạn", value: stats.overdueLoans, color: "#EF4444" },
    { name: "Chờ nhận", value: stats.awaitingPickup, color: "#8B5CF6" },
    { name: "Chờ gia hạn", value: stats.pendingRenewals, color: "#F59E0B" },
  ];

  // Dữ liệu cho biểu đồ Tổng quan hệ thống (loại bỏ nếu thay thế)
  // const systemOverviewData = [
  //   { name: "Sách", value: stats.totalBooks, color: "#10B981" },
  //   { name: "Thành viên", value: stats.totalMembers, color: "#3B82F6" },
  //   { name: "Đang mượn", value: stats.activeLoans, color: "#8B5CF6" },
  //   { name: "Thanh toán", value: stats.totalPayments, color: "#F59E0B" },
  // ];

  // Dữ liệu cho biểu đồ Tổng quan doanh thu theo tháng
  const monthlyRevenueChartData = stats.monthlyRevenueLabels.map(
    (label, index) => ({
      month: label,
      revenue: stats.monthlyRevenueData[index] || 0,
    })
  );

  const performanceData = [
    { metric: "Tuân thủ", value: getComplianceRate(), target: 90 },
    {
      metric: "Hiệu suất",
      value: Math.round(
        (stats.activeLoans / Math.max(stats.totalBooks, 1)) * 100
      ),
      target: 70,
    },
    {
      metric: "Thu phí",
      // Sử dụng totalFinesCollected từ paymentStats. totalFines là tổng số tiền phạt phát sinh, totalFinesCollected là tổng số tiền phạt ĐÃ THU
      value: Math.round(
        (stats.totalFinesCollected / Math.max(stats.totalFines, 1)) * 100
      ),
      target: 20,
    },
  ];

  // Dọn dẹp các console.log debugging (đã di chuyển vào fetchStats nếu cần)
  // console.log("--- Debugging Performance Data ---");
  // console.log("Raw paymentsResponse:", paymentsResponse);
  // console.log("Raw loanStatRes:", loanStatRes);
  // console.log("Stats Total Revenue:", stats.totalRevenue);
  // console.log("Stats Total Fines:", stats.totalFines);
  // console.log("Stats Total Fines Collected:", stats.totalFinesCollected);
  // console.log("Calculated 'Thu phí' value:", Math.round((stats.totalFinesCollected / Math.max(stats.totalFines, 1)) * 100));

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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <FaTachometerAlt className="mr-3 text-blue-600" />
            Dashboard Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Hệ thống Quản lý Thư viện - Tổng quan chi tiết
          </p>
        </div>
        {stats.librarySettings && (
          <div className="bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <div>
                📚 {stats.librarySettings.maxBooksPerMember || 5} sách/thành
                viên
              </div>
              <div>
                ⏰ {stats.librarySettings.loanDurationDays || 10} ngày mượn
              </div>
              <div>
                💰 {(stats.librarySettings.finePerDay || 2000).toLocaleString()}{" "}
                VND/ngày phạt
              </div>
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100 text-sm">Tổng số sách</p>
              <p className="text-3xl font-bold">
                {stats.totalBooks.toLocaleString()}
              </p>
              <p className="text-blue-100 text-xs mt-1">
                {Math.round(
                  (stats.activeLoans / Math.max(stats.totalBooks, 1)) * 100
                )}
                % đang được mượn
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <FaBook className="text-2xl" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-400">
            <Link
              to="/admin/books"
              className="text-blue-100 hover:text-white text-sm font-medium"
            >
              Quản lý sách →
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-100 text-sm">Thành viên</p>
              <p className="text-3xl font-bold">
                {stats.totalMembers.toLocaleString()}
              </p>
              <p className="text-green-100 text-xs mt-1">
                {Math.round(
                  (stats.activeLoans / Math.max(stats.totalMembers, 1)) * 100
                ) / 100}{" "}
                sách/người
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <FaUsers className="text-2xl" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-green-400">
            <Link
              to="/admin/members"
              className="text-green-100 hover:text-white text-sm font-medium"
            >
              Quản lý thành viên →
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-purple-100 text-sm">Đang mượn</p>
              <p className="text-3xl font-bold">
                {stats.activeLoans.toLocaleString()}
              </p>
              <p className="text-purple-100 text-xs mt-1">
                {stats.overdueLoans > 0 && `${stats.overdueLoans} quá hạn`}
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <FaBookReader className="text-2xl" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-purple-400">
            <Link
              to="/admin/loans"
              className="text-purple-100 hover:text-white text-sm font-medium"
            >
              Quản lý mượn trả →
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-orange-100 text-sm">Tổng phí phạt</p>
              <p className="text-3xl font-bold">
                {formatCurrency(stats.totalFines).replace("₫", "")}
              </p>
              <p className="text-orange-100 text-xs mt-1">VND</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <FaHandHoldingUsd className="text-2xl" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-orange-400">
            <Link
              to="/admin/payments"
              className="text-orange-100 hover:text-white text-sm font-medium"
            >
              Quản lý thanh toán →
            </Link>
          </div>
        </div>

        {/* Online Users */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-indigo-100 text-sm">Online</p>
              <p className="text-3xl font-bold">
                {(stats.onlineUsers || 0).toLocaleString()}
              </p>
              <p className="text-indigo-100 text-xs mt-1">đang hoạt động</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <FaUserClock className="text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          className={`p-4 rounded-lg border-l-4 ${
            stats.awaitingPickup > 0
              ? "bg-purple-50 border-purple-500 dark:bg-purple-900/20"
              : "bg-gray-50 border-gray-300 dark:bg-gray-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chờ nhận sách
              </p>
              <p
                className={`text-2xl font-bold ${
                  stats.awaitingPickup > 0 ? "text-purple-600" : "text-gray-400"
                }`}
              >
                {stats.awaitingPickup}
              </p>
            </div>
            <FaTicketAlt
              className={`text-2xl ${
                stats.awaitingPickup > 0 ? "text-purple-500" : "text-gray-400"
              }`}
            />
          </div>
          {stats.awaitingPickup > 0 && (
            <div className="mt-2">
              <Link
                to="/admin/loans?filter=pending_pickup"
                className="text-purple-600 text-sm hover:underline"
              >
                Xem chi tiết →
              </Link>
            </div>
          )}
        </div>

        <div
          className={`p-4 rounded-lg border-l-4 ${
            stats.overdueLoans > 0
              ? "bg-red-50 border-red-500 dark:bg-red-900/20"
              : "bg-gray-50 border-gray-300 dark:bg-gray-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sách quá hạn
              </p>
              <p
                className={`text-2xl font-bold ${
                  stats.overdueLoans > 0 ? "text-red-600" : "text-gray-400"
                }`}
              >
                {stats.overdueLoans}
              </p>
            </div>
            <FaExclamationTriangle
              className={`text-2xl ${
                stats.overdueLoans > 0 ? "text-red-500" : "text-gray-400"
              }`}
            />
          </div>
          {stats.overdueLoans > 0 && (
            <div className="mt-2">
              <Link
                to="/admin/loans?filter=overdue"
                className="text-red-600 text-sm hover:underline"
              >
                Xử lý ngay →
              </Link>
            </div>
          )}
        </div>

        <div
          className={`p-4 rounded-lg border-l-4 ${
            stats.pendingRenewals > 0
              ? "bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20"
              : "bg-gray-50 border-gray-300 dark:bg-gray-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chờ gia hạn
              </p>
              <p
                className={`text-2xl font-bold ${
                  stats.pendingRenewals > 0
                    ? "text-yellow-600"
                    : "text-gray-400"
                }`}
              >
                {stats.pendingRenewals}
              </p>
            </div>
            <FaUserClock
              className={`text-2xl ${
                stats.pendingRenewals > 0 ? "text-yellow-500" : "text-gray-400"
              }`}
            />
          </div>
          {stats.pendingRenewals > 0 && (
            <div className="mt-2">
              <Link
                to="/admin/loans?filter=pending"
                className="text-yellow-600 text-sm hover:underline"
              >
                Duyệt ngay →
              </Link>
            </div>
          )}
        </div>

        <div className="p-4 rounded-lg border-l-4 bg-green-50 border-green-500 dark:bg-green-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tuân thủ
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
            </div>
            <FaChartLine
              className={`text-2xl ${
                getComplianceRate() >= 90
                  ? "text-green-500"
                  : getComplianceRate() >= 70
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Loans vs Returns */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-4">
            <FaChartBar className="text-blue-600 text-xl mr-2" />
            <h3 className="text-lg font-semibold">
              Thống kê mượn trả theo tháng
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="loans" fill="#3B82F6" name="Mượn sách" />
              <Line
                type="monotone"
                dataKey="returns"
                stroke="#10B981"
                strokeWidth={3}
                name="Trả sách"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Loan Status Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-4">
            <FaChartPie className="text-purple-600 text-xl mr-2" />
            <h3 className="text-lg font-semibold">
              Phân bổ trạng thái mượn sách
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={loanStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {loanStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* System Overview (Thay thế bằng Tổng quan doanh thu theo tháng) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-4">
            <FaMoneyBill className="text-green-600 text-xl mr-2" />
            <h3 className="text-lg font-semibold">
              Tổng quan doanh thu theo tháng
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyRevenueChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickFormatter={(tick) => `T${parseInt(tick.split("-")[1])}`}
              />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                fill="#10B981"
                name="Doanh thu"
                activeDot={{ r: 8 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-4">
            <FaTachometerAlt className="text-orange-600 text-xl mr-2" />
            <h3 className="text-lg font-semibold">Chỉ số hiệu suất</h3>
          </div>
          <div className="space-y-4">
            {performanceData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.metric}</span>
                  <span
                    className={`font-bold ${
                      item.value >= item.target
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.value}% / {item.target}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      item.value >= item.target ? "bg-green-500" : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(item.value, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaClock className="text-blue-600 mr-2" />
            Hoạt động gần đây
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {stats.recentLoans.length > 0 ? (
              stats.recentLoans.slice(0, 5).map((loan, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400"
                >
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {loan.Book?.title || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {loan.Member?.full_name || "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(loan.loan_date)}
                    </p>
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Mượn sách
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaClock className="text-3xl mb-2 mx-auto opacity-50" />
                <p>Chưa có hoạt động gần đây</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaExchangeAlt className="text-green-600 mr-2" />
            Thao tác nhanh
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <Link
              to="/admin/loans?filter=pending"
              className="flex items-center justify-between p-4 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/40 rounded-lg transition-all duration-200 border border-yellow-200 hover:border-yellow-300"
            >
              <div className="flex items-center">
                <FaClock className="text-yellow-600 mr-3 text-lg" />
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    Duyệt gia hạn
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Yêu cầu đang chờ
                  </p>
                </div>
              </div>
              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {stats.pendingRenewals}
              </span>
            </Link>

            <Link
              to="/admin/loans?filter=overdue"
              className="flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300"
            >
              <div className="flex items-center">
                <FaExclamationTriangle className="text-red-600 mr-3 text-lg" />
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    Xử lý quá hạn
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Cần xử lý ngay
                  </p>
                </div>
              </div>
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {stats.overdueLoans}
              </span>
            </Link>

            <Link
              to="/admin/loans?filter=pending_pickup"
              className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 rounded-lg transition-all duration-200 border border-purple-200 hover:border-purple-300"
            >
              <div className="flex items-center">
                <FaTicketAlt className="text-purple-600 mr-3 text-lg" />
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    Chờ nhận sách
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Thành viên chưa đến
                  </p>
                </div>
              </div>
              <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {stats.awaitingPickup}
              </span>
            </Link>

            <Link
              to="/admin/loans"
              className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300"
            >
              <div className="flex items-center">
                <FaBookReader className="text-blue-600 mr-3 text-lg" />
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    Quản lý mượn trả
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tất cả hoạt động
                  </p>
                </div>
              </div>
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {stats.activeLoans}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
