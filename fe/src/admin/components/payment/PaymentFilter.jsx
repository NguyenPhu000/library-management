import React, { useState } from "react";
import {
  FaFilter,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaQrcode,
  FaSearch,
  FaTimes,
  FaDownload,
} from "react-icons/fa";

const PaymentFilter = ({ onFilterChange, onExport, loading }) => {
  const [filters, setFilters] = useState({
    status: "",
    paymentMethod: "",
    startDate: "",
    endDate: "",
    memberId: "",
    minAmount: "",
    maxAmount: "",
    searchTerm: "",
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "pending", label: "Chờ xác nhận" },
    { value: "completed", label: "Đã hoàn thành" },
    { value: "APPROVED", label: "Đã duyệt" },
    { value: "cancelled", label: "Đã hủy" },
    { value: "failed", label: "Thất bại" },
  ];

  const paymentMethodOptions = [
    { value: "", label: "Tất cả phương thức" },
    { value: "cash", label: "Tiền mặt" },
    { value: "qrcode", label: "QR Code" },
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      status: "",
      paymentMethod: "",
      startDate: "",
      endDate: "",
      memberId: "",
      minAmount: "",
      maxAmount: "",
      searchTerm: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter((value) => value !== "").length;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaFilter className="text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Bộ lọc thanh toán
          </h3>
          {getActiveFiltersCount() > 0 && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {getActiveFiltersCount()} bộ lọc
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {isExpanded ? "Thu gọn" : "Mở rộng"}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-red-600 hover:text-red-800 transition-colors flex items-center"
          >
            <FaTimes className="mr-1" />
            Xóa bộ lọc
          </button>
          <button
            onClick={onExport}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
          >
            <FaDownload className="mr-1" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phương thức
          </label>
          <select
            value={filters.paymentMethod}
            onChange={(e) =>
              handleFilterChange("paymentMethod", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {paymentMethodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Từ ngày
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đến ngày
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tìm kiếm
        </label>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo mã thành viên, mã thanh toán, ghi chú..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Bộ lọc nâng cao
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã thành viên
              </label>
              <input
                type="text"
                placeholder="Nhập mã thành viên"
                value={filters.memberId}
                onChange={(e) => handleFilterChange("memberId", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tiền tối thiểu
              </label>
              <input
                type="number"
                placeholder="0"
                value={filters.minAmount}
                onChange={(e) =>
                  handleFilterChange("minAmount", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tiền tối đa
              </label>
              <input
                type="number"
                placeholder="1000000"
                value={filters.maxAmount}
                onChange={(e) =>
                  handleFilterChange("maxAmount", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={() => handleFilterChange("status", "pending")}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            filters.status === "pending"
              ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Chờ xác nhận
        </button>
        <button
          onClick={() => handleFilterChange("status", "completed")}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            filters.status === "completed"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Đã hoàn thành
        </button>
        <button
          onClick={() => handleFilterChange("paymentMethod", "cash")}
          className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center ${
            filters.paymentMethod === "cash"
              ? "bg-purple-100 text-purple-800 border border-purple-300"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FaMoneyBillWave className="mr-1" />
          Tiền mặt
        </button>
        <button
          onClick={() => handleFilterChange("paymentMethod", "qrcode")}
          className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center ${
            filters.paymentMethod === "qrcode"
              ? "bg-pink-100 text-pink-800 border border-pink-300"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FaQrcode className="mr-1" />
          QR Code
        </button>
        <button
          onClick={() => {
            const today = new Date().toISOString().split("T")[0];
            handleFilterChange("startDate", today);
            handleFilterChange("endDate", today);
          }}
          className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center ${
            filters.startDate === new Date().toISOString().split("T")[0] &&
            filters.endDate === new Date().toISOString().split("T")[0]
              ? "bg-blue-100 text-blue-800 border border-blue-300"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FaCalendarAlt className="mr-1" />
          Hôm nay
        </button>
        <button
          onClick={() => {
            const today = new Date();
            const firstDayOfMonth = new Date(
              today.getFullYear(),
              today.getMonth(),
              1
            );
            handleFilterChange(
              "startDate",
              firstDayOfMonth.toISOString().split("T")[0]
            );
            handleFilterChange("endDate", today.toISOString().split("T")[0]);
          }}
          className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center ${
            filters.startDate ===
            new Date(new Date().getFullYear(), new Date().getMonth(), 1)
              .toISOString()
              .split("T")[0]
              ? "bg-blue-100 text-blue-800 border border-blue-300"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FaCalendarAlt className="mr-1" />
          Tháng này
        </button>
      </div>
    </div>
  );
};

export default PaymentFilter;
