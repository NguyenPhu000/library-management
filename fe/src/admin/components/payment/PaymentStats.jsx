import React, { useState, useEffect } from "react";
import {
  FaMoneyBillWave,
  FaChartLine,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaQrcode,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import adminPaymentService from "../../services/adminPaymentService";

const PaymentStats = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPayments: 0,
    pendingPayments: 0,
    completedPayments: 0,
    cashPayments: 0,
    qrPayments: 0,
    monthlyRevenue: 0,
    dailyRevenue: 0,
    averagePayment: 0,
    revenueGrowth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminPaymentService.getPaymentStats(
        dateRange.startDate,
        dateRange.endDate
      );

      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error("Error fetching payment stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const StatCard = ({ title, value, icon: Icon, color, subtext, trend }) => (
    <div
      className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-shadow duration-300"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {subtext && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtext}
            </p>
          )}
          {trend && (
            <div
              className={`flex items-center mt-2 text-xs ${
                trend > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend > 0 ? (
                <FaArrowUp className="mr-1" />
              ) : (
                <FaArrowDown className="mr-1" />
              )}
              {Math.abs(trend)}% so với tháng trước
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: color + "20" }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-xl shadow-lg p-6 h-32"
            >
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-xl shadow-lg p-6 h-48"
            >
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <div className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-600" />
            Khoảng thời gian thống kê
          </h3>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Cập nhật
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Từ ngày
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Đến ngày
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng doanh thu"
          value={formatCurrency(stats.totalRevenue)}
          icon={FaMoneyBillWave}
          color="#10B981"
          subtext="Tổng thu từ phí phạt"
          trend={stats.revenueGrowth}
        />
        <StatCard
          title="Tổng thanh toán"
          value={formatNumber(stats.totalPayments)}
          icon={FaChartLine}
          color="#3B82F6"
          subtext="Số lượng giao dịch"
        />
        <StatCard
          title="Chờ xác nhận"
          value={formatNumber(stats.pendingPayments)}
          icon={FaClock}
          color="#F59E0B"
          subtext="Cần xử lý"
        />
        <StatCard
          title="Đã hoàn thành"
          value={formatNumber(stats.completedPayments)}
          icon={FaCheckCircle}
          color="#059669"
          subtext="Đã xác nhận"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Thanh toán tiền mặt"
          value={formatNumber(stats.cashPayments)}
          icon={FaMoneyBillWave}
          color="#8B5CF6"
          subtext={`${
            stats.totalPayments > 0
              ? ((stats.cashPayments / stats.totalPayments) * 100).toFixed(1)
              : 0
          }% tổng số`}
        />
        <StatCard
          title="Thanh toán QR"
          value={formatNumber(stats.qrPayments)}
          icon={FaQrcode}
          color="#EC4899"
          subtext={`${
            stats.totalPayments > 0
              ? ((stats.qrPayments / stats.totalPayments) * 100).toFixed(1)
              : 0
          }% tổng số`}
        />
        <StatCard
          title="Doanh thu tháng"
          value={formatCurrency(stats.monthlyRevenue)}
          icon={FaArrowUp}
          color="#06B6D4"
          subtext="Tháng hiện tại"
        />
        <StatCard
          title="Trung bình/giao dịch"
          value={formatCurrency(stats.averagePayment)}
          icon={FaChartLine}
          color="#F97316"
          subtext="Giá trị trung bình"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Chart */}
        <div className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Phương thức thanh toán
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded mr-3"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tiền mặt
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatNumber(stats.cashPayments)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stats.totalPayments > 0
                    ? (
                        (stats.cashPayments / stats.totalPayments) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    stats.totalPayments > 0
                      ? (stats.cashPayments / stats.totalPayments) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-pink-500 rounded mr-3"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  QR Code
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatNumber(stats.qrPayments)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stats.totalPayments > 0
                    ? ((stats.qrPayments / stats.totalPayments) * 100).toFixed(
                        1
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    stats.totalPayments > 0
                      ? (stats.qrPayments / stats.totalPayments) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Trạng thái thanh toán
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Đã hoàn thành
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatNumber(stats.completedPayments)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stats.totalPayments > 0
                    ? (
                        (stats.completedPayments / stats.totalPayments) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    stats.totalPayments > 0
                      ? (stats.completedPayments / stats.totalPayments) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Chờ xác nhận
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatNumber(stats.pendingPayments)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stats.totalPayments > 0
                    ? (
                        (stats.pendingPayments / stats.totalPayments) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    stats.totalPayments > 0
                      ? (stats.pendingPayments / stats.totalPayments) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStats;
