import React, { useEffect } from "react";
import { FaUsers, FaPlus, FaSync } from "react-icons/fa";
import { UserAdminProvider, useUserAdmin } from "../contexts/UserAdminContext";
import UserSearchForm from "../components/user/UserSearchForm";
import UserTable from "../components/user/UserTable";
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
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8 py-4 lg:py-6 xl:py-8">
        {/* Page Header */}
        <div className="mb-4 lg:mb-6 xl:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl xl:text-3xl font-bold text-gray-900 truncate">
                Trang quản lý Thư viện
              </h1>
              <p className="mt-1 lg:mt-2 text-sm text-gray-600">
                Quản lý {totalUsers} người dùng trong hệ thống thư viện
              </p>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
              <button
                onClick={handleSyncUsers}
                disabled={loading}
                className="inline-flex items-center px-3 lg:px-4 py-2 bg-green-600 text-white text-xs lg:text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              >
                <FaSync
                  className={`mr-1 lg:mr-2 h-3 lg:h-4 w-3 lg:w-4 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
                <span className="hidden sm:inline">Đồng bộ dữ liệu</span>
                <span className="sm:hidden">Đồng bộ</span>
              </button>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-3 lg:px-4 py-2 bg-blue-600 text-white text-xs lg:text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FaPlus className="mr-1 lg:mr-2 h-3 lg:h-4 w-3 lg:w-4" />
                <span className="hidden sm:inline">Thêm người dùng mới</span>
                <span className="sm:hidden">Thêm mới</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 xl:gap-6 mb-4 lg:mb-6 xl:mb-8">
          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-3 lg:p-4 xl:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 lg:w-8 h-6 lg:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaUsers className="w-3 lg:w-4 xl:w-5 h-3 lg:h-4 xl:h-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-2 lg:ml-3 xl:ml-4 min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium text-gray-500 truncate">
                  Tổng người dùng
                </p>
                <p className="text-lg lg:text-xl xl:text-2xl font-semibold text-gray-900">
                  {totalUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-3 lg:p-4 xl:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 lg:w-8 h-6 lg:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-3 lg:w-4 xl:w-5 h-3 lg:h-4 xl:h-5 bg-green-600 rounded-full"></div>
                </div>
              </div>
              <div className="ml-2 lg:ml-3 xl:ml-4 min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium text-gray-500 truncate">
                  Đang hoạt động
                </p>
                <p className="text-lg lg:text-xl xl:text-2xl font-semibold text-gray-900">
                  {users.filter((u) => u.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-3 lg:p-4 xl:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 lg:w-8 h-6 lg:h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <div className="w-3 lg:w-4 xl:w-5 h-3 lg:h-4 xl:h-5 text-purple-600 font-bold text-xs flex items-center justify-center">
                    AD
                  </div>
                </div>
              </div>
              <div className="ml-2 lg:ml-3 xl:ml-4 min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium text-gray-500 truncate">
                  Quản trị viên
                </p>
                <p className="text-lg lg:text-xl xl:text-2xl font-semibold text-gray-900">
                  {users.filter((u) => u.role === "admin").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-3 lg:p-4 xl:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 lg:w-8 h-6 lg:h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <div className="w-3 lg:w-4 xl:w-5 h-3 lg:h-4 xl:h-5 text-orange-600 font-bold text-xs flex items-center justify-center">
                    MB
                  </div>
                </div>
              </div>
              <div className="ml-2 lg:ml-3 xl:ml-4 min-w-0 flex-1">
                <p className="text-xs lg:text-sm font-medium text-gray-500 truncate">
                  Thành viên
                </p>
                <p className="text-lg lg:text-xl xl:text-2xl font-semibold text-gray-900">
                  {users.filter((u) => u.role === "member").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-3 lg:p-4 xl:p-6 mb-3 lg:mb-4 xl:mb-6">
          <UserSearchForm />
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-sm text-gray-500">
                  Đang tải dữ liệu...
                </p>
              </div>
            </div>
          )}

          {/* Table */}
          {!loading && <UserTable />}

          {/* Pagination */}
          {!loading && <UserPagination />}
        </div>
      </div>

      {/* Modals */}
      <UserForm isEdit={false} />
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
