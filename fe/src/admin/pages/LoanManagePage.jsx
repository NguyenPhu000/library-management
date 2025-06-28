import React, { useEffect } from "react";
import {
  FaBookReader,
  FaSync,
  FaClock,
  FaCheck,
  FaExclamationTriangle,
  FaClipboardList,
} from "react-icons/fa";
import { LoanAdminProvider, useLoanAdmin } from "../contexts/LoanAdminContext";
import LoanSearchForm from "../components/loan/LoanSearchForm";
import LoanTable from "../components/loan/LoanTable";

const LoanManageContent = () => {
  const {
    loans,
    loading,
    error,
    statistics,
    fetchLoans,
    fetchStatistics,
    confirmPickupWithCode, // 🆕 Thêm pickup với code function
  } = useLoanAdmin();

  useEffect(() => {
    fetchLoans();
    fetchStatistics();
  }, [fetchLoans, fetchStatistics]);

  const handleRefresh = async () => {
    await fetchLoans();
    await fetchStatistics();
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <FaBookReader className="mr-2 sm:mr-3 text-blue-600 dark:text-blue-400 text-xl sm:text-2xl" />
              <span className="hidden sm:inline">Quản lý mượn trả</span>
              <span className="sm:hidden">Mượn trả</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
              Tổng số: {statistics.total} phiếu mượn
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 text-sm sm:text-base"
            >
              <FaSync
                className={`mr-1 sm:mr-2 text-sm ${
                  loading ? "animate-spin" : ""
                }`}
              />
              <span className="hidden sm:inline">Làm mới</span>
              <span className="sm:hidden">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards - ENHANCED với quy trình 5 giai đoạn */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 sm:gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FaClipboardList
                className="text-purple-600 dark:text-purple-400"
                size={16}
              />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Tổng phiếu
              </p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {statistics.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FaClock className="text-blue-600 dark:text-blue-400" size={16} />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Chờ duyệt
              </p>
              <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                {statistics.pendingRequests}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FaCheck
                className="text-green-600 dark:text-green-400"
                size={16}
              />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Chờ nhận
              </p>
              <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                {statistics.awaitingPickup}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <FaClock
                className="text-yellow-600 dark:text-yellow-400"
                size={16}
              />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Đang mượn
              </p>
              <p className="text-xl font-semibold text-yellow-600 dark:text-yellow-400">
                {statistics.active}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <FaExclamationTriangle
                className="text-red-600 dark:text-red-400"
                size={16}
              />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Quá hạn
              </p>
              <p className="text-xl font-semibold text-red-600 dark:text-red-400">
                {statistics.overdue}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <FaClock
                className="text-indigo-600 dark:text-indigo-400"
                size={16}
              />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Chờ gia hạn
              </p>
              <p className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                {statistics.pendingRenewal}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
              <FaCheck className="text-gray-600 dark:text-gray-400" size={16} />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Đã trả
              </p>
              <p className="text-xl font-semibold text-gray-600 dark:text-gray-400">
                {statistics.returned}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <LoanSearchForm />
      </div>

      {/* Error Display */}
      {error && !loading && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                Có lỗi xảy ra
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Danh sách phiếu mượn
            </h2>

            {/* Quick filters - ENHANCED cho quy trình 5 giai đoạn */}
            <div className="flex flex-wrap gap-2">
              {/* Ưu tiên hiển thị các yêu cầu cần action từ admin */}
              {statistics.pendingRequests > 0 && (
                <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full border-2 border-blue-300 dark:border-blue-600">
                  <FaClock className="mr-1" />
                  🟦 {statistics.pendingRequests} chờ duyệt
                </span>
              )}
              {statistics.awaitingPickup > 0 && (
                <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full border-2 border-green-300 dark:border-green-600">
                  <FaCheck className="mr-1" />
                  🟩 {statistics.awaitingPickup} chờ nhận
                </span>
              )}
              {statistics.pendingRenewal > 0 && (
                <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full border-2 border-indigo-300 dark:border-indigo-600">
                  <FaClock className="mr-1" />
                  🟪 {statistics.pendingRenewal} chờ gia hạn
                </span>
              )}
              {statistics.overdue > 0 && (
                <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full border-2 border-red-300 dark:border-red-600">
                  <FaExclamationTriangle className="mr-1" />
                  🟥 {statistics.overdue} quá hạn
                </span>
              )}
              {/* Thông tin chung không cần action */}
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
                <FaClock className="mr-1" />
                {statistics.active} đang mượn
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <LoanTable />
        </div>
      </div>
    </div>
  );
};

const LoanManagePage = () => {
  return (
    <LoanAdminProvider>
      <LoanManageContent />
    </LoanAdminProvider>
  );
};

export default LoanManagePage;
