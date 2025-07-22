import React, { useState } from "react";
import { FaSearch, FaTimes, FaFilter } from "react-icons/fa";
import { useLoanAdmin } from "../../contexts/LoanAdminContext";

const LoanSearchForm = () => {
  const {
    searchTerm,
    searchCriteria,
    statusFilter,
    renewalFilter,
    handleSearch,
    clearSearch,
    setFilters,
  } = useLoanAdmin();

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localCriteria, setLocalCriteria] = useState(searchCriteria);
  const [localStatusFilter, setLocalStatusFilter] = useState(statusFilter);
  const [localRenewalFilter, setLocalRenewalFilter] = useState(renewalFilter);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(localSearchTerm, localCriteria);
    setFilters(localStatusFilter, localRenewalFilter);
  };

  const handleClear = () => {
    setLocalSearchTerm("");
    setLocalCriteria("member_code");
    setLocalStatusFilter("all");
    setLocalRenewalFilter("all");
    clearSearch();
    setFilters("all", "all");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Search Criteria */}
        <div>
          <label
            htmlFor="criteria"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Tìm kiếm theo
          </label>
          <select
            id="criteria"
            value={localCriteria}
            onChange={(e) => setLocalCriteria(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="member_code">Mã thành viên</option>
            <option value="book_title">Tên sách</option>
            <option value="pickup_code">Mã phiếu mượn (PICK-XXXX)</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="sm:col-span-1 lg:col-span-2">
          <label
            htmlFor="query"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Từ khóa tìm kiếm
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            {localCriteria === "pickup_code" ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none text-gray-500 dark:text-gray-400 text-sm font-mono">
                  PICK-
                </div>
                <input
                  type="text"
                  id="query"
                  value={localSearchTerm.replace(/^PICK-/, "")}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^A-Z0-9]/gi, "")
                      .toUpperCase()
                      .slice(0, 4);
                    setLocalSearchTerm(value ? `PICK-${value}` : "");
                  }}
                  placeholder="XXXX"
                  className="w-full pl-20 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  maxLength={4}
                />
              </div>
            ) : (
              <input
                type="text"
                id="query"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                placeholder={
                  localCriteria === "member_code"
                    ? "Nhập mã thành viên..."
                    : localCriteria === "book_title"
                    ? "Nhập tên sách..."
                    : "Nhập từ khóa tìm kiếm..."
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        </div>

        {/* Status Filter - ENHANCED cho quy trình 5 giai đoạn */}
        <div>
          <label
            htmlFor="statusFilter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Trạng thái
          </label>
          <select
            id="statusFilter"
            value={localStatusFilter}
            onChange={(e) => setLocalStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả</option>
            <option value="requested">🟦 Chờ duyệt</option>
            <option value="approved">🟩 Đã duyệt - Chờ nhận</option>
            <option value="borrowed">🟨 Đang mượn</option>
            <option value="overdue">🟥 Quá hạn</option>
            <option value="returned">⚪ Đã trả</option>
            <option value="rejected">🔴 Bị từ chối</option>
          </select>
        </div>

        {/* Renewal Filter */}
        <div>
          <label
            htmlFor="renewalFilter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Gia hạn
          </label>
          <select
            id="renewalFilter"
            value={localRenewalFilter}
            onChange={(e) => setLocalRenewalFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
            <option value="none">Không yêu cầu</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-end space-x-2">
          <button
            type="submit"
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaSearch className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Tìm kiếm</span>
            <span className="sm:hidden">Tìm</span>
          </button>

          {(searchTerm ||
            localSearchTerm ||
            statusFilter !== "all" ||
            renewalFilter !== "all") && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center justify-center px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              title="Xóa bộ lọc"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default LoanSearchForm;
