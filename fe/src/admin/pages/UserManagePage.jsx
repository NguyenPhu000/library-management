import React, { useEffect } from "react";
import { FaUsers, FaPlus, FaSync } from "react-icons/fa";
import { UserAdminProvider, useUserAdmin } from "../contexts/UserAdminContext";
import UserSearchForm from "../components/user/UserSearchForm";
import ResponsiveUserTable from "../components/user/ResponsiveUserTable";
import UserForm from "../components/user/UserForm";
import UserPagination from "../components/user/UserPagination";

const UserManageContent = () => {
  const {
    fetchUsers,
    loading,
    totalUsers,
    openCreateModal,
    syncUsers,
    users,
    error,
  } = useUserAdmin();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSyncUsers = async () => {
    await syncUsers();
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <FaUsers className="mr-2 sm:mr-3 text-purple-600 dark:text-purple-400 text-xl sm:text-2xl" />
              <span className="hidden sm:inline">Quản lý tài khoản</span>
              <span className="sm:hidden">Tài khoản</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
              Tổng số: {totalUsers} tài khoản
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={handleSyncUsers}
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
            <button
              onClick={openCreateModal}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm sm:text-base"
            >
              <FaPlus className="mr-1 sm:mr-2 text-sm" />
              <span className="hidden sm:inline">Thêm tài khoản</span>
              <span className="sm:hidden">Thêm</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FaUsers className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Tổng tài khoản
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {totalUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <div className="w-5 h-5 bg-green-600 dark:bg-green-400 rounded-full"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Đang hoạt động
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {users.filter((u) => u.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                AD
              </span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Quản trị viên
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {users.filter((u) => u.role === "admin").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <span className="text-orange-600 dark:text-orange-400 font-bold text-sm">
                MB
              </span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Thành viên
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {users.filter((u) => u.role === "member").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <UserSearchForm />
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
        {!loading && <ResponsiveUserTable />}

        {/* Pagination */}
        {!loading && <UserPagination />}
      </div>

      {/* Modals */}
      <UserForm />
      <UserForm isEdit={true} />
    </div>
  );
};

const UserManagePage = () => {
  return (
    <UserAdminProvider>
      <UserManageContent />
    </UserAdminProvider>
  );
};

export default UserManagePage;
