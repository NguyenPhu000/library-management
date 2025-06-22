import React, { useEffect } from "react";
import {
  FaUsers,
  FaSync,
  FaClock,
  FaCheck,
  FaExclamationTriangle,
  FaUserTag,
} from "react-icons/fa";
import {
  MemberAdminProvider,
  useMemberAdmin,
} from "../contexts/MemberAdminContext";
import MemberSearchForm from "../components/member/MemberSearchForm";
import ResponsiveMemberTable from "../components/member/ResponsiveMemberTable";
import MemberForm from "../components/member/MemberForm";
import MemberPagination from "../components/member/MemberPagination";

const MemberManageContent = () => {
  const { members, totalMembers, loading, error, fetchMembers, syncMembers } =
    useMemberAdmin();

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleSyncMembers = async () => {
    await syncMembers();
  };

  // Calculate stats - ensure members is array
  const membersArray = Array.isArray(members) ? members : [];
  const activeMembers = membersArray.filter(
    (m) => m.status === "Active"
  ).length;
  const expiredMembers = membersArray.filter((m) => {
    if (!m.expiryDate) return false;
    const expiry = new Date(m.expiryDate);
    const today = new Date();
    return expiry < today;
  }).length;
  const expiringSoonMembers = membersArray.filter((m) => {
    if (!m.expiryDate) return false;
    const expiry = new Date(m.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  }).length;

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <FaUserTag className="mr-2 sm:mr-3 text-pink-600 dark:text-pink-400 text-xl sm:text-2xl" />
              <span className="hidden sm:inline">Quản lý thành viên</span>
              <span className="sm:hidden">Thành viên</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
              Tổng số: {totalMembers} thành viên
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={handleSyncMembers}
              disabled={loading}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50 text-sm sm:text-base"
            >
              <FaSync
                className={`mr-1 sm:mr-2 text-sm ${
                  loading ? "animate-spin" : ""
                }`}
              />
              <span className="hidden sm:inline">Đồng bộ</span>
              <span className="sm:hidden">Sync</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FaUserTag
                className="text-purple-600 dark:text-purple-400"
                size={20}
              />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Tổng thành viên
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {totalMembers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FaCheck
                className="text-green-600 dark:text-green-400"
                size={20}
              />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Đang hoạt động
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {activeMembers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <FaClock
                className="text-yellow-600 dark:text-yellow-400"
                size={20}
              />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Sắp hết hạn
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {expiringSoonMembers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <FaExclamationTriangle
                className="text-red-600 dark:text-red-400"
                size={20}
              />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Đã hết hạn
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {expiredMembers}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <MemberSearchForm />
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
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Đang tải dữ liệu...
              </p>
            </div>
          </div>
        )}

        {/* Table */}
        {!loading && <ResponsiveMemberTable />}

        {/* Pagination */}
        {!loading && <MemberPagination />}
      </div>

      {/* Modal */}
      <MemberForm />
    </div>
  );
};

const MemberManagePage = () => {
  return (
    <MemberAdminProvider>
      <MemberManageContent />
    </MemberAdminProvider>
  );
};

export default MemberManagePage;
