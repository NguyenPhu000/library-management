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
import MemberTable from "../components/member/MemberTable";
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
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8 py-4 lg:py-6 xl:py-8">
        {/* Page Header */}
        <div className="mb-4 lg:mb-6 xl:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl xl:text-3xl font-bold text-gray-900 truncate">
                Quản lý Thành viên
              </h1>
              <p className="mt-1 lg:mt-2 text-sm text-gray-600">
                Quản lý {totalMembers} thành viên trong hệ thống thư viện
              </p>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
              <button
                onClick={handleSyncMembers}
                disabled={loading}
                className="inline-flex items-center px-3 lg:px-4 py-2 bg-green-600 text-white text-xs lg:text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FaSync
                  className={`mr-1 lg:mr-2 h-3 lg:h-4 w-3 lg:w-4 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
                <span className="hidden sm:inline">Đồng bộ thành viên</span>
                <span className="sm:hidden">Đồng bộ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 xl:gap-6 mb-4 lg:mb-6 xl:mb-8">
          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-3 lg:p-4 xl:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 lg:w-8 h-6 lg:h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaUserTag className="w-3 lg:w-4 xl:w-5 h-3 lg:h-4 xl:h-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-2 lg:ml-3 xl:ml-4 min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium text-gray-500 truncate">
                  Tổng thành viên
                </p>
                <p className="text-lg lg:text-xl xl:text-2xl font-semibold text-gray-900">
                  {totalMembers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-3 lg:p-4 xl:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 lg:w-8 h-6 lg:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaCheck className="w-3 lg:w-4 xl:w-5 h-3 lg:h-4 xl:h-5 text-green-600" />
                </div>
              </div>
              <div className="ml-2 lg:ml-3 xl:ml-4 min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium text-gray-500 truncate">
                  Đang hoạt động
                </p>
                <p className="text-lg lg:text-xl xl:text-2xl font-semibold text-gray-900">
                  {activeMembers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-3 lg:p-4 xl:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 lg:w-8 h-6 lg:h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FaClock className="w-3 lg:w-4 xl:w-5 h-3 lg:h-4 xl:h-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-2 lg:ml-3 xl:ml-4 min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium text-gray-500 truncate">
                  Sắp hết hạn
                </p>
                <p className="text-lg lg:text-xl xl:text-2xl font-semibold text-gray-900">
                  {expiringSoonMembers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-3 lg:p-4 xl:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 lg:w-8 h-6 lg:h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <FaExclamationTriangle className="w-3 lg:w-4 xl:w-5 h-3 lg:h-4 xl:h-5 text-red-600" />
                </div>
              </div>
              <div className="ml-2 lg:ml-3 xl:ml-4 min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium text-gray-500 truncate">
                  Đã hết hạn
                </p>
                <p className="text-lg lg:text-xl xl:text-2xl font-semibold text-gray-900">
                  {expiredMembers}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-3 lg:p-4 xl:p-6 mb-3 lg:mb-4 xl:mb-6">
          <MemberSearchForm />
        </div>

        {/* Error Display */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg lg:rounded-xl p-3 lg:p-4 xl:p-6 mb-3 lg:mb-4 xl:mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-600"
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
                <h3 className="text-sm font-medium text-red-800">
                  Có lỗi xảy ra
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="mt-4 text-sm text-gray-500">
                  Đang tải dữ liệu...
                </p>
              </div>
            </div>
          )}

          {/* Table */}
          {!loading && <MemberTable />}

          {/* Pagination */}
          {!loading && <MemberPagination />}
        </div>
      </div>

      {/* Modals */}
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
